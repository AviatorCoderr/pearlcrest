import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import axios from "axios";
import { FiDownload, FiSearch, FiFileText } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { CircleLoader } from 'react-spinners';

export default function PaymentHistory() {
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [transactionsRes, userRes] = await Promise.all([
                    axios.get("/api/v1/account/get-transaction", { withCredentials: true }),
                    axios.get("/api/v1/users/get-current-user", { withCredentials: true })
                ]);
                setTransactions(transactionsRes.data.data.data);
                setUser(userRes.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = transactions.filter(transaction =>
            transaction.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.amount.toString().includes(searchTerm) ||
            transaction.months.some(month => month.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredTransactions(filtered);
    }, [searchTerm, transactions]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const generateReceipt = (transaction) => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Set font styles
        doc.setFont("helvetica");
        
        // Add logo
        const logoData = '/static/images/favicon-32x32.png';
        doc.addImage(logoData, 'PNG', 85, 15, 40, 40);
        
        // Title Section
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("e-Money Receipt", 105, 70, { align: 'center' });
        
        doc.setFontSize(14);
        doc.text("PEARL CREST FLAT OWNERS' SOCIETY", 105, 80, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text("ARGORA, PUNDAG ROAD, ARGORA, RANCHI – 834002", 105, 88, { align: 'center' });
        
        // Receipt Details Box
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(20, 100, 170, 80);
        
        // Receipt Details
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        
        // Row 1
        doc.text("Receipt No:", 25, 110);
        doc.setFont("helvetica", "bold");
        doc.text(transaction._id, 50, 110);
        
        doc.setFont("helvetica", "normal");
        doc.text("Transaction ID:", 110, 110);
        doc.setFont("helvetica", "bold");
        doc.text(transaction.transactionId || "CASH", 140, 110);
        
        // Row 2
        doc.setFont("helvetica", "normal");
        doc.text("Date:", 25, 120);
        doc.setFont("helvetica", "bold");
        doc.text(formatDate(transaction.createdAt), 40, 120);
        
        doc.setFont("helvetica", "normal");
        doc.text("Payment Mode:", 110, 120);
        doc.setFont("helvetica", "bold");
        doc.text(transaction.mode || "CASH", 140, 120);
        
        // Row 3
        doc.setFont("helvetica", "normal");
        doc.text(`Received from Flat No: ${user?.flatnumber || ''}`, 25, 130);
        
        // Row 4
        doc.text("Amount:", 25, 140);
        doc.setFont("helvetica", "bold");
        doc.text(`₹${transaction.amount.toLocaleString('en-IN')}/-`, 45, 140);
        
        // Row 5
        doc.setFont("helvetica", "normal");
        doc.text("For the month of:", 25, 150);
        doc.setFont("helvetica", "bold");
        doc.text(transaction.months.join(", "), 60, 150);
        
        // Row 6
        doc.setFont("helvetica", "normal");
        doc.text(`Purpose: ${transaction.purpose}`, 25, 160);
        
        // Signature Section
        doc.setLineWidth(0.2);
        doc.line(25, 170, 80, 170);
        
        const signatureData = '/static/images/treasurersign.jpg';
        doc.addImage(signatureData, 'JPEG', 120, 165, 40, 20);
        
        doc.setFontSize(12);
        doc.text("Receiver's Signature", 30, 180);
        doc.text("Treasurer", 130, 180);
        
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("This is a computer generated receipt. No signature required.", 105, 190, { align: 'center' });
        doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 105, 195, { align: 'center' });
        
        // Save PDF
        doc.save(`Receipt_${user?.flatnumber}_${transaction.purpose}_${transaction._id.slice(-6)}.pdf`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircleLoader color="#3B82F6" size={60} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Payment History</h2>
                            <p className="text-blue-100">Your transaction records</p>
                        </div>
                        <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                            Flat: {user?.flatnumber || 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-gray-200">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by purpose, amount or month..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6 p-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Total Transactions</h3>
                                <p className="text-sm text-gray-600">All payment records</p>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                                {filteredTransactions.length}
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Total Paid</h3>
                                <p className="text-sm text-gray-600">Overall amount</p>
                            </div>
                            <div className="text-2xl font-bold text-green-600 flex items-center">
                                <FaRupeeSign className="mr-1" /> {filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Last Payment</h3>
                                <p className="text-sm text-gray-600">Most recent transaction</p>
                            </div>
                            <div className="text-sm font-medium text-purple-600">
                                {filteredTransactions.length > 0 ? 
                                    formatDate(filteredTransactions[0].date) : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Purpose
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Months
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Receipt
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction, index) => (
                                        <tr key={transaction._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(transaction.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {transaction.purpose}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {transaction.months.join(", ")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">
                                                <div className="flex items-center justify-end">
                                                    <FaRupeeSign className="mr-1" size={12} />
                                                    {transaction.amount.toLocaleString('en-IN')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button 
                                                    onClick={() => generateReceipt(transaction)}
                                                    className="flex items-center justify-center mx-auto px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm"
                                                >
                                                    <FiDownload className="mr-1" /> Download
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                            {transactions.length === 0 ? 
                                                "No payment records found" : 
                                                "No transactions match your search"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}