import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RecentTransaction() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get("/api/v1/account/get-trans-5", { withCredentials: true });
                setTransactions(response.data.data);
            } catch (error) {
                console.error("Error fetching transactions:", error.message);
            }
        };

        fetchTransactions();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className='bg-white rounded-sm border border-gray-200 overflow-hidden'>
            <div className='bg-blue-500 text-white py-3 px-4'>
                <strong className='text-lg'>Recent Transactions</strong>
            </div>
            <div className='overflow-x-auto'>
                <table className='w-full table-auto text-gray-700 border-collapse border border-gray-400'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='px-4 py-2 border border-gray-400'>ID</th>
                            <th className='px-4 py-2 border border-gray-400'>Type</th>
                            <th className='px-4 py-2 border border-gray-400'>Amount</th>
                            <th className='px-4 py-2 border border-gray-400'>Month</th>
                            <th className='px-4 py-2 border border-gray-400'>Date</th>
                        </tr>
                    </thead>
                    <tbody className='border-t border-gray-400'>
                        {transactions.map((transaction, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <td className='px-4 py-2 border border-gray-400'>{transaction._id}</td>
                                <td className='px-4 py-2 border border-gray-400'>{transaction.purpose}</td>
                                <td className='px-4 py-2 border border-gray-400'>{transaction.amount}</td>
                                <td className='px-4 py-2 border border-gray-400'>{transaction.months.join(", ")}</td>
                                <td className='px-4 py-2 border border-gray-400'>{formatDate(transaction.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
