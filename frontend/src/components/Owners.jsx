import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';

export default function Owners() {
    const [ownerData, setOwnerData] = useState(null);

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                const response = await axios.get("/api/v1/owners/get-all-owner");
                setOwnerData(response.data.data);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchOwnerData();
    }, []);

    const generateExcelReport = () => {
        if (!ownerData) return;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Owners');

        // Add headers
        worksheet.addRow(['Sl No', 'Flat', 'Name', 'Mobile', 'Aadhar', 'Spouse Name', 'Spouse Mobile']);

        // Add data rows
        ownerData.forEach((owner, index) => {
            const { flat, name, mobile, aadhar, spouse_name, spouse_mobile } = owner;
            const flatNumbers = flat.map(flatObj => flatObj.flatnumber).join(', '); // Join flat numbers with commas
            worksheet.addRow([index + 1, flatNumbers, name, mobile, aadhar, spouse_name, spouse_mobile]);
        });

        // Generate Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'owners_report.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };

    return (
        <div className='m-5 overflow-auto'>
            <button className="bg-blue-500 mb-3 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={generateExcelReport}>
                Generate Excel Report
            </button>
            <table className='w-full text-gray-700 text-center table-auto shadow-lg bg-white divide-y divide-gray-200 rounded-lg overflow-hidden'>
                <thead className='bg-gray-200 text-gray-800 uppercase'>
                    <tr>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Sl No</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Flat</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Name</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Mobile</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Email</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Aadhar</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Spouse Name</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Spouse Mobile</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {ownerData && ownerData.map((ele, index) => (
                        <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
                            <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ele.flat ? ele.flat.map(flatObj => flatObj.flatnumber).join(', ') : "NA"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ele.name || "NA"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ele.mobile || "NA"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ele.email || "NA"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ele.aadhar || "NA"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ele.spouse_name || "NA"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ele.spouse_mobile || "NA"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
