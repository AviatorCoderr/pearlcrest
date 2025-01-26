import Vote from '../models/encryptedvotes.model.js';
import AuditLog from '../models/audit.model.js';
import Election from '../models/election.model.js';
import crypto from 'crypto-js'; // To encrypt/decrypt votes
import jwt from 'jsonwebtoken'; // For verifying the logged-in user
import { Candidate } from '../models/candidates.model.js';
import { ApiError } from '../utils/ApiError.js';
import electionOfficer from '../models/Electionofficer.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asynchandler.js';
const encryptVote = (voteData) => {
    const secretKey = process.env.SECRET_KEY;
    return voteData.map(vote => crypto.AES.encrypt(vote, secretKey).toString());
  };

  const flattenVotes = (votes) => {
    return [
      ...votes.president,
      ...votes.treasurer,
      ...votes.secretary,
      ...votes.executiveAblock,
      ...votes.executiveBblock,
      ...votes.executiveCblock,
      ...votes.executiveDblock,
    ];
  };
// Store the encrypted votes from frontend
const createOfficer = async (req, res) => {
  try {
    const {fullName, email} = req.body
    const createOfficer = await electionOfficer.create({fullName, email});
    res.status(201).json({ success: true, createOfficer, message: 'Officer created successfully.' });
  } catch (error) {
    console.error('Error in creating officer:', error);
    res.status(500).json({ success: false, message: 'Error creating officer' });
  }
};

const storeVote = async (req, res) => {
  try {
    const { votes } = req.body;
    console.log("votes", votes)
    const encryptedVotes = encryptVote(votes)
    const userId = req?.voter?.id;
    const prev = await Vote.findOne({userId})
    if(prev) throw new ApiError(500, "Vote already given")
    const ele = await Election.findOne();
    if(ele.status!=='ongoing') throw new ApiError(400, "Election not started")
    const newVote = new Vote({
      userId,
      encryptedVotes,
    });

    await newVote.save();

    // Log the audit trail
    const auditLog = new AuditLog({
      userId,
      action: 'Voted',
      description: `User ${userId} has voted.`,
    });

    await auditLog.save();

    res.status(201).json({ success: true, message: 'Vote submitted successfully.' });
  } catch (error) {
    console.error('Error storing vote:', error);
    res.status(500).json({ success: false, message: 'Error submitting vote.' });
  }
};

