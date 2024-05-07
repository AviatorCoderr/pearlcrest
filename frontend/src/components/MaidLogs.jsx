import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MaidLog() {
    const [maid, setMaid] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
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
        console.log(maid)
    }, []);
    const formatDate = (date) => {
        if(!date) return "NA"
        date = new Date(date)
        const newdate = date.toLocaleString('en-IN', {timeZone: "Asia/Kolkata"})
        return newdate
    }
    return (
        <div className='bg-white rounded-md shadow-md overflow-hidden'>
            <div className='bg-blue-500 text-white py-3 px-4'>
                <strong className='text-lg'>Maid Log</strong>
            </div>
            <div className='px-4 py-3'>
                <table className='w-full text-gray-700 border-collapse border border-gray-300'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='px-4 py-2 border border-gray-300'>Name</th>
                            <th className='px-4 py-2 border border-gray-300'>Mobile</th>
                            <th className='px-4 py-2 border border-gray-300'>Check In</th>
                        </tr>
                    </thead>
                    <tbody className='border-t border-gray-400'>
                        {maid.map(maid => (
                            <tr key={maid._id} className='hover:bg-gray-100 transition-all'>
                                <td className='px-4 py-2 border border-gray-300'>{maid.name}</td>
                                <td className='px-4 py-2 border border-gray-300'>{maid.mobile}</td>
                                <td className='px-4 py-2 border border-gray-300'>{formatDate(maid.checkin)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
