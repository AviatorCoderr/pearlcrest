import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiDollarSign, FiCreditCard, FiArrowUp, FiArrowDown, FiRefreshCw } from 'react-icons/fi';
import { RingLoader } from 'react-spinners';

export default function RecentTransaction() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("/api/v1/account/get-trans-5", { withCredentials: true });
            setTransactions(response.data.data);
        } catch (error) {
            console.error("Error fetching transactions:", error.message);
            setError("Failed to load transactions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const getTransactionIcon = (type) => {
        switch(type.toLowerCase()) {
            case 'income':
                return <FiArrowUp className="text-green-500" />;
            case 'expense':
                return <FiArrowDown className="text-red-500" />;
            default:
                return <FiDollarSign className="text-blue-500" />;
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-700 rounded-lg">
                        <FiCreditCard className="text-white text-xl" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
                        <p className="text-xs text-blue-100">Last 5 transactions</p>
                    </div>
                </div>
                <button 
                    onClick={fetchTransactions}
                    className="p-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-white transition-colors"
                    disabled={loading}
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
                            onClick={fetchTransactions}
                            className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors flex items-center mx-auto"
                        >
                            <FiRefreshCw className="mr-2" /> Retry
                        </button>
                    </div>
                ) : transactions.length > 0 ? (
                    <div className="space-y-4">
                        {transactions.map((transaction) => (
                            <div key={transaction._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        {getTransactionIcon(transaction.purpose)}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800 capitalize">{transaction.purpose}</h3>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(transaction.date)} • {transaction.months.join(", ")}
                                        </p>
                                    </div>
                                </div>
                                <div className={`font-semibold ${
                                    transaction.purpose.toLowerCase() === 'income' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {transaction.purpose.toLowerCase() === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FiDollarSign className="mx-auto text-3xl mb-2 text-gray-300" />
                        <p>No transactions found</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {transactions.length > 0 && !loading && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View all transactions →
                    </button>
                </div>
            )}
        </div>
    );
}