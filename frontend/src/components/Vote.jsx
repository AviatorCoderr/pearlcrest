import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaThumbsUp, FaThumbsDown, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function Vote() {
    const [questions, setQuestions] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const fetchQuestions = async () => {
        try {
            const response = await axios.post('/api/v1/vote/get-all-qs');
            setQuestions(response.data.data);
        } catch (error) {
            console.error("Error fetching questions", error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleVote = async (id, type) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to vote ${type}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, vote ${type}!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post(`/api/v1/vote/vote-${type}`, { questionid: id });
                    Swal.fire(
                        'Voted!',
                        `Your ${type} vote has been cast.`,
                        'success'
                    );
                    fetchQuestions(); // Refresh questions after voting
                } catch (error) {
                    console.error(`Error voting ${type}`, error);
                    Swal.fire(
                        'Error!',
                        `There was an error casting your ${type} vote.`,
                        'error'
                    );
                }
            }
        });
    };

    const calculatePercentage = (votes, total) => {
        return total === 0 ? 0 : Math.round((votes / total) * 100);
    };

    return (
        <div className="p-6 mx-auto bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">Vote on Decisions: GB Meeting</h2>
            {questions.map((q, index) => {
                const totalVotes = q.yes.length + q.no.length;
                const yesPercentage = calculatePercentage(q.yes.length, totalVotes);
                const noPercentage = calculatePercentage(q.no.length, totalVotes);

                // Check if the current user has already voted
                const hasVotedYes = q.yes.includes(currentUser._id);
                const hasVotedNo = q.no.includes(currentUser._id);

                return (
                    <div key={q._id} className="mb-6 p-6 border rounded-lg shadow-md bg-white">
                        <p className="text-xl font-semibold mb-4 text-gray-800">{index + 1}. {q.question}</p>
                        
                        {/* Conditionally render based on whether voting is closed */}
                        {q.closed ? (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                    Voting is closed for this question.
                                </p>
                                <p className="text-lg font-bold text-gray-800">
                                    {q.yes.length > q.no.length ? (
                                        <span className="flex items-center text-green-500">
                                            <FaCheckCircle className="mr-2" /> Passed
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-red-500">
                                            <FaTimesCircle className="mr-2" /> Rejected
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-600">Yes: {yesPercentage}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                                    <div
                                        className="bg-teal-500 h-4 rounded-full"
                                        style={{ width: `${yesPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600">No: {noPercentage}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-rose-500 h-4 rounded-full"
                                        style={{ width: `${noPercentage}%` }}
                                    ></div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>Total Votes: {totalVotes}</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {hasVotedYes || hasVotedNo ? (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600">You have already voted on this question.</p>
                                        <p className="text-lg font-bold text-gray-800">
                                            {hasVotedYes ? (
                                                <span className="flex items-center text-green-500">
                                                    <FaCheckCircle className="mr-2" /> Voted: Yes
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-red-500">
                                                    <FaTimesCircle className="mr-2" /> Voted: No
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-600">Yes: {yesPercentage}%</p>
                                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                                            <div
                                                className="bg-teal-500 h-4 rounded-full"
                                                style={{ width: `${yesPercentage}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600">No: {noPercentage}%</p>
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div
                                                className="bg-rose-500 h-4 rounded-full"
                                                style={{ width: `${noPercentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p>Total Votes: {totalVotes}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-around items-center mb-6">
                                        <button
                                            className="flex items-center bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition duration-300"
                                            onClick={() => handleVote(q._id, 'yes')}
                                        >
                                            <FaThumbsUp className="mr-2" /> Yes
                                        </button>
                                        <button
                                            className="flex items-center bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 transition duration-300"
                                            onClick={() => handleVote(q._id, 'no')}
                                        >
                                            <FaThumbsDown className="mr-2" /> No
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
