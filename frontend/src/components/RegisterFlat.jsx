import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const FlatRegistrationForm = () => {
    const [flatnumber, setFlatNumber] = useState('');
    const [currentstay, setCurrentStay] = useState('');
    const [password, setPassword] = useState('');
    const [position, setPosition] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/v1/users/reg', {
                flatnumber,
                currentstay,
                password,
                position
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Flat registered successfully',
                });
                // Clear the form
                setFlatNumber('');
                setCurrentStay('');
                setPassword('');
                setPosition('');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message || 'Something went wrong',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data.message || error.message || 'Internal Server Error',
            });
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Register Flat</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="flatnumber" className="block text-sm font-medium text-gray-700">Flat Number</label>
                    <input
                        id="flatnumber"
                        type="text"
                        value={flatnumber}
                        onChange={(e) => setFlatNumber(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="currentstay" className="block text-sm font-medium text-gray-700">Current Stay</label>
                    <select
                        id="currentstay"
                        value={currentstay}
                        onChange={(e) => setCurrentStay(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Current Stay</option>
                        <option value="tenant">Tenant</option>
                        <option value="owner">Owner</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                    <select
                        id="position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Position</option>
                        <option value="resident">Resident</option>
                        <option value="executive">Executive</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                    Register Flat
                </button>
            </form>
        </div>
    );
};

export default FlatRegistrationForm;
