import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  FaThumbsUp, 
  FaThumbsDown, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaChartBar,
  FaUsers,
  FaClock,
  FaLock
} from 'react-icons/fa';
import { CircleLoader } from 'react-spinners';

export default function Vote() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'closed'
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/v1/vote/get-all-qs');
            setQuestions(response.data.data);
        } catch (error) {
            console.error("Error fetching questions", error);
            Swal.fire(
                'Error!',
                'Failed to load voting questions. Please try again later.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleVote = async (id, type) => {
        Swal.fire({
            title: 'Confirm Your Vote',
            text: `You are about to vote "${type.toUpperCase()}" on this question. This action cannot be changed.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: type === 'yes' ? '#10B981' : '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: `Confirm ${type.toUpperCase()} Vote`,
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post(`/api/v1/vote/vote-${type}`, { questionid: id });
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: `Voted ${type.toUpperCase()}!`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    fetchQuestions(); // Refresh questions after voting
                } catch (error) {
                    console.error(`Error voting ${type}`, error);
                    Swal.fire(
                        'Voting Failed!',
                        error.response?.data?.message || `There was an error casting your ${type} vote.`,
                        'error'
                    );
                }
            }
        });
    };

    const calculatePercentage = (votes, total) => {
        return total === 0 ? 0 : Math.round((votes / total) * 100);
    };

    const filteredQuestions = questions.filter(q => 
        activeTab === 'active' ? !q.closed : q.closed
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircleLoader color="#3B82F6" size={60} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">General Body Meeting Votes</h2>
                    <p className="text-blue-100">Participate in society decisions</p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'active' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center">
                                <FaClock className="mr-2" /> Active Votes
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('closed')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'closed' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center">
                                <FaLock className="mr-2" /> Closed Votes
                            </div>
                        </button>
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6">
                    {filteredQuestions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto h-24 w-24 text-gray-400">
                                {activeTab === 'active' ? (
                                    <FaClock className="w-full h-full" />
                                ) : (
                                    <FaLock className="w-full h-full" />
                                )}
                            </div>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">
                                No {activeTab === 'active' ? 'active' : 'closed'} voting questions
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {activeTab === 'active' 
                                    ? 'Check back later for new voting questions.' 
                                    : 'View the active tab for current voting questions.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredQuestions.map((q, index) => {
                                const totalVotes = q.yes.length + q.no.length;
                                const yesPercentage = calculatePercentage(q.yes.length, totalVotes);
                                const noPercentage = calculatePercentage(q.no.length, totalVotes);
                                const hasVotedYes = q.yes.includes(currentUser._id);
                                const hasVotedNo = q.no.includes(currentUser._id);
                                const hasVoted = hasVotedYes || hasVotedNo;

                                return (
                                    <div key={q._id} className="border rounded-lg overflow-hidden shadow-sm">
                                        <div className="p-5 bg-white">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                                    {q.closed ? (
                                                        <FaLock className="h-6 w-6 text-blue-600" />
                                                    ) : (
                                                        <FaChartBar className="h-6 w-6 text-blue-600" />
                                                    )}
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {index + 1}. {q.question}
                                                    </h3>
                                                    <div className="mt-2 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <FaUsers className="mr-1" />
                                                            <span>
                                                                {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Voting UI */}
                                            <div className="mt-4">
                                                {q.closed ? (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Final Result:
                                                            </span>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                q.yes.length > q.no.length 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {q.yes.length > q.no.length ? 'APPROVED' : 'REJECTED'}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="flex items-center text-green-600">
                                                                    <FaCheckCircle className="mr-1" /> Yes
                                                                </span>
                                                                <span>{yesPercentage}% ({q.yes.length})</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                <div 
                                                                    className="bg-green-500 h-2.5 rounded-full" 
                                                                    style={{ width: `${yesPercentage}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="flex items-center text-red-600">
                                                                    <FaTimesCircle className="mr-1" /> No
                                                                </span>
                                                                <span>{noPercentage}% ({q.no.length})</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                <div 
                                                                    className="bg-red-500 h-2.5 rounded-full" 
                                                                    style={{ width: `${noPercentage}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {hasVoted ? (
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        Your Vote:
                                                                    </span>
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                        hasVotedYes 
                                                                            ? 'bg-green-100 text-green-800' 
                                                                            : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {hasVotedYes ? 'YES' : 'NO'}
                                                                    </span>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center justify-between text-sm">
                                                                        <span className="flex items-center text-green-600">
                                                                            <FaCheckCircle className="mr-1" /> Yes
                                                                        </span>
                                                                        <span>{yesPercentage}% ({q.yes.length})</span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                        <div 
                                                                            className="bg-green-500 h-2.5 rounded-full" 
                                                                            style={{ width: `${yesPercentage}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center justify-between text-sm">
                                                                        <span className="flex items-center text-red-600">
                                                                            <FaTimesCircle className="mr-1" /> No
                                                                        </span>
                                                                        <span>{noPercentage}% ({q.no.length})</span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                        <div 
                                                                            className="bg-red-500 h-2.5 rounded-full" 
                                                                            style={{ width: `${noPercentage}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-3">
                                                                <p className="text-sm text-gray-600">
                                                                    Cast your vote below:
                                                                </p>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <button
                                                                        onClick={() => handleVote(q._id, 'yes')}
                                                                        className="flex items-center justify-center bg-green-50 text-green-700 hover:bg-green-100 py-3 px-4 rounded-lg border border-green-200 transition-colors duration-200"
                                                                    >
                                                                        <FaThumbsUp className="mr-2" /> Yes
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleVote(q._id, 'no')}
                                                                        className="flex items-center justify-center bg-red-50 text-red-700 hover:bg-red-100 py-3 px-4 rounded-lg border border-red-200 transition-colors duration-200"
                                                                    >
                                                                        <FaThumbsDown className="mr-2" /> No
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}