// Generate vote receipt
const generateVoteReceipt = async (req, res) => {
  try {
    const userId = req?.voter?.id;

    // Retrieve the most recent vote for the user
    const vote = await Vote.findOne({ userId }).sort({ voteTimestamp: -1 }).limit(1);
    if (!vote) {
      return res.status(404).json({ success: false, message: 'No vote found.' });
    }

    // Generate readable receipt from encrypted vote data
    const secretKey = process.env.SECRET_KEY;
    const decryptedVotes = vote.encryptedVotes.map((encryptedVote) => {
      const bytes = crypto.AES.decrypt(encryptedVote, secretKey);
      return bytes.toString(crypto.enc.Utf8);
    });

    // Structure the readable receipt
    const structuredVotes = [];
    const posts = ['president', 'treasurer', 'secretary', 'executiveAblock', 'executiveBblock', 'executiveCblock', 'executiveDblock'];
    posts.forEach(post => {
      const candidates = decryptedVotes.filter(vote => vote.startsWith(post)); // Filter votes by post type
      if (candidates.length > 0) {
        structuredVotes.push({
          post: post.charAt(0).toUpperCase() + post.slice(1), // Capitalize the first letter of each post
          candidates
        });
      }
    });

    // Generate a verification token (hash of the receipt)
    const receiptData = JSON.stringify(structuredVotes);
    const verificationToken = crypto.MD5(receiptData).toString();

    // Store verification token (optional) in the audit log for future reference
    const auditLog = new AuditLog({
      userId,
      action: 'Vote Receipt Generated',
      description: `Generated vote receipt with verification token for user ${userId} with token ${verificationToken}`,
      verificationToken
    });
    await auditLog.save();

    // Return the readable vote receipt with the verification token
    return res.status(200).json({
      success: true,
      message: 'Vote receipt generated successfully.',
      verificationToken,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error generating vote receipt:', error);
    return res.status(500).json({ success: false, message: 'Error generating vote receipt.' });
  }
};

const createElection = async(req, res) => {
  try {
    const election = new Election({});
    await election.save();
    res.status(201).json({ success: true, message: 'election created' });
  } catch (error) {
    console.error('Error creating election:', error);
    res.status(500).json({ success: false, message: 'Error setting election timer.' });
  }
}
const startElectionTimer = async (req, res) => {
  try {
    const election = await Election.findOne();
    election.status = "ongoing";
    await election.save();
    return res.status(201).json({ success: true, message: 'election started' });
  } catch (error) {
    console.error('Error starting election:', error);
    return res.status(500).json({ success: false, message: 'Error starting election.' });
  }
};

const endElectionTimer = async (req, res) => {
  try {
    const election = await Election.findOne();
    election.status = "finished";
    await election.save();
    return res.status(201).json({ success: true, message: 'election ended' });
  } catch (error) {
    console.error('Error ending election:', error);
    return res.status(500).json({ success: false, message: 'Error ending election.' });
  }
};

const decryptVotesAndCount = async (req, res) => {
  try {
    console.log("Starting vote decryption and counting process...");

    // Check if the election is ongoing
    const election = await Election.findOne({ status: "finished" });
    if (election.status!=="finished") {
      throw new ApiError(400, "Election not in finished stage")
    }

    // Mark the election as finished
    election.status = "finished";
    await election.save();

    // Retrieve all votes
    const votes = await Vote.find();
    const secretKey = process.env.SECRET_KEY; // Get your secret key from env

    // Initialize a map to store vote counts for candidates
    const candidateVoteCounts = {};

    // Decrypt votes and count them
    for (const vote of votes) {
      const decryptedVotes = vote.encryptedVotes.map((encryptedVote) => {
        const bytes = crypto.AES.decrypt(encryptedVote, secretKey);
        return bytes.toString(crypto.enc.Utf8); // Decrypt nomineeId
      });

      // Count votes for each nominee
      decryptedVotes.forEach((nomineeId) => {
        candidateVoteCounts[nomineeId] = (candidateVoteCounts[nomineeId] || 0) + 1;
      });
    }

    // Batch update candidates with the new vote counts
    await Promise.all(
      Object.entries(candidateVoteCounts).map(async ([nomineeId, votes]) => {
        const candidate = await Candidate.findById(nomineeId);
        if (candidate) {
          candidate.votes += votes;
          await candidate.save();
        }
      })
    );

    // Send success response using ApiResponse
    const response = new ApiResponse(
      200,
      { candidateVoteCounts },
      "Votes decrypted and counted successfully."
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error decrypting and counting votes:", error);

    // Send error response using ApiResponse
    const response = new ApiResponse(
      500,
      null,
      "An error occurred while decrypting and counting votes."
    );
    response.error = error.message; // Attach error details for logging
    return res.status(response.statusCode).json(response);
  }
};

  const resultsDeclared = asyncHandler(async(req, res) => {
    try {
      console.log("hello")
      const election = await Election.findOne();
      election.status = "declared";
      await election.save();
      return res.status(201).json({ success: true, message: 'election result declared' });
    } catch (error) {
      console.error('Error declaring election result:', error);
      return res.status(500).json({ success: false, message: 'Error in declaring election result.' });
    }
  })
const getElectionStatus = async(req, res) => {
  const election = await Election.findOne();
  return res.status(200).json(new ApiResponse(200, election?.status))
}

const getlogs = async(req, res) => {
  console.log("logging")
  const logs = await AuditLog.find().populate('userId');
  return res.status(200).json(new ApiResponse(200, logs))
}
export {
  storeVote,
  getlogs,
  generateVoteReceipt,
  startElectionTimer,
  endElectionTimer,
  decryptVotesAndCount,
  createElection,
  createOfficer,
  getElectionStatus,
  resultsDeclared
};
