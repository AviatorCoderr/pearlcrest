import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';

export default function IncomeStatement() {
    const [income, setIncome] = useState([]);
    const [flatnumber, setFlatnumber] = useState(''); // Default flat number
    const [purpose, setPurpose] = useState(''); // Default purpose
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('')
    const [incomeHead, setIncomeHead] = useState([])
    useEffect(() => {
        const getIncome = async () => {
            try {
                const response = await axios.post("/api/v1/account/get-income-record", {
                    purpose: purpose,
                    flatnumber: flatnumber,
                    start_date: start,
                    end_date: end
                }, {    
                    withCredentials: true
                });
                setIncome(response.data.data.incomeStatements);
                setIncomeHead(response.data.data.IncomeHeads)
            } catch (error) {
                console.error("Error fetching Income:", error.message);
            }
        };
        getIncome();
    }, [flatnumber, purpose]); // Include flatnumber and purpose in the dependency array

    // Function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

    // Function to handle Excel download
    const handleDownload = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Income Statement');
        
        // Title row
        const titleRow = worksheet.addRow(['INCOME FROM ' + (purpose ? purpose.toUpperCase() : 'ALL') + ' FOR ' + (flatnumber ? flatnumber : 'ALL FLATS')]);
        titleRow.getCell(1).font = { bold: true, size: 16 };
    
        // Header row formatting
        const headerRow = worksheet.addRow(['Sl No', 'Flat', 'Purpose', 'Mode', 'Amount', 'Date']);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFA500' }, // Orange color
            };
            cell.alignment = { horizontal: 'center' };
        });
    
        // Data rows
        income.forEach((ele, index) => {
            const row = worksheet.addRow([
                index + 1,
                ele.flatnumber,
                ele.purpose,
                ele.mode,
                ele.amount,
                formatDate(ele.createdAt)
            ]);
            // Alternating row colors
            row.eachCell((cell) => {
                cell.alignment = {horizontal: 'center'}
            })
            if (index % 2 === 0) {
                row.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'DDDDDD' }, // Light gray color
                    };
                });
            }
        });
    
        // Column width
        worksheet.columns.forEach((column) => {
            column.width = 20; // Adjust the width as needed
        });
    
        // Generate blob???
        const blob = await workbook.xlsx.writeBuffer();
    
        // Create download link
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'IncomeStatement.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };
    

    return (
        <div className='m-5'>
            <label className="block mb-2">Select Purpose:</label>
            <select onChange={(e) => setPurpose(e.target.value)} className="block mb-2 border border-gray-300 rounded px-3 py-2">
                <option value="">Choose one</option>
                {incomeHead.map((ele, index) => {
                    return (
                        <option key={index} value={ele}>{ele}</option>
                    );
                })}
            </select>
            <label className="block mb-2">Enter Flat Number:</label>
            <input onChange={(e) => setFlatnumber(e.target.value)} type="text" className="block mb-2 border border-gray-300 rounded px-3 py-2" />
            <label className="block mb-2">Start Date:</label>
            <input onChange={(e) => setStart(e.target.value)} type="date" className="block mb-2 border border-gray-300 rounded px-3 py-2" />
            <label className="block mb-2">End Date:</label>
            <input onChange={(e) => setEnd(e.target.value)} type="date" className="block mb-2 border border-gray-300 rounded px-3 py-2" />
            <button onClick={handleDownload} className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Download Report</button>
            <div className='overflow-auto'>
            <table className='w-full text-gray-700 text-center table-auto shadow-lg bg-white divide-y divide-gray-200 rounded-lg overflow-hidden mt-5'>
                <thead className='bg-gray-200 text-gray-800 uppercase'>
                    <tr>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Sl No</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Flat</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Purpose</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Mode</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Amount</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Date</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {income.map((ele, index) => (
                        <tr key={index + 1} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
                            <td className="px-6 py-4">{index + 1}</td>
                            <td className="px-6 py-4">{ele.flatnumber}</td>
                            <td className="px-6 py-4">{ele.purpose}</td>
                            <td className="px-6 py-4">{ele.mode}</td>
                            <td className="px-6 py-4">{ele.amount}</td>
                            <td className="px-6 py-4">{formatDate(ele.date)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}
