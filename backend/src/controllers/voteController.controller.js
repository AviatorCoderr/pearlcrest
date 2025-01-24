import Vote from '../models/encryptedvotes.model.js';
import AuditLog from '../models/audit.model.js';
import Election from '../models/election.model.js';
import crypto from 'crypto-js'; // To encrypt/decrypt votes
import jwt from 'jsonwebtoken'; // For verifying the logged-in user
import { Candidate } from '../models/candidates.model.js';
import { ApiError } from '../utils/ApiError.js';
import electionOfficer from '../models/Electionofficer.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
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
    console.log(votes)
      
      const vArray = flattenVotes(votes);
      console.log(vArray);
    const encryptedVotes = encryptVote(vArray)
    const userId = req?.voter?.id;
    const prev = await Vote.findOne({userId})
    if(prev) throw new ApiError(500, "Vote already given")
    
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
      const election = await Election.findOne({ status: 'ongoing' });
      if (!election) {
        return res.status(400).json({ success: false, message: 'Election has already ended or not started.' });
      }
  
      election.status = 'finished';
      await election.save();
  
      const votes = await Vote.find();
      const secretKey = process.env.SECRET_KEY; 
  
      const candidateVoteCounts = {};
  
      votes.forEach((vote) => {
        const decryptedVotes = vote.encryptedVotes.map((encryptedVote) => {
          const bytes = crypto.AES.decrypt(encryptedVote, secretKey);
          return bytes.toString(crypto.enc.Utf8); 
        });
  
        decryptedVotes.forEach(async (nomineeId) => {
          const candidate = await Candidate.findById(nomineeId);
          if (candidate) {
            candidate.votes += 1;
            await candidate.save();
          }
        });
      });

      res.status(200).json({ success: true, message: 'Votes decrypted and counted successfully.' });
    } catch (error) {
      console.error('Error decrypting and counting votes:', error);
      res.status(500).json({ success: false, message: 'Error decrypting and counting votes.' });
    }
  };

const getElectionStatus = async(req, res) => {
  const election = await Election.findOne();
  return res.status(200).json(new ApiResponse(200, election?.status))
}

const getlogs = async(req, res) => {
  console.log("logging")
  const logs = await AuditLog.find().populate('userId');
  return res.status(200).json(new ApiResponse(200, logs))
}
const declareResult = async(req, res) => {

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
  getElectionStatus
};
