import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { FiDownload, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { CircleLoader } from 'react-spinners';

export default function MaintenanceRecord() {
    const [record, setRecord] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const getRecord = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/v1/account/get-all-record", {    
                    withCredentials: true
                });
                // Ensure we're getting the correct data structure
                console.log("API Response:", response.data);
                setRecord(response.data.data.mainrecord);
            } catch (error) {
                console.error("Error fetching Maintenance:", error.message);
            } finally {
                setLoading(false);
            }
        };
        getRecord();
    }, []);

    const getMonthYearString = (date) => {
        return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date);
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

    const filteredRecords = record.filter(rec => 
        rec.flat?.flatnumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Debug: Check what months are being recorded for each flat
    useEffect(() => {
        if (record.length > 0) {
            console.log("Sample record data:", record[0]);
            console.log("Months for first flat:", record[0].months);
        }
    }, [record]);

    const handleExportToExcel = async () => {
        setLoading(true);
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Maintenance Records');
            
            // Header row with styling
            const headerRow = worksheet.addRow(['Flat Number', ...months]);
            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF4F81BD' },
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        
            // Data rows with conditional formatting
            filteredRecords.forEach((rec) => {
                const rowData = [rec.flat?.flatnumber || 'N/A'];
                months.forEach((month) => {
                    // Ensure we're checking the correct month format
                    const isPaid = rec.months?.some(m => 
                        m === month || 
                        new Date(m).getTime() === new Date(month + ' 1, ' + selectedYear).getTime()
                    );
                    rowData.push(isPaid ? "PAID" : "NOT PAID");
                });
                const row = worksheet.addRow(rowData);
                
                row.eachCell((cell, colNumber) => {
                    cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    
                    if (colNumber > 1) {
                        if (cell.value === "PAID") {
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFC6EFCE' },
                            };
                        } else {
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFFFC7CE' },
                            };
                        }
                    }
                });
            });
        
            // Auto-size columns
            worksheet.columns.forEach((column) => {
                let maxWidth = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const cellWidth = cell.value ? String(cell.value).length + 2 : 10;
                    maxWidth = Math.max(maxWidth, cellWidth);
                });
                column.width = maxWidth < 12 ? 12 : maxWidth;
            });
        
            // Generate and download file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
        
            const a = document.createElement('a');
            a.href = url;
            a.download = `Maintenance_Records_${selectedYear}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating Excel:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <CircleLoader color="#3B82F6" size={60} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Maintenance Records</h2>
                            <p className="text-blue-100">Payment status by month</p>
                        </div>
                        <button 
                            onClick={handleExportToExcel}
                            className="flex items-center bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            <FiDownload className="mr-2" /> Export to Excel
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-gray-200">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <FiCalendar className="text-gray-500 mr-2" />
                                <select 
                                    id="year-select" 
                                    value={selectedYear} 
                                    onChange={handleYearChange}
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by flat number..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">Paid</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-sm">Not Paid</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            Showing {filteredRecords.length} of {record.length} flats
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                                    Flat Number
                                </th>
                                {months.map((month, index) => (
                                    <th key={index} scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                        {month}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((rec, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 z-10 bg-inherit">
                                            {rec.flat?.flatnumber || 'N/A'}
                                        </td>
                                        {months.map((month, idx) => {
                                            // Improved month comparison logic
                                            const isPaid = rec.months?.some(m => 
                                                m === month || 
                                                new Date(m).getTime() === new Date(month + ' 1, ' + selectedYear).getTime()
                                            );
                                            return (
                                                <td key={idx} className="px-3 py-4 whitespace-nowrap text-center">
                                                    {isPaid ? (
                                                        <div className="flex justify-center">
                                                            <FiCheckCircle className="text-green-500 text-lg" />
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center">
                                                            <FiXCircle className="text-red-500 text-lg" />
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={months.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No records found for your search criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                            {months.length} months displayed
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}