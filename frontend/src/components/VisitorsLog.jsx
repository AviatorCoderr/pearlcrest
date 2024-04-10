import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function VisitorLog() {
    const [visitor, setVisitor] = useState([]);
    useEffect(() => {
        const getVisitor = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/visitor/get-visitor", { withCredentials: true });
                setVisitor(response.data.data.visitors);
            } catch (error) {
                console.log(error);
            }
        };
        getVisitor();
        console.log(visitor)
    }, []);
    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleString('en-US', options);
    };
    return (
        <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
            <strong>Visitors Log</strong>
            <div className='mt-3'>
                <table className='w-full text-gray-700 text-center'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <th>Name of Visitor</th>
                            <th>Mobile</th>
                            <th>Number of People</th>
                            <th>Purpose</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                        </tr>
                    </thead>
                    <tbody className='border-t border-gray-400'>
                        {visitor.map(visitor => (
                            <tr key={visitor._id}>
                                <td>{visitor.name}</td>
                                <td>{visitor.mobile}</td>
                                <td>{visitor.numofpeople}</td>
                                <td>{visitor.purpose}</td>
                                <td>{formatDateTime(visitor.checkin)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
