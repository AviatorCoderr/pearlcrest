import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const OwnerRegistrationForm = () => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [aadhar, setAadhar] = useState('');
    const [email, setEmail] = useState('');
    const [spouseName, setSpouseName] = useState('');
    const [spouseMobile, setSpouseMobile] = useState('');
    const [flatnumber, setFlatNumber] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/v1/owners/add', {
                name,
                mobile,
                aadhar,
                email,
                spouse_name: spouseName,
                spouse_mobile: spouseMobile,
                flatnumber
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Owner registered successfully',
                });
                // Clear the form
                setName('');
                setMobile('');
                setAadhar('');
                setEmail('');
                setSpouseName('');
                setSpouseMobile('');
                setFlatNumber('');
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
            <h2 className="text-xl font-semibold mb-4">Owner Registration</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
                    <input
                        id="mobile"
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700">Aadhar</label>
                    <input
                        id="aadhar"
                        type="text"
                        value={aadhar}
                        onChange={(e) => setAadhar(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="spouseName" className="block text-sm font-medium text-gray-700">Spouse's Name</label>
                    <input
                        id="spouseName"
                        type="text"
                        value={spouseName}
                        onChange={(e) => setSpouseName(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="spouseMobile" className="block text-sm font-medium text-gray-700">Spouse's Mobile</label>
                    <input
                        id="spouseMobile"
                        type="text"
                        value={spouseMobile}
                        onChange={(e) => setSpouseMobile(e.target.value)}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
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
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                    Register Owner
                </button>
            </form>
        </div>
    );
};

export default OwnerRegistrationForm;
