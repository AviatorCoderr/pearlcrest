import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function AddQuestion() {
    const [question, setQuestion] = useState("");

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
                        className="p-1 m-1 font-bold block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
        </div>
    );
}
