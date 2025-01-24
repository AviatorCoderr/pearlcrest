import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { president, treasurer, secretary, executiveAblock, executiveBblock, executiveCblock, executiveDblock } from '../candidates.js';
import CryptoJS from 'crypto-js'; 
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function VotingDashboard() {
  const navigate = useNavigate();
  const [votedCandidate, setVotedCandidate] = useState({
    president: [],
    treasurer: [],
    secretary: [],
    executiveAblock: [],
    executiveBblock: [],
    executiveCblock: [],
    executiveDblock: [],
  });
  const [currentSection, setCurrentSection] = useState('');  // To track the current voting section
  const [showVoicePrompt, setShowVoicePrompt] = useState(false);
  const sectionRefs = {
    president: useRef(null),
    treasurer: useRef(null),
    secretary: useRef(null),
    executiveAblock: useRef(null),
    executiveBblock: useRef(null),
    executiveCblock: useRef(null),
    executiveDblock: useRef(null),
  };

  const votesRequired = {
    president: 1,
    treasurer: 1,
    secretary: 1,
    executiveAblock: 2,
    executiveBblock: 2,
    executiveCblock: 4,
    executiveDblock: 1,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.dataset.section);
          }
        });
      },
      { threshold: 0.5 }  // Trigger when 50% of the section is in view
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      // Cleanup observer on component unmount
      observer.disconnect();
    };
  }, []);

  const handleVote = (candidate, post) => {
    let updatedVotes = { ...votedCandidate };

    if (updatedVotes[post].includes(candidate.nomineeId)) {
      updatedVotes[post] = updatedVotes[post].filter(vote => vote !== candidate.nomineeId);
    } else {
      if (updatedVotes[post].length < votesRequired[post]) {
        updatedVotes[post] = [...updatedVotes[post], candidate.nomineeId];
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
    const confirmationList = [];
    for (const post in votedCandidate) {
      if (Array.isArray(votedCandidate[post]) && votedCandidate[post].length > 0) {
        confirmationList.push({
          post: post === 'executiveAblock' ? 'Executive for A Block' :
                post === 'executiveBblock' ? 'Executive for B Block' :
                post === 'executiveCblock' ? 'Executive for C Block' :
                post === 'executiveDblock' ? 'Executive for D Block' :
                post.charAt(0).toUpperCase() + post.slice(1),
          candidates: votedCandidate[post],
        });
      }
    }
  
    if (confirmationList.length === 0) {
      Swal.fire({
        title: "No Votes Cast",
        text: "Please cast your votes before submitting.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  
    const tableRows = confirmationList.map((vote) => {
      return `
        <tr>
          <td style="padding: 10px; text-align: left;">${vote.post}</td>
          <td style="padding: 10px; text-align: left;">${vote.candidates.join(', ')}</td>
        </tr>
      `;
    }).join('');
  
    Swal.fire({
      title: "Please review your votes.",
      html: `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Post</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Candidates</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Click here and speak "confirm"  यहाँ क्लिक करे और "कन्फर्म" बोले',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setShowVoicePrompt(true);
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();
  
        recognition.onresult = (event) => {
          const spokenText = event.results[0][0].transcript.toLowerCase();
          if (spokenText === 'confirm') {
            setShowVoicePrompt(true);
            axios.post('/api/v1/ele/vote', { votes: votedCandidate })
              .then((response) => {
                if (response.data.success) {
                  // Show Votes Locked swal
                  Swal.fire({
                    title: "Votes Locked!",
                    text: "Your votes have been successfully submitted.",
                    icon: "success",
                    confirmButtonText: "OK",
                  }).then(() => {
                    // Fetch receipt after confirmation
                    axios.get("/api/v1/ele/vote-receipt")
                      .then((receiptResponse) => {
                        const receipt = receiptResponse.data;
                        // Show receipt after successful vote submission
                        Swal.fire({
                          title: "Vote Receipt",
                          html: `
                            <p><strong>Verification Token:</strong> ${receipt.verificationToken}</p>
                            <p><strong>Timestamp:</strong> ${new Date(receipt.timestamp).toLocaleString()}</p>
                            <p>Thank you for voting! Your vote has been successfully submitted and verified.</p>
                            <p>Kindly note your verification token for future reference.</p>
                          `,
                          icon: "info",
                          confirmButtonText: "OK",
                        }).then(() => {
                          // Redirect to the home page after the receipt confirmation
                          navigate('/');
                        });
                      })
                      .catch(() => {
                        Swal.fire({
                          title: "Error Fetching Receipt",
                          text: "There was an error fetching the receipt.",
                          icon: "error",
                          confirmButtonText: "OK",
                        });
                      });
                  });
                } else {
                  setShowVoicePrompt(true);
                  Swal.fire({
                    title: "Submission Failed",
                    text: "There was an error submitting your votes.",
                    icon: "error",
                    confirmButtonText: "OK",
                  });
                }
              })
              .catch((error) => {
                Swal.fire({
                  title: "Submission Failed",
                  text: "There was an error submitting your votes.",
                  icon: "error",
                  confirmButtonText: "OK",
                });
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
    const sectionColors = {
      president: 'bg-blue-100 text-blue-800 border-blue-300',
      treasurer: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      secretary: 'bg-green-100 text-green-800 border-green-300',
      executiveAblock: 'bg-red-100 text-red-800 border-red-300',
      executiveBblock: 'bg-purple-100 text-purple-800 border-purple-300',
      executiveCblock: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      executiveDblock: 'bg-teal-100 text-teal-800 border-teal-300',
    };

    return (
      <div ref={sectionRefs[post]} data-section={post} className={`mt-6 p-4 rounded-xl shadow-lg border ${sectionColors[post]}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{post === 'executiveAblock' ? 'Executive for A Block' :
             post === 'executiveBblock' ? 'Executive for B Block' :
             post === 'executiveCblock' ? 'Executive for C Block' :
             post === 'executiveDblock' ? 'Executive for D Block' :
             post.charAt(0).toUpperCase() + post.slice(1)}</h2>
          <p className="text-lg">Vote for {remainingVotes} candidate{remainingVotes > 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <div key={candidate.nomineeId} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
              <img
                src={candidate.photo || "https://via.placeholder.com/150"}
                alt={candidate.name}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-blue-600"
              />
              <h3 className="text-xl font-semibold">{candidate.name}</h3>
              <p className="text-sm">Flat Number: {candidate.flatnumber}</p>
              <p className="text-sm">Nominee ID: {candidate.nomineeId}</p>
              <button
                className={`w-full py-2 mt-4 rounded-lg font-medium transition-all ${votedCandidate[post].includes(candidate.nomineeId) ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                onClick={() => handleVote(candidate, post)}
                disabled={votedCandidate[post].length >= votesRequired[post] && !votedCandidate[post].includes(candidate.nomineeId)}
              >
                {votedCandidate[post].includes(candidate.nomineeId) ? 'Voted ✅' : 'Vote Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      {showVoicePrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold">Listening for "Confirm"...</h2>
            <p className="mt-4 text-gray-600">Please speak "confirm" to lock your vote.</p>
            <div className="mt-6">
              <img src="/static/images/mic.png" alt="Mic Icon" className="w-12 h-12 mx-auto" />
            </div>
          </div>
        </div>
      )}
      {currentSection && (
        <div className="fixed z-50 top-0 left-0 right-0 bg-yellow-300 text-black text-center border-2 border-black py-2 font-bold">
          Voting in: {currentSection === 'executiveAblock' ? 'Executive for A Block' :
                      currentSection === 'executiveBblock' ? 'Executive for B Block' :
                      currentSection === 'executiveCblock' ? 'Executive for C Block' :
                      currentSection === 'executiveDblock' ? 'Executive for D Block' :
                      currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
        </div>
      )}

      <header className="bg-white p-8 rounded-xl shadow-lg flex justify-between items-center mb-10 border border-gray-300">
        <div>
          <div className='flex gap-2'>
            <img className='' src='/static/images/favicon-32x32.png'></img>
            <h1 className="text-4xl font-bold text-black">Pearl Crest Society Elections 2025</h1>
          </div>
          <p className="text-lg text-gray-600">Your Vote, Your Voice – Make it Count!</p>
        </div>
      </header>

      <section className="space-y-10">
        {/* Render all the candidates */}
        {renderCandidates(president, "president")}
        {renderCandidates(treasurer, "treasurer")}
        {renderCandidates(secretary, "secretary")}
        {renderCandidates(executiveAblock, "executiveAblock")}
        {renderCandidates(executiveBblock, "executiveBblock")}
        {renderCandidates(executiveCblock, "executiveCblock")}
        {renderCandidates(executiveDblock, "executiveDblock")}
      </section>

      <div className="mt-12 text-center">
        <button
          onClick={handleFinalSubmit}
          className={`bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition-all ${Object.keys(votedCandidate).some((post) => votedCandidate[post].length !== votesRequired[post]) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={Object.keys(votedCandidate).some((post) => votedCandidate[post].length !== votesRequired[post])}
        >
          Finalize & Submit Vote
        </button>
      </div>
    </div>
  );
}
