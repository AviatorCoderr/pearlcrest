import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';

export default function MaintenanceRecord() {
    const [record, setRecord] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const getRecord = async () => {
            try {
                const response = await axios.get("/api/v1/account/get-all-record", {    
                    withCredentials: true
                });
                setRecord(response.data.data.mainrecord);
            } catch (error) {
                console.error("Error fetching Maintenance:", error.message);
            }
        };
        getRecord();
    }, []);

    const getMonthYearString = (date) => {
        return new Intl.DateTimeFormat('en-US', { month: 'long', year: '2-digit' }).format(date);
    };

    const getAllMonthsOfYear = (year) => {
        const months = [];
        for (let i = 0; i < 12; i++) {
            const currentDate = new Date(year, i);
            const monthYearString = getMonthYearString(currentDate);
            months.push(monthYearString);
        }
        return months;
    };

    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
    };

    const years = [];
    for (let i = -4; i <= 1; i++) {
        years.push(new Date().getFullYear() + i);
    }

    const months = getAllMonthsOfYear(selectedYear);

    const handleExportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Maintenance Records');
        
        const headerRow = worksheet.addRow(['Flat Number', ...months]);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFC0C0C0' },
            };
        });
    
        record.forEach((rec) => {
            const rowData = [rec.flat.flatnumber];
            months.forEach((month) => {
                rowData.push(rec.months.includes(month) ? "PAID" : "NOT PAID");
            });
            const row = worksheet.addRow(rowData);
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                if (cell.value === "PAID") {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF98FB98' },
                    };
                } else {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFF6347' },
                    };
                }
            });
        });
    
        worksheet.columns.forEach((column) => {
            let maxWidth = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const cellWidth = cell.value ? String(cell.value).length : 10;
                maxWidth = Math.max(maxWidth, cellWidth);
            });
            column.width = maxWidth < 20 ? 20 : maxWidth;
        });
    
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = 'maintenance_records.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className='m-5'>
            <h2 className="text-3xl font-semibold mb-8">Maintenance Records</h2>
            <div className="mb-4">
                <label htmlFor="year-select" className="mr-2">Select Year:</label>
                <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <button className="p-2 bg-blue-500 text-white font-medium rounded-lg" onClick={handleExportToExcel}>Download Excel</button>
            <div className='overflow-auto'>
            <table className='w-full overflow-scroll text-gray-700 text-center shadow-lg bg-white divide-y divide-gray-200 rounded-lg mt-5'>
                <thead>
                    <tr>
                        <th className='border border-zinc-500 whitespace-nowrap p-3'>Flat Number</th>
                        {months.map((month, index) => {
                            return <th className='border border-zinc-500 whitespace-nowrap p-3' key={index}>{month}</th>
                        })}
                    </tr>
                </thead>
                <tbody>
                        {record?.map((rec, index) => {
                            return (
                            <tr key={index}>
                                <td className="border border-zinc-500">{rec.flat.flatnumber}</td>
                                {months.map((month, idx) => {
                                    return <td className='border border-zinc-500 whitespace-nowrap p-3' key={idx}>{rec.months.includes(month) ? "PAID" : "NOT PAID"}</td>
                                 })}
                            </tr>
                            )
                        })}
                </tbody>
            </table>
            </div>
        </div>
    );
}
