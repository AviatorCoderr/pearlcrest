import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';

export default function CashBook() {
    const [recordexp, setRecordexp] = useState([]);
    const [recordinc, setRecordinc] = useState([]);

    useEffect(() => {
        const getCashbook = async () => {
            const response = await axios.post("/api/v1/account/get-books", {
                mode: "CASH"
            }, { withCredentials: true });
            setRecordexp(response.data.data.cashexpense);
            setRecordinc(response.data.data.cashincomeState);
        };
        getCashbook();
        console.log(recordinc)
        console.log(recordexp)
    }, []);

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

        // Add data with formatting
        const maxLength = Math.max(recordexp.length, recordinc.length);
        for (let i = 0; i < maxLength; i++) {
            const row = worksheet.addRow([
                (i+1<=recordinc.length)?formatDate(recordinc[i]?.createdAt): '',
                (i+1<=recordinc.length)?recordinc[i]?.flatnumber: '',
                (i+1<=recordinc.length)?recordinc[i]?.purpose: '',
                (i+1<=recordinc.length)?recordinc[i]?.amount: '',
                (i+1<=recordexp.length)?formatDate(recordexp[i]?.createdAt) : '',
                (i+1<=recordexp.length)?recordexp[i]?.description: '',
                (i+1<=recordexp.length)?recordexp[i]?.amount : '' 
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
        return date.toLocaleString(); // You can use any other date formatting method here
    };
    return (
        <div className='m-5'>
            <button className="bg-blue-500 p-3 mb-5 text-white font-medium" onClick={generateExcel}>Generate Current Report</button>

            <h2 className='text-lg font-medium border-l-2 bg-zinc-200 border-b-2 shadow-md shadow-black p-2 border-black'>Cash Income</h2>
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
                                <td className="px-4 py-3 text-center text-sm font-semibold">{record.flatnumber}</td>
                                <td className="px-4 py-3 text-center text-sm font-semibold">{formatDate(record.createdAt)}</td>
                                <td className="px-4 py-3 text-center text-sm font-semibold">{record.purpose}</td>
                                <td className="px-4 py-3 text-center text-sm font-semibold">{record.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2 className='text-lg mt-10 font-medium border-l-2 bg-zinc-200 border-b-2 shadow-md shadow-black p-2 border-black'>Cash Expense</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-gray-700 text-center table-auto shadow-lg bg-white divide-y divide-gray-200 rounded-lg overflow-hidden mt-5">
                    <thead className='bg-gray-200 text-gray-800 uppercase'>
                        <tr>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Date</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Description</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recordexp.map((record, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-neutral-100"}>
                                <td className="px-4 py-3 text-center text-sm font-semibold">{formatDate(record.createdAt)}</td>
                                <td className="px-4 py-3 text-center text-sm font-semibold">{record.description}</td>
                                <td className="px-4 py-3 text-center text-sm font-semibold">{record.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}