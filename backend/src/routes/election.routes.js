import express from 'express';
import { verifyElectionOfficer, verifyJWT, verifyVoter } from '../middlewares/auth.middleware.js';
import {
  storeVote,
  generateVoteReceipt,
  startElectionTimer,
  endElectionTimer,
  createElection,
  decryptVotesAndCount,
  createOfficer,
  getElectionStatus,
  getlogs,
  resultsDeclared,
  getResults
} from '../controllers/voteController.controller.js';


const router = express.Router();

router.post('/vote', verifyVoter, storeVote);
router.get('/vote-receipt', verifyVoter, generateVoteReceipt);
router.post('/count-votes', verifyElectionOfficer, decryptVotesAndCount);
// router.post('/create-election', createElection);
router.post('/start-election', verifyElectionOfficer, startElectionTimer);
router.post('/end-election', verifyElectionOfficer, endElectionTimer);
router.get('/ele-status', verifyElectionOfficer, getElectionStatus);
// router.post('/create-officer', createOfficer)
router.get('/get-logs', verifyElectionOfficer, getlogs);
router.post('/result-declare', verifyElectionOfficer, resultsDeclared);
router.get('/result', getResults);
export default router;
