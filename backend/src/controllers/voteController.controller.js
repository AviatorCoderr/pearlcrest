import Vote from '../models/encryptedvotes.model.js';
import AuditLog from '../models/audit.model.js';
import Election from '../models/election.model.js';
import crypto from 'crypto-js'; // To encrypt/decrypt votes
import jwt from 'jsonwebtoken'; // For verifying the logged-in user
import { Candidate } from '../models/candidates.model.js';
import { ApiError } from '../utils/ApiError.js';

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

// Election Timer Setup
const setElectionTimer = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const election = new Election({ startDate, endDate });

    await election.save();
    res.status(201).json({ success: true, message: 'Election started.' });
  } catch (error) {
    console.error('Error setting election timer:', error);
    res.status(500).json({ success: false, message: 'Error setting election timer.' });
  }
};

// Decrypt and count votes after election ends
const decryptVotesAndCount = async (req, res) => {
    try {
      // Find the ongoing election
      const election = await Election.findOne({ status: 'ongoing' });
      if (!election) {
        return res.status(400).json({ success: false, message: 'Election has already ended or not started.' });
      }
  
      // Change election status to finished
      election.status = 'finished';
      await election.save();
  
      // Fetch all the votes
      const votes = await Vote.find();
      const secretKey = process.env.SECRET_KEY; // The secret key to decrypt the votes
  
      // Initialize the vote count for each candidate
      const candidateVoteCounts = {};
  
      // Iterate over the votes and decrypt them
      votes.forEach((vote) => {
        const decryptedVotes = vote.encryptedVotes.map((encryptedVote) => {
          const bytes = crypto.AES.decrypt(encryptedVote, secretKey);
          return bytes.toString(crypto.enc.Utf8); // Get the decrypted nominee IDs
        });
  
        // Increment the vote count for each candidate in the decrypted votes
        decryptedVotes.forEach(async (nomineeId) => {
          // Find the candidate by nomineeId (assuming the nomineeId is stored in the `Candidate` model)
          const candidate = await Candidate.findById(nomineeId);
          if (candidate) {
            // Increment the vote count for the candidate
            candidate.votes += 1;
  
            // Save the updated candidate vote count
            await candidate.save();
          }
        });
      });
  
      // Send response with success
      res.status(200).json({ success: true, message: 'Votes decrypted and counted successfully.' });
    } catch (error) {
      console.error('Error decrypting and counting votes:', error);
      res.status(500).json({ success: false, message: 'Error decrypting and counting votes.' });
    }
  };

export {
  storeVote,
  generateVoteReceipt,
  setElectionTimer,
  decryptVotesAndCount,
};
