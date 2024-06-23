import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJs from 'exceljs';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function FlatDetails() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))?.flatnumber;
        if (user !== 'PCS') navigate('/db/unauth');
    }, [navigate]);

    const [flat_det, setFlat_det] = useState([]);

    useEffect(() => {
        const getFlats = async () => {
            try {
                const response = await axios.get('/api/v1/users/display-flat');
                setFlat_det(response.data.data.flats);
            } catch (error) {
                console.error('Error fetching flats:', error);
            }
        };
        getFlats();
    }, []);

    const formatDate = (lastLogIn) => {
        if (!lastLogIn) return 'Not Logged In';
        return formatDistanceToNow(new Date(lastLogIn), { addSuffix: true });
    };

    const generateExcelReport = () => {
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet('Flat Details');

        // Add headers
        worksheet.addRow(['Sl No', 'Flat Number', 'Current Stay', 'Position', 'Last Logged In']);

        // Add data
        flat_det.forEach((ele, index) => {
            worksheet.addRow([index + 1, ele.flatnumber, ele.currentstay, ele.position, formatDate(ele.lastLogIn)]);
        });

        // Generate Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'flat_details.xlsx';
            a.click();
        });
    };

    return (
        <div className='m-5 overflow-auto'>
            <button className='p-3 bg-blue-500 text-white font-medium m-3' onClick={generateExcelReport}>
                Generate Excel Report
            </button>
            <table className='w-full text-gray-700 text-center table-auto shadow-lg bg-white divide-y divide-gray-200 rounded-lg overflow-hidden'>
                <thead className='bg-gray-200 text-gray-800 uppercase'>
                    <tr>
                        <th className='px-6 py-3 text-center text-sm font-semibold'>Sl No</th>
                        <th className='px-6 py-3 text-center text-sm font-semibold'>Flat Number</th>
                        <th className='px-6 py-3 text-center text-sm font-semibold'>Current Stay</th>
                        <th className='px-6 py-3 text-center text-sm font-semibold'>Position</th>
                        <th className='px-6 py-3 text-center text-sm font-semibold'>Last Logged In</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {flat_det.map((ele, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                            <td className='px-6 py-4 whitespace-nowrap'>{index + 1}</td>
                            <td className='px-6 py-4 whitespace-nowrap'>{ele.flatnumber}</td>
                            <td className='px-6 py-4 whitespace-nowrap'>{ele.currentstay}</td>
                            <td className='px-6 py-4 whitespace-nowrap'>{ele.position}</td>
                            <td className='px-6 py-4 whitespace-nowrap'>{formatDate(ele.lastLogIn)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
