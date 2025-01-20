import express from 'express';
import { verifyElectionOfficer, verifyVoter } from '../middlewares/auth.middleware.js';
import {
  storeVote,
  generateVoteReceipt,
  setElectionTimer,
  decryptVotesAndCount,
} from '../controllers/voteController.controller.js';

const router = express.Router();

// Route to store the encrypted votes
router.post('/vote', verifyVoter, storeVote);

// Route to generate vote receipt
router.get('/vote-receipt', verifyVoter, generateVoteReceipt);

// Route to set the election timer
router.post('/election-timer', verifyElectionOfficer, setElectionTimer);

// Route to decrypt and count votes
router.post('/count-votes', verifyElectionOfficer, decryptVotesAndCount);

export default router;
