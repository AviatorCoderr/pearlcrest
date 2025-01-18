import React, { useState } from 'react';
import Swal from 'sweetalert2';

import { president, treasurer, secretary, executiveAblock, executiveBblock, executiveCblock, executiveDblock } from '../candidates.js';

export default function VotingDashboard() {
  const [votedCandidate, setVotedCandidate] = useState({
    president: [],
    treasurer: [],
    secretary: [],
    executiveAblock: [],
    executiveBblock: [],
    executiveCblock: [],
    executiveDblock: [],
  });

  const votesRequired = {
    president: 1,
    treasurer: 1,
    secretary: 1,
    executiveAblock: 2,
    executiveBblock: 2,
    executiveCblock: 4,
    executiveDblock: 1,
  };

  const handleVote = (candidate, post) => {
    let updatedVotes = { ...votedCandidate };

    // Toggle the vote for the candidate: remove if already voted, add if not voted
    if (updatedVotes[post].includes(candidate.name)) {
      // Remove vote if already voted for this candidate
      updatedVotes[post] = updatedVotes[post].filter(vote => vote !== candidate.name);
    } else {
      // Check if the vote limit for the post is not exceeded
      if (updatedVotes[post].length < votesRequired[post]) {
        updatedVotes[post] = [...updatedVotes[post], candidate.name];
      } else {
        Swal.fire({
          title: 'Vote Limit Reached',
          text: `You can only vote for ${votesRequired[post]} candidate(s) for ${post.charAt(0).toUpperCase() + post.slice(1)}.`,
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    }

    setVotedCandidate(updatedVotes);
  };

  const handleFinalSubmit = () => {
    // Show confirmation with all votes
    const confirmationList = [];
    for (const post in votedCandidate) {
      if (Array.isArray(votedCandidate[post]) && votedCandidate[post].length > 0) {
        confirmationList.push(...votedCandidate[post].map((name) => `${name} - ${post}`));
      }
    }

    if (confirmationList.length == 0) {
      Swal.fire({
        title: "No Votes Cast",
        text: "Please cast your votes before submitting.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    Swal.fire({
      title: "Please review your votes.",
      html: confirmationList.map((vote) => `<p>${vote}</p>`).join(''),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Click here and speak "confirm"  यहाँ क्लिक करे और "कन्फर्म" बोले',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
          const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
          recognition.lang = 'en-US';
          recognition.start();

          recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript.toLowerCase();
            if (spokenText === 'confirm') {
              Swal.fire({
                title: "Votes Locked!",
                text: "Your votes have been successfully submitted.",
                icon: "success",
                confirmButtonText: "OK",
              });
            } else {
              Swal.fire({
                title: "Voice Confirmation Failed",
                text: "You did not say 'confirm'. Your votes have not been locked.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          };

          recognition.onerror = () => {
            Swal.fire({
              title: "Voice Recognition Error",
              text: "There was an error with voice recognition. Please try again.",
              icon: "error",
              confirmButtonText: "OK",
            });
          };
      }
    });
  };

  const renderCandidates = (candidates, post) => {
    const remainingVotes = votesRequired[post] - votedCandidate[post].length;
    return (
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {post.charAt(0).toUpperCase() + post.slice(1)} (Please vote {remainingVotes} more candidate{remainingVotes > 1 ? 's' : ''})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <div key={candidate.flatnumber} className="bg-white p-4 rounded-lg shadow-lg text-center hover:shadow-2xl transition-all">
              <img
                src={candidate.photo || "https://via.placeholder.com/150"}
                alt={candidate.name}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-bold text-gray-800">{candidate.name}</h2>
              <p className="text-sm text-gray-500">Flat Number: {candidate.flatnumber}</p>
              <p className="text-sm text-gray-500">Nominee ID: {candidate.nomineeId}</p>
              <button
                className="w-full bg-blue-600 text-white py-2 mt-4 rounded-md font-semibold hover:bg-blue-700 transition-all"
                onClick={() => handleVote(candidate, post)}
                disabled={votedCandidate[post].length >= votesRequired[post] && !votedCandidate[post].includes(candidate.name)}
              >
                {votedCandidate[post].includes(candidate.name) ? 'Voted ✅' : 'Vote Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-5">
      <header className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">🗳️ Pearl Crest Society Elections 2025</h1>
          <p className="text-gray-500">"Your Vote, Your Voice – Make it Count!"</p>
        </div>
      </header>

      <section className="mt-10">
        {/* President Post */}
        {renderCandidates(president, "president")}

        {/* Treasurer Post */}
        {renderCandidates(treasurer, "treasurer")}

        {/* Secretary Post */}
        {renderCandidates(secretary, "secretary")}

        {/* Executive A Block */}
        {renderCandidates(executiveAblock, "executiveAblock")}

        {/* Executive B Block */}
        {renderCandidates(executiveBblock, "executiveBblock")}

        {/* Executive C Block */}
        {renderCandidates(executiveCblock, "executiveCblock")}

        {/* Executive D Block */}
        {renderCandidates(executiveDblock, "executiveDblock")}
      </section>

      {/* Final Submit Button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleFinalSubmit}
          className="bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-all"
          disabled={
            Object.keys(votedCandidate).some((post) => votedCandidate[post].length !== votesRequired[post])
          }
        >
          Final Submit
        </button>
      </div>
    </div>
  );
}
