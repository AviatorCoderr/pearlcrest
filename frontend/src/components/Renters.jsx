import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';

export default function Renters() {
    const [renterData, setRenterData] = useState(null);

    useEffect(() => {
        const fetchRenterData = async () => {
            try {
                const response = await axios.get("/api/v1/renters/get-all-renter");
                setRenterData(response.data.data);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchRenterData();
        console.log(renterData)
    }, []);

    const generateExcelReport = () => {
        if (!renterData) return;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Renters');

        // Add headers
        worksheet.addRow(['Sl No', 'Name', 'Flat', 'Mobile', 'Aadhar', 'Spouse Name', 'Spouse Mobile']);

        // Add data rows
        renterData.forEach((renter, index) => {
            const { flat, name, mobile, aadhar, spouse_name, spouse_mobile } = renter;
            const flatNumbers = flat?.flatnumber; // Join flat numbers with commas
            worksheet.addRow([index + 1, flatNumbers, name, mobile, aadhar, spouse_name, spouse_mobile]);
        });


        // Generate Excel file
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'renters_report.xlsx';
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
                        <th className="px-6 py-3 text-center text-sm font-semibold">Flat Number</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Name</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Mobile</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Email</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Aadhar</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Spouse Name</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Spouse Mobile</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {renterData && renterData?.map((renter, index) => (
                        <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
                            <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{renter?.flat?.flatnumber || "NA"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{renter.name || "NA"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{renter.mobile || "NA"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{renter.email || "NA"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{renter.aadhar || "NA"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{renter.spouse_name || "NA"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{renter.spouse_mobile || "NA"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
