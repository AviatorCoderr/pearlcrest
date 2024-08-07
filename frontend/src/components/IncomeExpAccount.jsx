import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { useNavigate } from 'react-router-dom';

export default function IncomeStatement() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))?.flatnumber;
        if (user !== "PCS") navigate("/db/unauth");
    }, [navigate]);

    const [recordexp, setRecordexp] = useState([]);
    const [recordinc, setRecordinc] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const getIncomeExpAcc = async () => {
            const response = await axios.get("/api/v1/account/get-income-exp-record", { withCredentials: true });
            setRecordexp(response.data.data.recordexp);
            setRecordinc(response.data.data.recordincome);
        };
        getIncomeExpAcc();
    }, []);

    useEffect(() => {
        const getTransactions = async () => {
            const response = await axios.get("/api/v1/account/get-all-trans");
            setTransactions(response.data.data.data);
        };
        getTransactions();
    }, []);

    const generateExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Income Statement');

        // Add headers with styling
        const headerRow = worksheet.addRow(['Income Head', 'Total Income', 'Expenditure Head', 'Total Expenditure']);
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
                recordinc[i]?._id || '', 
                recordinc[i]?.totalAmount || '', 
                recordexp[i]?._id || '', 
                recordexp[i]?.totalAmount || ''
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
            a.download = 'income_expenditure_account.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };

    const generateTransExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Transactions');

        // Add headers with styling
        const headerRow = worksheet.addRow(['Transaction ID', 'Flat Number', 'Amount', 'Date', 'Mode', 'Purpose', 'Created At', 'Months']);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD700' } // gold color
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

        // Add data with formatting
        transactions.forEach((transaction, index) => {
            const row = worksheet.addRow([
                transaction.transactionId || "CASH",
                transaction.flat.flatnumber,
                transaction.amount,
                new Date(transaction.date).toLocaleDateString(),
                transaction.mode,
                transaction.purpose,
                new Date(transaction.createdAt).toLocaleDateString(),
                transaction.months.join(', ')
            ]);
            // Apply alternate row colors
            if (index % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'E0E0E0' } // light gray color
                };
            }
            row.alignment = { vertical: 'middle', horizontal: 'center' };
        });

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
            a.download = 'transactions.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };

    return (
        <div className='m-5 flex flex-col space-y-3'>
            <button className="bg-blue-500 p-3 text-white font-medium" onClick={generateExcel}>Generate Current Report</button>
            <button className="bg-blue-500 p-3 text-white font-medium" onClick={generateTransExcel}>Generate Transaction Report</button>
        </div>
    );
}
