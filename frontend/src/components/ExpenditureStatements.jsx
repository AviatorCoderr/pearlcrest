import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';

export default function ExpenditureStatements() {
    const [department, setDepartment] = useState(null);
    const [executive_name, setExecutive_name] = useState(null);
    const [mode, setMode] = useState(null);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [depthead, setDepthead] = useState([]);
    const [exehead, setExehead] = useState([]);
    const [expst, setExpst] = useState([]);

    useEffect(() => {
        const getDepartment = async () => {
            try {
                const response = await axios.post("http://localhost:8000/api/v1/account/get-expenditure-record", {
                    department,
                    executive_name,
                    mode,
                    start_date: start,
                    end_date: end
                }, {
                    withCredentials: true
                });
                setDepthead(response.data.data.ExpHeads);
                setExpst(response.data.data.ExpRecords);
            } catch (error) {
                console.error("Error fetching Income:", error.message);
            }
        };
        getDepartment();
    }, [department, executive_name, mode, start, end]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(); // You can use any other date formatting method here
    };

    const generateReport = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Expenditure Report');
    
        // Add column headers
        const headers = ['Sl No', 'Party Name', 'Party Contact', 'Narration', 'Department', 'Amount', 'Mode of payment', 'Date', 'By Executive'];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFA500' }, // Orange color
            };
            cell.alignment = { horizontal: 'center' };
        });
        
        // Add data rows
        expst.forEach((ele, index) => {
            const rowData = worksheet.addRow([
                index + 1,
                ele.partyname,
                ele.partycontact,
                ele.description,
                ele.department,
                ele.amount,
                ele.mode,
                formatDate(ele.createdAt),
                ele.executive_name
            ]);
            rowData.eachCell((cell) => {
                cell.alignment = { horizontal: 'center' };
            });
            if (index % 2 === 0) {
                rowData.eachCell((cell) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'DDDDDD' }, // Light gray color
                    };
                });
            }
        });
        
        worksheet.columns.forEach((column) => {
            column.width = 20; // Adjust the width as needed
        });
        
        // Generate the file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Expenditure_Report.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };
    
    
    return (
        <div className='m-5'>
            {/* department filter */}
            <label htmlFor="department" className="block mb-2">Department:</label>
            <select id="department" className="border border-gray-300 rounded-md p-1 mb-4" onChange={(e) => setDepartment(e.target.value)}>
                <option value={null} >Choose one</option>
                {depthead.map((ele, index) => {
                    return (
                        <option key={index} value={ele}>{ele}</option>
                    );
                })}
            </select>
            {/* executive filter */}
            <label htmlFor="executive_name" className="block mb-2">Executive Name:</label>
            <select id="executive_name" className="border border-gray-300 rounded-md p-1 mb-4" onChange={(e) => setExecutive_name(e.target.value)}>
                <option value={null}>Choose one</option>
                {exehead.map((ele, index) => {
                    return (
                        <option key={index} value={ele}>{ele}</option>
                    );
                })}
            </select>
            {/* mode filter */}
            <label htmlFor="mode" className="block mb-2">Mode:</label>
            <select id="mode" className="border border-gray-300 rounded-md p-1 mb-4" onChange={(e) => setMode(e.target.value)}>
                <option value={null}>Choose one</option>
                <option value="CASH">CASH</option>
                <option value="BANK">BANK</option>
            </select>
            {/* startdate filter*/}
            <label htmlFor="start_date" className="block mb-2">Start Date:</label>
            <input id="start_date" type="date" className="border border-gray-300 rounded-md p-1 mb-4" onChange={(e) => setStart(e.target.value)} />
            {/* enddate filter*/}
            <label htmlFor="end_date" className="block mb-2">End Date:</label>
            <input id="end_date" type="date" className="border border-gray-300 rounded-md p-1 mb-4" onChange={(e) => setEnd(e.target.value)} />
            <button onClick={generateReport} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Download Report</button>
            <table className='w-full text-gray-700 text-center table-auto shadow-lg bg-white divide-y divide-gray-200 rounded-lg overflow-hidden'>
                <thead className='bg-gray-200 text-gray-800 uppercase'>
                    <tr>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Sl No</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Party Name</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Party Contact</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Narration</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Department</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Amount</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Mode of payment</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Date</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">By Executive</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {expst.map((ele, index) => (
                        <tr key={index + 1} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
                            <td className="px-6 py-4">{index + 1}</td>
                            <td className="px-6 py-4">{ele.partyname}</td>
                            <td className="px-6 py-4">{ele.partycontact}</td>
                            <td className="px-6 py-4">{ele.description}</td>
                            <td className="px-6 py-4">{ele.department}</td>
                            <td className="px-6 py-4">{ele.amount}</td>
                            <td className="px-6 py-4">{ele.mode}</td>
                            <td className="px-6 py-4">{formatDate(ele.createdAt)}</td>
                            <td className="px-6 py-4">{ele.executive_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
