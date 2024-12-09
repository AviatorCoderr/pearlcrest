import React, { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import axios from 'axios';

const MaidAttendance = () => {
  const [maidList, setMaidList] = useState([]);
  const [filteredMaidList, setFilteredMaidList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMaid, setSelectedMaid] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMaidData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = maidList.filter((maid) =>
        maid.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMaidList(filtered);
    } else {
      setFilteredMaidList(maidList);
    }
  }, [searchTerm, maidList]);

  const fetchMaidData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/maid/get-all-maid');
      setMaidList(response.data.data.Maidlist);
      setFilteredMaidList(response.data.data.Maidlist);
    } catch (error) {
      console.error('Error fetching maid data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate Excel file
  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const attendanceData = {};
  
    const getDateRange = (start, end) => {
      const dateArray = [];
      let currentDate = new Date(start);
      const endDate = new Date(end);
  
      while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dateArray;
    };
    
    function getFirstDateOfCurrentYear() {
      const now = new Date();
      const firstDate = new Date(now.getFullYear(), 0, 1); // Month is 0-based (0 = January)
      return firstDate;
    }
    const firstDate = getFirstDateOfCurrentYear();
    // Ensure startDate and endDate are valid
    const dateRange = getDateRange(
      startDate || firstDate,
      endDate || new Date().toISOString().split('T')[0]
    );
  
    maidList.forEach((maid) => {
      if (selectedMaid && selectedMaid !== maid._id) return; // Filter by selected maid
  
      // Initialize attendance for the maid
      attendanceData[maid._id] = {};
  
      // Populate check-in times for the maid
      maid.checkin.forEach((checkinDate) => {
        const date = new Date(checkinDate).toLocaleDateString();
        attendanceData[maid._id][date] = new Date(checkinDate).toLocaleTimeString();
      });
    });
  
    // Prepare the Excel sheet
    const worksheet = workbook.addWorksheet('Attendance Report');
    const columns = [{ header: 'Date', key: 'date', width: 15 }];
  
    // Add columns for maids
    maidList.forEach((maid) => {
      if (!selectedMaid || selectedMaid === maid._id) {
        columns.push({ header: maid.name, key: maid._id, width: 15 });
      }
    });
  
    worksheet.columns = columns;
  
    // Add header styling
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: 'center' };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' },
    };
  
    // Fill attendance data for all dates
    dateRange.forEach((date) => {
      const formattedDate = date.toLocaleDateString();
      const row = { date: formattedDate };
  
      maidList.forEach((maid) => {
        if (!selectedMaid || selectedMaid === maid._id) {
          row[maid._id] = attendanceData[maid._id][formattedDate] || 'Absent';
        }
      });
  
      worksheet.addRow(row);
    });
  
    // Add borders and alignment for all cells
    worksheet.eachRow((row, rowIndex) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
  
      // Add alternating row colors for better readability
      if (rowIndex > 1) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: rowIndex % 2 === 0 ? 'FFEBF1DE' : 'FFFFFFFF' },
        };
      }
    });
  
    // Save and download the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MaidAttendanceReport.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  

  const handleMaidSelection = (maidId) => {
    setSelectedMaid(maidId);
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Maid Attendance</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <div className="mb-4 flex justify-center gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for maids..."
              className="border rounded w-full p-2"
            />
            {searchTerm && (
              <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto shadow-md">
                {filteredMaidList.length > 0 ? (
                  filteredMaidList.map((maid) => (
                    <li
                      key={maid._id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleMaidSelection(maid._id)}
                    >
                      {maid.name}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">No results found</li>
                )}
              </ul>
            )}
          </div>
          {selectedMaid && (
            <p className="mb-4">
              Selected Maid:{" "}
              <strong>
                {maidList.find((maid) => maid._id === selectedMaid)?.name || "All Maids"}
              </strong>
            </p>
          )}
          <button
            onClick={generateExcel}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Download Attendance Excel
          </button>
        </>
      )}
    </div>
  );
};

export default MaidAttendance;