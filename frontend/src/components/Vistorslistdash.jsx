import React, { useState, useEffect } from 'react';
import { MdOutlineEmojiPeople } from 'react-icons/md';
import axios from "axios";

export default function VisitorsListDash() {
    const [visitor, setVisitor] = useState([]);

    useEffect(() => {
        const getVisitor = async () => {
            try {
                await axios.get("https://pearlcrest.onrender.com/api/v1/visitor/get-visitor", { withCredentials: true })
                .then(response => {
                    console.log(response)
                    setVisitor(response.data.data.visitors);
                })
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
        <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 w-full flex-row flex'>
            <div className='p-3 w-full'>
                <div className='flex gap-2'>
                    <MdOutlineEmojiPeople className='text-2xl text-black'/>
                    <strong>Visitors Log</strong>
                </div>
                <div className='mt-3'>
                    <table className='w-full text-gray-700 text-center'>
                        <thead className='bg-gray-100'>
                            <tr className='flex flex-row gap-6 w-full'>
                                <th className='flex-1'>Name</th>
                                <th className='flex-1'>Mobile</th>
                                <th className='flex-1'>Check In</th>
                            </tr>
                        </thead>
                        <tbody className='border-t border-gray-400'>
                            {visitor.length > 0 ? visitor.map(visitor => (
                                <tr key={visitor._id}>
                                    <td>{visitor.name}</td>
                                    <td>{visitor.mobile}</td>
                                    <td>{formatDateTime(visitor.checkin)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3">No visitors found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
