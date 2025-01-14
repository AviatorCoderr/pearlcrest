import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { candidates } from '../candidatsData.js'; // Sample data for candidates

export default function VotingDashboard() {
  const [votedCandidate, setVotedCandidate] = useState(null);

  const handleVote = (candidate) => {
    Swal.fire({
      title: `Are you sure you want to vote for ${candidate.name}?`,
      text: "Your vote cannot be changed once cast!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Vote!",
      cancelButtonText: "No, Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setVotedCandidate(candidate.name);
        Swal.fire({
          title: "Vote Cast Successfully!",
          text: `You have voted for ${candidate.name}. Thank you for participating!`,
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-5">
      {/* Header */}
      <header className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">🗳️ Pearl Crest Society Elections 2025</h1>
          <p className="text-gray-500">"Your Vote, Your Voice – Make it Count!"</p>
        </div>
      </header>

      {/* Candidate Cards */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all">
            <img
              src={candidate.image}
              alt={candidate.name}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-gray-800">{candidate.name}</h2>
            <p className="text-gray-600">{candidate.manifesto}</p>
            <button
              className="w-full bg-blue-600 text-white py-2 mt-4 rounded-md font-semibold hover:bg-blue-700 transition-all"
              onClick={() => handleVote(candidate)}
              disabled={votedCandidate}
            >
              {votedCandidate === candidate.name ? "Voted ✅" : "Vote Now"}
            </button>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-500">
        <p>"Voting is the expression of our commitment to ourselves, one another, and this country."</p>
      </footer>
    </div>
  );
}
