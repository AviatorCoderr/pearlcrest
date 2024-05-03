import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function VisitorLog() {
    const [visitor, setVisitor] = useState([]);
    useEffect(() => {
        const getVisitor = async () => {
            try {
                const response = await axios.get("/api/v1/visitor/get-visitor", { withCredentials: true });
                setVisitor(response.data.data.visitors);
            } catch (error) {
                console.log(error);
            }
        };
        getVisitor();
        console.log(visitor)
    }, []);
    return (
        <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
            <strong>Visitors Log</strong>
            <div className='mt-3'>
                <table className='w-full text-gray-700 text-center'>
                    <thead className='bg-gray-100 w-full'>
                        <tr>
                            <th>Name of Visitor</th>
                            <th>Mobile</th>
                            <th>Purpose</th>
                        </tr>
                    </thead>
                    <tbody className='border-t border-gray-400'>
                        {visitor.map(visitor => (
                            <tr key={visitor._id}>
                                <td>{visitor.name}</td>
                                <td>{visitor.mobile}</td>
                                <td>{visitor.purpose}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
