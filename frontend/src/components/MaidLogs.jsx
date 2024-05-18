import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function MaidLog() {
    const [maid, setMaid] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        const getMaid = async () => {
            try {
                const response = await axios.post("/api/v1/maid/getmaidbyflat", {
                    _id: user._id
                }, { withCredentials: true });
                setMaid(response.data.data.response);
            } catch (error) {
                console.error("Error fetching maid logs:", error);
            }
        };
        getMaid();
    }, []); 

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    const removeMaid = (maidid, flatid) => {
        axios.delete("/api/v1/maid/deletemaid", {
            data: { maidid, flatid }
        })
        .then(response => {
            Swal.fire({
                icon: 'success',
                title: 'Maid Removed',
                timer: 1500
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        })
        .catch(error => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error removing maid',
                text: error.response?.data?.message || 'An error occurred',
                timer: 1500
            });
        });
    };

    return (
        <div className='bg-white rounded-md shadow-md overflow-hidden'>
            <div className='bg-blue-500 text-white py-3 px-4'>
                <strong className='text-lg'>Maid Log</strong>
            </div>
            <div className='px-4 py-3 overflow-auto'>
                <table className='w-full text-gray-700 border-collapse border border-gray-300'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='px-4 py-2 border border-gray-300'>Name</th>
                            <th className='px-4 py-2 border border-gray-300'>Mobile</th>
                            <th className='px-4 py-2 border border-gray-300'>Check In</th>
                            <th className='px-4 py-2 border border-gray-300'>Remove</th>
                        </tr>
                    </thead>
                    <tbody className='border-t border-gray-400'>
                        {maid.map(maid => (
                            <tr key={maid._id} className='hover:bg-gray-100 transition-all'>
                                <td className='px-4 py-2 border border-gray-300'>{maid.name}</td>
                                <td className='px-4 py-2 border border-gray-300'>{maid.mobile}</td>
                                <td className='px-4 py-2 border border-gray-300'>{formatDate(maid.checkin[maid.checkin.length - 1])}</td>
                                <td className='px-4 py-2 border text-center border-gray-300'>
                                    <button 
                                        className="p-2 text-white rounded-sm bg-red-600" 
                                        onClick={() => removeMaid(maid?._id, user?._id)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
