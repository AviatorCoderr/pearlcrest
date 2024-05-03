import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';

export default function IncomeStatement() {
    const [recordexp, setRecordexp] = useState([]);
    const [recordinc, setRecordinc] = useState([]);

    useEffect(() => {
        const getIncomeExpAcc = async () => {
            const response = await axios.get("/api/v1/account/get-income-exp-record", { withCredentials: true });
            setRecordexp(response.data.data.recordexp);
            setRecordinc(response.data.data.recordincome);
        };
        getIncomeExpAcc();
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

    return (
        <div className='m-5'>
            <button className="bg-blue-500 p-3 text-white font-medium" onClick={generateExcel}>Generate Current Report</button>
        </div>
    );
}
