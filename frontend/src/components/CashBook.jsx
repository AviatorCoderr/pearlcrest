import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';

export default function CashBook() {
    const [recordexp, setRecordexp] = useState([]);
    const [recordinc, setRecordinc] = useState([]);
    const [totincome, setTotIncome] = useState(0)
    const [totexpense, setTotExpense] = useState(0)
    useEffect(() => {
        const getCashbook = async () => {
            const response = await axios.post("/api/v1/account/get-books", {
                mode: "CASH"
            }, { withCredentials: true });
            setRecordexp(response.data.data.cashexpense.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)));
            setRecordinc(response.data.data.cashincomeState.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)));
        };
        getCashbook();
        console.log(recordinc)
        console.log(recordexp)
    }, []);

    useEffect(() => {
        const calculateTotals = () => {
            let incomeTotal = 0;
            let expenseTotal = 0;

            for (let record of recordinc) {
                incomeTotal += parseFloat(record.amount || 0);
            }

            for (let record of recordexp) {
                expenseTotal += parseFloat(record.amount || 0);
            }

            setTotIncome(incomeTotal);
            setTotExpense(expenseTotal);
        };

        calculateTotals();
    }, [recordinc, recordexp]);
    const generateExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('CashBook');
    
        // Add headers with styling
        const headerRow = worksheet.addRow(['Date', 'Flat', 'Narration', 'Debit Amount', 'Date',  'Narration', 'Credit Amount']);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD700' } // gold color
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    
        // Calculate totals
        const totalIncome = recordinc.reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);
        const totalExpense = recordexp.reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);
    
        // Add data with formatting
        const maxLength = Math.max(recordexp.length, recordinc.length);
        for (let i = 0; i < maxLength; i++) {
            const row = worksheet.addRow([
                (i < recordinc.length) ? formatDate(recordinc[i]?.createdAt) : '',
                (i < recordinc.length) ? recordinc[i]?.flatnumber : '',
                (i < recordinc.length) ? recordinc[i]?.purpose : '',
                (i < recordinc.length) ? recordinc[i]?.amount : '',
                (i < recordexp.length) ? formatDate(recordexp[i]?.createdAt) : '',
                (i < recordexp.length) ? recordexp[i]?.description : '',
                (i < recordexp.length) ? recordexp[i]?.amount : ''
            ]);
    
            // Apply alternate row colors
            if (i % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E0E0E0' } // light gray color
                };
            }
            row.alignment = { vertical: 'middle', horizontal: 'center' };
        }
    
        // Add totals row for income
        const totalIncomeRow = worksheet.addRow(['', '', 'Total Income', totalIncome, '', '', '']);
        totalIncomeRow.font = { bold: true };
        totalIncomeRow.alignment = { vertical: 'middle', horizontal: 'center' };
        totalIncomeRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' } // yellow color
        };
    
        // Add totals row for expense
        const totalExpenseRow = worksheet.addRow(['', '', '', '', '', 'Total Expense', totalExpense]);
        totalExpenseRow.font = { bold: true };
        totalExpenseRow.alignment = { vertical: 'middle', horizontal: 'center' };
        totalExpenseRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' } // yellow color
        };
    
        // Auto size columns
        worksheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, cell => {
                const columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength + 2;
        });
    
        // Generate file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Cashbook.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      
    return (
        <div className='m-5'>
            <h2 className="text-3xl font-semibold mb-8">CashBook</h2>
            <button className="bg-blue-500 p-3 mb-5 text-white font-medium" onClick={generateExcel}>Generate Current Report</button>
            <h2 className='text-lg font-medium border-l-2 bg-zinc-200 border-b-2 shadow-md shadow-black p-2 border-black'>Cash Income <p className='float-right text-green-600 font-bold text-xl'>₹{totincome}</p></h2>
            <div className="overflow-x-auto">
                <table className="w-full text-gray-700 text-center table-auto shadow-lg bg-white divide-y divide-gray-200 rounded-lg overflow-hidden mt-5">
                    <thead className='bg-gray-200 text-gray-800 uppercase'>
                        <tr>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Flat</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Date</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Description</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recordinc.map((record, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-neutral-100"}>
                                <td className="px-4 py-3 border-2 border-black text-center text-sm font-semibold">{record.flatnumber}</td>
                                <td className="px-4 py-3 border-2 border-black text-center text-sm font-semibold">{formatDate(record.createdAt)}</td>
                                <td className="px-4 py-3 border-2 border-black text-center text-sm font-semibold">{record.purpose}</td>
                                <td className="px-4 py-3 border-2 border-black text-green-600 font-bold text-lg text-right">₹{record.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2 className='text-lg mt-10 font-medium border-l-2 bg-zinc-200 border-b-2 shadow-md shadow-black p-2 border-black'>Cash Expense <p className='text-xl float-right font-bold text-red-600'>₹{totexpense}</p></h2>
            <div className="overflow-x-auto">
                <table className="w-full text-gray-700 text-center table-auto shadow-lg bg-white divide-y divide-gray-200 rounded-lg overflow-hidden mt-5">
                    <thead className='bg-gray-200 text-gray-800 uppercase'>
                        <tr>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Date</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Expense Head</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Description</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recordexp.map((record, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-neutral-100"}>
                                <td className="px-4 border-2 border-black py-3 text-center text-sm font-semibold">{formatDate(record.createdAt)}</td>
                                <td className="px-4 border-2 border-black py-3 text-center text-sm font-semibold">{record.department}</td>
                                <td className="px-4 border-2 border-black py-3 text-center text-sm font-semibold">{record.description}</td>
                                <td className="px-4 border-2 border-black py-3 text-lg font-bold text-red-600 text-right">₹{parseFloat(record.amount).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
