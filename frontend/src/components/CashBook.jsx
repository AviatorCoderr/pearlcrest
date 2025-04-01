import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { FiDownload, FiFilter, FiSearch, FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CircleLoader } from 'react-spinners';

export default function CashBook() {
    const [recordexp, setRecordexp] = useState([]);
    const [recordinc, setRecordinc] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [filteredIncome, setFilteredIncome] = useState([]);
    const [totincome, setTotIncome] = useState(0);
    const [totexpense, setTotExpense] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    // Fetch cash book data
    useEffect(() => {
        const getCashbook = async () => {
            try {
                setLoading(true);
                const response = await axios.post("/api/v1/account/get-books", {
                    mode: "CASH"
                }, { withCredentials: true });
                
                const sortedExpenses = response.data.data.cashexpense.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
                const sortedIncome = response.data.data.cashincomeState.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
                
                setRecordexp(sortedExpenses);
                setRecordinc(sortedIncome);
                setFilteredExpenses(sortedExpenses);
                setFilteredIncome(sortedIncome);
                
            } catch (error) {
                console.error("Error fetching cash book:", error);
            } finally {
                setLoading(false);
            }
        };
        getCashbook();
    }, []);

    // Calculate totals and apply filters
    useEffect(() => {
        const calculateTotals = () => {
            let incomeTotal = 0;
            let expenseTotal = 0;

            for (let record of filteredIncome) {
                incomeTotal += parseFloat(record.amount || 0);
            }

            for (let record of filteredExpenses) {
                expenseTotal += parseFloat(record.amount || 0);
            }

            setTotIncome(incomeTotal);
            setTotExpense(expenseTotal);
        };

        calculateTotals();
    }, [filteredIncome, filteredExpenses]);

    // Apply filters when search term or date range changes
    useEffect(() => {
        const applyFilters = () => {
            let filteredInc = [...recordinc];
            let filteredExp = [...recordexp];

            // Date range filter
            if (startDate && endDate) {
                filteredInc = filteredInc.filter(record => {
                    const recordDate = new Date(record.createdAt);
                    return recordDate >= startDate && recordDate <= endDate;
                });
                filteredExp = filteredExp.filter(record => {
                    const recordDate = new Date(record.createdAt);
                    return recordDate >= startDate && recordDate <= endDate;
                });
            }

            // Search term filter
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                filteredInc = filteredInc.filter(record => 
                    (record.flatnumber && record.flatnumber.toLowerCase().includes(term)) ||
                    (record.purpose && record.purpose.toLowerCase().includes(term)) ||
                    (record.amount && record.amount.toString().includes(term))
                );
                filteredExp = filteredExp.filter(record => 
                    (record.department && record.department.toLowerCase().includes(term)) ||
                    (record.description && record.description.toLowerCase().includes(term)) ||
                    (record.amount && record.amount.toString().includes(term))
                );
            }

            setFilteredIncome(filteredInc);
            setFilteredExpenses(filteredExp);
        };

        applyFilters();
    }, [searchTerm, dateRange, recordinc, recordexp]);

    const generateExcel = () => {
        setLoading(true);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('CashBook');

        // Add headers with styling
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Flat', key: 'flat', width: 10 },
            { header: 'Narration', key: 'narration', width: 30 },
            { header: 'Debit Amount', key: 'debit', width: 15 },
            { header: 'Date', key: 'expDate', width: 15 },
            { header: 'Expense Head', key: 'expHead', width: 20 },
            { header: 'Narration', key: 'expNarration', width: 30 },
            { header: 'Credit Amount', key: 'credit', width: 15 }
        ];

        // Style for headers
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4F81BD' } // blue color
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // Add data
        const maxLength = Math.max(filteredExpenses.length, filteredIncome.length);
        for (let i = 0; i < maxLength; i++) {
            const income = filteredIncome[i];
            const expense = filteredExpenses[i];

            worksheet.addRow({
                date: income ? formatDate(income.createdAt) : '',
                flat: income ? income.flatnumber : '',
                narration: income ? income.purpose : '',
                debit: income ? income.amount : '',
                expDate: expense ? formatDate(expense.createdAt) : '',
                expHead: expense ? expense.department : '',
                expNarration: expense ? expense.description : '',
                credit: expense ? expense.amount : ''
            });
        }

        // Add totals
        worksheet.addRow([]); // Empty row
        worksheet.addRow({
            date: 'TOTAL INCOME',
            debit: totincome
        }).eachCell((cell) => {
            if (cell.value) {
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFC6EFCE' } // light green
                };
            }
        });

        worksheet.addRow({
            expHead: 'TOTAL EXPENSE',
            credit: totexpense
        }).eachCell((cell) => {
            if (cell.value) {
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFC7CE' } // light red
                };
            }
        });

        worksheet.addRow({
            expHead: 'BALANCE',
            credit: (totincome - totexpense).toFixed(2)
        }).eachCell((cell) => {
            if (cell.value) {
                cell.font = { bold: true, size: 14 };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFF00' } // yellow
                };
            }
        });

        // Generate file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Cashbook_${new Date().toISOString().split('T')[0]}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            setLoading(false);
        }).catch(err => {
            console.error("Error generating Excel:", err);
            setLoading(false);
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount)
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
                            <h2 className="text-2xl font-bold text-white">Cash Book</h2>
                            <p className="text-blue-100">Financial transactions record</p>
                        </div>
                        <button 
                            onClick={generateExcel}
                            className="flex items-center bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            <FiDownload className="mr-2" /> Export to Excel
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-gray-200">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => setDateRange(update)}
                            isClearable={true}
                            placeholderText="Filter by date range"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="flex items-center justify-end">
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setDateRange([null, null]);
                                }}
                                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center"
                            >
                                <FiFilter className="mr-1" /> Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6 p-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Total Income</h3>
                                <p className="text-sm text-gray-600">All cash receipts</p>
                            </div>
                            <div className="text-2xl font-bold text-green-600 flex items-center">
                                {formatCurrency(totincome)}
                            </div>
                        </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Total Expense</h3>
                                <p className="text-sm text-gray-600">All cash payments</p>
                            </div>
                            <div className="text-2xl font-bold text-red-600 flex items-center">
                                 {formatCurrency(totexpense)}
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Balance</h3>
                                <p className="text-sm text-gray-600">Current cash position</p>
                            </div>
                            <div className={`text-2xl font-bold flex items-center ${
                                (totincome - totexpense) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                 {formatCurrency(totincome - totexpense)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Income Section */}
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <FiTrendingUp className="mr-2 text-green-500" /> Income Records
                        </h3>
                        <span className="text-sm text-gray-500">
                            Showing {filteredIncome.length} of {recordinc.length} records
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flat</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredIncome.length > 0 ? (
                                    filteredIncome.map((record, index) => (
                                        <tr key={`income-${index}`} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(record.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {record.flatnumber}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {record.purpose}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">
                                                {formatCurrency(record.amount)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No income records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expense Section */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <FiTrendingDown className="mr-2 text-red-500" /> Expense Records
                        </h3>
                        <span className="text-sm text-gray-500">
                            Showing {filteredExpenses.length} of {recordexp.length} records
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense Head</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredExpenses.length > 0 ? (
                                    filteredExpenses.map((record, index) => (
                                        <tr key={`expense-${index}`} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(record.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {record.department}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {record.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">
                                                {formatCurrency(record.amount)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No expense records found
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