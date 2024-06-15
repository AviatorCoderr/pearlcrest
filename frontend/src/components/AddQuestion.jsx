import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function AddQuestion() {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');

    const fetchQuestions = async () => {
        try {
            const response = await axios.post('/api/v1/vote/get-all-qs');
            setQuestions(response.data.data);
        } catch (error) {
            console.error("Error fetching questions", error);
        }
    };

    const addQuestion = async () => {
        if (!newQuestion.trim()) return;

        try {
            await axios.post('/api/v1/vote/add-qs', { question: newQuestion });
            setNewQuestion('');
            fetchQuestions();
        } catch (error) {
            console.error("Error adding question", error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const calculatePercentage = (votes, total) => {
        return total === 0 ? 0 : Math.round((votes / total) * 100);
    };

    return (
        <div className="p-6 mx-auto bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">Add a New Question</h2>
            <div className="mb-8">
                <input
                    type="text"
                    className="w-full p-2 mb-4 border rounded-lg"
                    placeholder="Enter your question here"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                />
                <button
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
                    onClick={addQuestion}
                >
                    Add Question
                </button>
            </div>

            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">Questions</h2>
            {questions.map((q, index) => {
                const totalVotes = q.yes.length + q.no.length;
                const yesPercentage = calculatePercentage(q.yes.length, totalVotes);
                const noPercentage = calculatePercentage(q.no.length, totalVotes);

                return (
                    <div key={q._id} className="mb-6 p-6 border rounded-lg shadow-md bg-white">
                        <p className="text-xl font-semibold mb-4 text-gray-800">{index + 1}. {q.question}</p>

                        {/* Conditionally render based on whether voting is closed */}
                        <div className="mb-4">
                            {q.closed ? (
                                <div>
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
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    Voting is still open for this question.
                                </p>
                            )}
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
                    </div>
                );
            })}
        </div>
    );
}
