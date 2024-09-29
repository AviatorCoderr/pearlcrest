import React, { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import axios from 'axios';

const MaidAttendance = () => {
  const [maidList, setMaidList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMaid, setSelectedMaid] = useState('');

  useEffect(() => {
    fetchMaidData();
  }, []);

  // Fetch maid attendance data from the API
  const fetchMaidData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/maid/get-all-maid');
      setMaidList(response.data.data.Maidlist);
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

    maidList.forEach((maid) => {
      if (selectedMaid && selectedMaid !== maid._id) return; // Filter by selected maid

      maid.checkin.forEach((checkinDate) => {
        const date = new Date(checkinDate);
        const time = date.toLocaleTimeString();
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        const formattedDate = date.toLocaleDateString();

        // Check date range
        if (startDate && new Date(startDate) > date) return;
        if (endDate && new Date(endDate) < date) return;

        if (!attendanceData[month]) {
          attendanceData[month] = {};
        }

        if (!attendanceData[month][formattedDate]) {
          attendanceData[month][formattedDate] = {};
        }

        attendanceData[month][formattedDate][maid._id] = time;
      });
    });

    for (const [month, dates] of Object.entries(attendanceData)) {
      const worksheet = workbook.addWorksheet(month);
      const columns = [
        { header: 'Date', key: 'date', width: 15, style: { font: { bold: true } } },
      ];

      // Add maid column if a specific maid is selected
      if (selectedMaid) {
        const maid = maidList.find(m => m._id === selectedMaid);
        if (maid) {
          columns.push({
            header: maid.name,
            key: maid._id,
            width: 15,
            style: { font: { bold: true } }
          });
        }
      } else {
        // If no maid is selected, add all maids
        maidList.forEach(maid => {
          columns.push({
            header: maid.name,
            key: maid._id,
            width: 15,
            style: { font: { bold: true } }
          });
        });
      }

      worksheet.columns = columns;

      // Add header row styling
      worksheet.getRow(1).font = { bold: true, size: 12 };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' }, // Light blue
      };
      worksheet.getRow(1).alignment = { horizontal: 'center' };

      // Sort dates
      const sortedDateEntries = Object.keys(dates).sort((a, b) => new Date(a) - new Date(b));

      sortedDateEntries.forEach((date, index) => {
        const row = [date]; // Start row with date
        if (selectedMaid) {
          const attendanceRecord = dates[date][selectedMaid];
          row.push(attendanceRecord ? attendanceRecord : 'Absent');
        } else {
          maidList.forEach((maid) => {
            const attendanceRecord = dates[date][maid._id];
            row.push(attendanceRecord ? attendanceRecord : 'Absent');
          });
        }
        
        const currentRow = worksheet.addRow(row);

        // Add alternating row colors for better legibility
        if (index % 2 === 0) {
          currentRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEBF1DE' }, // Light yellow
          };
        } else {
          currentRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' }, // White
          };
        }
      });

      // Set borders for all cells
      worksheet.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Center align the text
        });
      });
    }

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
            <select
              value={selectedMaid}
              onChange={(e) => setSelectedMaid(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">All Maids</option>
              {maidList.map((maid) => (
                <option key={maid._id} value={maid._id}>{maid.name}</option>
              ))}
            </select>
          </div>
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
