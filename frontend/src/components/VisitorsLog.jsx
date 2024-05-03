import React, { useState, useEffect } from 'react';
import { MdOutlineEmojiPeople } from 'react-icons/md';
import axios from "axios";

export default function VisitorLog() {
    const [visitor, setVisitor] = useState([]);

    useEffect(() => {
        const getVisitor = async () => {
            try {
                const response = await axios.get("/api/v1/visitor/get-visitor", { withCredentials: true });
                setVisitor(response.data.data.visitors);
            } catch (error) {
                console.error("Error fetching visitors:", error);
            }
        };
        getVisitor();
    }, []);

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleString('en-US', options);
    };

    return (
        <div className='bg-white rounded-md shadow-md overflow-hidden'>
            <div className='bg-blue-500 text-white py-3 px-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <MdOutlineEmojiPeople className='text-2xl'/>
                    <strong className='text-lg'>Visitor Log</strong>
                </div>
                <div className='text-sm'>Today: {new Date().toLocaleDateString()}</div>
            </div>
            <div className='px-4 py-3'>
                {visitor.length > 0 ? (
                    <table className='w-full text-gray-700'>
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className='px-4 py-2 border border-gray-300'>Name</th>
                                <th className='px-4 py-2 border border-gray-300'>Mobile</th>
                                <th className='px-4 py-2 border border-gray-300'>Check In</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitor.map(visitor => (
                                <tr key={visitor._id} className='hover:bg-gray-100 transition-all'>
                                    <td className='px-4 py-2 border border-gray-300'>{visitor.name}</td>
                                    <td className='px-4 py-2 border border-gray-300'>{visitor.mobile}</td>
                                    <td className='px-4 py-2 border border-gray-300'>{formatDateTime(visitor.checkin)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className='text-gray-600 text-center py-4'>No visitors found</div>
                )}
            </div>
        </div>
    );
}
