import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ClipLoader } from 'react-spinners';

export default function RaiseDemand() {
    const [type, setType] = useState('');
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    const addDemand = async () => {
        if (amount === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Zero Amount',
                text: 'Are you sure you want to raise a demand with zero amount?',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Raise Demand',
                cancelButtonText: 'No, Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    submitDemand();
                }
            });
        } else {
            submitDemand();
        }
    };

    const submitDemand = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/v1/demand/addpaydemand", {
                type: type,
                amount: amount
            });
            // Handle success
            Swal.fire({
                icon: 'success',
                title: 'Demand Raised Successfully',
                text: response.data.message,
            });
            // Clear form
            setType('');
            setAmount(0);
        } catch (error) {
            // Handle error
            Swal.fire({
                icon: 'error',
                title: 'Failed to Raise Demand',
                text: error.response.data.message,
            });
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 rounded-lg shadow-xl">
            <h2 className="text-3xl font-semibold mb-8">Raise New Demand</h2>
            <div className="grid gap-5 p-5 bg-white rounded-lg shadow-md">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        value={type}
                        onChange={(e) => setType(e.target.value.toUpperCase())}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                    />
                </div>
            </div>
            <button
                onClick={() => addDemand()}
                className="mt-5 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                disabled={loading}
            >
                <ClipLoader color="#ffffff" loading={loading} size={20} /> {/* Display ClipLoader while loading */}
                {!loading && 'Raise Demand'} {/* Show text only if not loading */}
            </button>
        </div>
    );
}
