import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaVoteYea, FaTimesCircle, FaLock, FaLockOpen } from 'react-icons/fa';

export default function AddQuestion() {
    const [question, setQuestion] = useState("");
    const [questions, setQuestions] = useState([]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to add this question?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, add it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.post('/api/v1/vote/add-qs', { question });
                    console.log(response.data.message); // Log success message
                    setQuestion(""); // Clear the input field
                    Swal.fire(
                        'Added!',
                        'Your question has been added.',
                        'success'
                    );
                    fetchQuestions(); // Refresh the questions list
                } catch (error) {
                    console.error("Error adding question", error); // Log error
                    Swal.fire(
                        'Error!',
                        'There was an error adding your question.',
                        'error'
                    );
                }
            }
        });
    };

    const handleToggleVoting = async (id, currentStatus) => {
        const action = currentStatus ? 'open' : 'close';
        Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${action} voting for this question?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${action} it!`
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post('/api/v1/vote/close-voting', { questionid: id });
                    Swal.fire(
                        `${action.charAt(0).toUpperCase() + action.slice(1)}d!`,
                        `Voting has been ${action}ed for this question.`,
                        'success'
                    );
                    fetchQuestions(); // Refresh questions after toggling
                } catch (error) {
                    console.error(`Error ${action}ing voting`, error);
                    Swal.fire(
                        'Error!',
                        `There was an error ${action}ing the voting.`,
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
            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">Add Question</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question</label>
                    <input 
                        id="question" 
                        type="text" 
                        value={question} 
                        onChange={(e) => setQuestion(e.target.value)} 
                        className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required 
                    />
                </div>
                <div className="flex justify-center">
                    <button 
                        type="submit" 
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                </div>
            </form>

            <h2 className="text-2xl font-bold mt-8 text-center text-indigo-700">Existing Questions</h2>
            <ul className="mt-4 space-y-4">
                {questions.map((q) => {
                    const totalVotes = q.yes.length + q.no.length;
                    const yesPercentage = calculatePercentage(q.yes.length, totalVotes);
                    const noPercentage = calculatePercentage(q.no.length, totalVotes);
                    const result = q.closed ? (q.yes.length > q.no.length ? 'Passed' : 'Rejected') : null;

                    return (
                        <li key={q._id} className="p-4 bg-white rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-700">{q.question}</span>
                                <button 
                                    onClick={() => handleToggleVoting(q._id, q.closed)} 
                                    className={`inline-flex items-center px-4 py-2 ${q.closed ? 'bg-green-600' : 'bg-red-600'} border border-transparent rounded-md font-semibold text-white hover:${q.closed ? 'bg-green-700' : 'bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${q.closed ? 'red' : 'green'}-500`}
                                >
                                    {q.closed ? <FaLockOpen className="mr-2" /> : <FaLock className="mr-2" />}
                                    {q.closed ? 'Open Voting' : 'Close Voting'}
                                </button>
                            </div>
                            <div className="mb-2">
                                <p className="text-sm text-gray-600 flex items-center">
                                    <FaVoteYea className="mr-2 text-teal-500" /> Yes: {yesPercentage}%
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                                    <div
                                        className="bg-teal-500 h-4 rounded-full"
                                        style={{ width: `${yesPercentage}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600 flex items-center">
                                    <FaTimesCircle className="mr-2 text-rose-500" /> No: {noPercentage}%
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-rose-500 h-4 rounded-full"
                                        style={{ width: `${noPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>Total Votes: {totalVotes}</p>
                                {q.closed && (
                                    <p className={`font-semibold ${result === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>
                                        Result: {result}
                                    </p>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
