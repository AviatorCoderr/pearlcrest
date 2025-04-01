import React, { useState, useEffect } from 'react';
import { MdOutlineEmojiPeople, MdSearch, MdRefresh } from 'react-icons/md';
import axios from "axios";
import { RingLoader } from "react-spinners";

export default function VisitorsListDash() {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/v1/visitor/get-visitor", { withCredentials: true });
            const allVisitors = response.data.data.visitors;
            const lastFiveVisitors = allVisitors.slice(Math.max(allVisitors.length - 5, 0));
            setVisitors(lastFiveVisitors);
        } catch (error) {
            console.error("Error fetching visitors:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredVisitors = visitors.filter(visitor => 
        visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.mobile.includes(searchTerm) ||
        visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='bg-white rounded-lg shadow-lg overflow-hidden w-full border border-gray-200'>
            {/* Header */}
            <div className='bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between'>
                <div className='flex items-center gap-3 mb-3 sm:mb-0'>
                    <div className='p-2 bg-blue-700 rounded-lg'>
                        <MdOutlineEmojiPeople className='text-2xl'/>
                    </div>
                    <div>
                        <h2 className='text-xl font-bold'>Recent Visitors</h2>
                        <p className='text-sm text-blue-100'>Last 5 one-time visitors</p>
                    </div>
                </div>
                <div className='flex items-center gap-3 w-full sm:w-auto'>
                    <div className='relative flex-grow sm:w-48'>
                        <MdSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
                        <input
                            type='text'
                            placeholder='Search visitors...'
                            className='pl-10 pr-4 py-2 w-full rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={fetchVisitors}
                        className='p-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-white transition-colors duration-200'
                        title='Refresh'
                    >
                        <MdRefresh className='text-xl'/>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className='px-4 py-3 overflow-auto'>
                {loading ? (
                    <div className='flex justify-center items-center py-8'>
                        <RingLoader color='#3B82F6' size={60} />
                    </div>
                ) : filteredVisitors.length > 0 ? (
                    <div className='overflow-x-auto'>
                        <table className='w-full text-gray-700'>
                            <thead className='bg-gray-100'>
                                <tr className='text-left'>
                                    <th className='px-4 py-3 font-semibold text-gray-600'>Visitor</th>
                                    <th className='px-4 py-3 font-semibold text-gray-600'>Contact</th>
                                    <th className='px-4 py-3 font-semibold text-gray-600'>Purpose</th>
                                    <th className='px-4 py-3 font-semibold text-gray-600'>Check In</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {filteredVisitors.map(visitor => (
                                    <tr key={visitor._id} className='hover:bg-blue-50 transition-colors'>
                                        <td className='px-4 py-3 font-medium'>{visitor.name}</td>
                                        <td className='px-4 py-3 text-blue-600'>
                                            <a href={`tel:${visitor.mobile}`} className='hover:underline'>
                                                {visitor.mobile}
                                            </a>
                                        </td>
                                        <td className='px-4 py-3'>
                                            <span className='px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs'>
                                                {visitor.purpose}
                                            </span>
                                        </td>
                                        <td className='px-4 py-3 text-sm text-gray-500'>
                                            {formatDateTime(visitor.checkin)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className='text-center py-8'>
                        <div className='text-gray-400 mb-2'>
                            <MdOutlineEmojiPeople className='text-4xl mx-auto'/>
                        </div>
                        <p className='text-gray-600 font-medium'>No visitors found</p>
                        {searchTerm && (
                            <p className='text-sm text-gray-500 mt-1'>Try a different search term</p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className='bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center'>
                <span className='text-sm text-gray-500'>
                    Showing {filteredVisitors.length} of {visitors.length} visitors
                </span>
                <button 
                    onClick={fetchVisitors}
                    className='text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1'
                >
                    <MdRefresh className='text-lg'/> Refresh
                </button>
            </div>
        </div>
    );
}