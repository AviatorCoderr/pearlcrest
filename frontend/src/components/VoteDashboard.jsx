import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function VotingDashboard() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState({});
  const [votedCandidate, setVotedCandidate] = useState({
    president: [],
    treasurer: [],
    secretary: [],
    executiveablock: [],
    executivebblock: [],
    executivecblock: [],
    executivedblock: [],
  });
  const [currentSection, setCurrentSection] = useState('');
  const [progress, setProgress] = useState(0);
  const [voiceRecognitionActive, setVoiceRecognitionActive] = useState(false);

  const sectionRefs = {
    president: useRef(null),
    treasurer: useRef(null),
    secretary: useRef(null),
    executiveablock: useRef(null),
    executivebblock: useRef(null),
    executivecblock: useRef(null),
    executivedblock: useRef(null),
  };

  const votesRequired = {
    president: 1,
    treasurer: 1,
    secretary: 1,
    executiveablock: 2,
    executivebblock: 2,
    executivecblock: 4,
    executivedblock: 1,
  };

  const sectionColors = {
    president: 'bg-blue-500 text-white',
    treasurer: 'bg-yellow-500 text-white',
    secretary: 'bg-green-500 text-white',
    executiveablock: 'bg-red-500 text-white',
    executivebblock: 'bg-purple-500 text-white',
    executivecblock: 'bg-indigo-500 text-white',
    executivedblock: 'bg-teal-500 text-white',
  };

  useEffect(() => {
    axios.get('/api/v1/election/get-cand')
      .then(response => {
        if (response.data.success) {
          const groupedCandidates = response.data.data.reduce((acc, candidate) => {
            const postKey = candidate.post.toLowerCase().replace(/\s+/g, '');
            if (!acc[postKey]) acc[postKey] = [];
            acc[postKey].push(candidate);
            return acc;
          }, {});
          setCandidates(groupedCandidates);
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      })
      .catch(() => {
        Swal.fire({
          title: 'Error Fetching Candidates',
          text: 'There was an error fetching the candidates list.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.dataset.section);
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    const firstSection = Object.keys(sectionRefs).find((ref) => sectionRefs[ref].current);
    if (firstSection) {
      setCurrentSection(firstSection);
    }

    return () => {
      observer.disconnect();
    };
  }, [candidates]);

  useEffect(() => {
    const totalVotes = Object.values(votesRequired).reduce((total, count) => total + count, 0);
    const voted = Object.values(votedCandidate).reduce((total, votes) => total + votes.length, 0);
    setProgress((voted / totalVotes) * 100);
  }, [votedCandidate]);

  const handleVote = (candidate, post) => {
    setVotedCandidate((prev) => {
      const updatedVotes = { ...prev };
      const candidateIndex = updatedVotes[post].indexOf(candidate._id);
      if (candidateIndex > -1) {
        updatedVotes[post].splice(candidateIndex, 1);
      } else if (updatedVotes[post].length < votesRequired[post]) {
        updatedVotes[post].push(candidate._id);
      } else {
        Swal.fire({
          title: 'Vote Limit Reached',
          text: `You can only vote for ${votesRequired[post]} candidate(s) for ${post.replace(/([a-z])([A-Z])/g, '$1 $2')}.`,
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
      return updatedVotes;
    });
  };

  const startVoiceRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    Swal.fire({
      title: 'Voice Recognition Active',
      html: `
        <p>Please say <strong>"Confirm"</strong> clearly to lock your votes.</p>
      `,
      icon: 'info',
      showCancelButton: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isDismissed) {
        recognition.stop();
        setVoiceRecognitionActive(false);
      }
    });
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      if (transcript.includes('confirm')) {
        Swal.close();
        handleFinalSubmit();
      } else {
        Swal.fire({
          title: 'Try Again',
          text: 'We did not hear "Confirm". Please try again.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    };
  
    recognition.onerror = () => {
      Swal.fire({
        title: 'Error',
        text: 'Voice recognition failed. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      setVoiceRecognitionActive(false);
    };
  
    recognition.onend = () => {
      setVoiceRecognitionActive(false);
    };
  
    recognition.start();
    setVoiceRecognitionActive(true);
  };
  

  const handleFinalSubmit = () => {
    const voteData = Object.values(votedCandidate).flat();
    axios.post('/api/v1/ele/vote', {votes: voteData})
      .then(response => {
        if (response.data.success) {
          axios.get('/api/v1/ele/vote-receipt')
            .then(receiptResponse => {
              console.log(receiptResponse)
              Swal.fire({
                title: 'Votes Locked!',
                text: `Verification Token: ${receiptResponse.data.verificationToken}. Save for future uses.`,
                icon: 'success',
                confirmButtonText: 'OK',
              }).then(() => {
                axios.post('/api/v1/election/voter-logout')
                  .then(logoutResponse => {
                    if (logoutResponse.data.success) {
                      navigate('/votelog');
                    } else {
                      Swal.fire({
                        title: 'Logout Failed',
                        text: 'Please try logging out again.',
                        icon: 'error',
                        confirmButtonText: 'OK',
                      });
                    }
                  });
              });
            });
        } else {
          Swal.fire({
            title: 'Submission Failed',
            text: response.data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      })
      .catch(() => {
        Swal.fire({
          title: 'Error',
          text: 'There was an error submitting your votes.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  };

  const formatSectionName = (post) => {
    if (post.startsWith('executive')) {
      const blockLetter = post.slice(-6, -5).toUpperCase();
      return `Executives for ${blockLetter} Block`;
    }
    return post.charAt(0).toUpperCase() + post.slice(1);
  };

  const renderCandidates = (candidates, post) => {
    if (!candidates.length) {
      return <p>No candidates available for {formatSectionName(post)}.</p>;
    }

    const remainingVotes = votesRequired[post] - votedCandidate[post]?.length;
    return (
      <div ref={sectionRefs[post]} data-section={post} className={`mt-6 p-4 rounded-xl shadow-lg ${sectionColors[post]}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold capitalize">{formatSectionName(post)}</h2>
          <p className="text-lg">Vote for {remainingVotes} candidate{remainingVotes > 1 ? 's' : ''}</p>
        </div>
        <ul className="space-y-4">
          {candidates.map((candidate) => (
            <li key={candidate._id} className="flex text-black justify-between items-center p-4 bg-white rounded-lg shadow-md">
              <div className="flex items-center">
                <span className="mr-4">{candidate.name} - Flat: {candidate.flatnumber}</span>
              </div>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${votedCandidate[post].includes(candidate._id) ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                onClick={() => handleVote(candidate, post)}
                disabled={votedCandidate[post].length >= votesRequired[post] && !votedCandidate[post].includes(candidate._id)}
              >
                {votedCandidate[post].includes(candidate._id) ? 'Voted ✅' : 'Vote'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="fixed top-0 left-0 w-full bg-gray-800 text-white py-2 shadow-md text-center">
        <div className="w-full bg-blue-200 h-2 rounded-full">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="mt-2">Currently Voting: <strong>{currentSection ? formatSectionName(currentSection) : 'None'}</strong></p>
      </div>
      <header className="text-center my-6">
        <h1 className="text-4xl font-bold">Pearl Crest Society Elections 2025</h1>
        <p className="text-lg text-gray-700 italic">"Your vote is your voice—make it count!"</p>
      </header>
      
      {Object.keys(candidates).map((post) => renderCandidates(candidates[post], post))}
      <button
        onClick={startVoiceRecognition}
        className="m-auto my-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700"
        disabled={voiceRecognitionActive}
      >
        {voiceRecognitionActive ? 'Listening...' : 'Lock Votes by Voice'}
      </button>
    </div>
  );
}
