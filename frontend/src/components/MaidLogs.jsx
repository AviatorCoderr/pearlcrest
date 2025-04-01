import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FiUser, FiPhone, FiCalendar, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';

export default function MaidLog() {
    const [maid, setMaid] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        fetchMaidLogs();
    }, []);

    const fetchMaidLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post("/api/v1/maid/getmaidbyflat", {
                _id: user._id
            }, { withCredentials: true });
            setMaid(response.data.data.response);
        } catch (error) {
            console.error("Error fetching maid logs:", error);
            setError("Failed to load maid logs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        };
        return new Date(dateString).toLocaleString('en-US', options);
    };

    const handleRemoveMaid = (maidid, flatid, maidName) => {
        Swal.fire({
            title: 'Confirm Removal',
            text: `Are you sure you want to remove ${maidName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                removeMaid(maidid, flatid);
            }
        });
    };

    const removeMaid = async (maidid, flatid) => {
        try {
            await axios.delete("/api/v1/maid/deletemaid", {
                data: { maidid, flatid }
            });
            
            Swal.fire({
                icon: 'success',
                title: 'Maid Removed',
                text: 'The maid has been successfully removed',
                timer: 1500,
                showConfirmButton: false
            });
            
            // Optimistic update - remove from UI immediately
            setMaid(prev => prev.filter(m => m._id !== maidid));
            
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error removing maid',
                text: error.response?.data?.message || 'An error occurred',
                timer: 2000
            });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-700 rounded-lg">
                        <FiUser className="text-white text-xl" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Regular Visitors</h2>
                        <p className="text-xs text-blue-100">Maid and service personnel logs</p>
                    </div>
                </div>
                <button 
                    onClick={fetchMaidLogs}
                    className="p-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-white transition-colors"
                    disabled={loading}
                    title="Refresh"
                >
                    <FiRefreshCw className={`text-lg ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <RingLoader color="#3B82F6" size={60} />
                    </div>
                ) : error ? (
                    <div className="text-center py-6 text-red-500">
                        {error}
                        <button 
                            onClick={fetchMaidLogs}
                            className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors flex items-center mx-auto"
                        >
                            <FiRefreshCw className="mr-2" /> Retry
                        </button>
                    </div>
                ) : maid.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-gray-700">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th className="px-4 py-3 font-medium text-gray-600">
                                        <div className="flex items-center">
                                            <FiUser className="mr-2" /> Name
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600">
                                        <div className="flex items-center">
                                            <FiPhone className="mr-2" /> Mobile
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600">Purpose</th>
                                    <th className="px-4 py-3 font-medium text-gray-600">
                                        <div className="flex items-center">
                                            <FiCalendar className="mr-2" /> Last Check-in
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {maid.map(maid => (
                                    <tr key={maid._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium">{maid.name}</td>
                                        <td className="px-4 py-3">
                                            <a 
                                                href={`tel:${maid.mobile}`} 
                                                className="text-blue-600 hover:underline flex items-center"
                                            >
                                                <FiPhone className="mr-1" /> {maid.mobile}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                                {maid.purpose}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {maid.checkin.length > 0 ? formatDate(maid.checkin[maid.checkin.length - 1]) : 'N/A'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleRemoveMaid(maid._id, user._id, maid.name)}
                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                                title="Remove maid"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FiUser className="mx-auto text-3xl mb-2 text-gray-300" />
                        <p>No regular visitors found</p>
                        <p className="text-sm text-gray-400 mt-1">Add maids or service personnel to see them here</p>
                    </div>
                )}
            </div>
        </div>
    );
}