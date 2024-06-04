import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import ExcelJS from 'exceljs';

export default function VisitorDownload() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))?.flatnumber;
    if (user !== "PCS" && user !== "GUARD") navigate("/db/unauth");
  }, [navigate]);

  const [visitorlist, setVisitorlist] = useState([]);
  const [filteredVisitorList, setFilteredVisitorList] = useState([]);
  const [addClick, setAddClick] = useState(false);
  const [flat, setFlat] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);

  const [filterFlat, setFilterFlat] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  useEffect(() => {
    const getAllVisitors = async () => {
      try {
        const response = await axios.get("/api/v1/visitor/get-visitors");
        setVisitorlist(response.data.data.visitors);
        setFilteredVisitorList(response.data.data.visitors);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    };
    getAllVisitors();
  }, []);

  const handleFilter = () => {
    let filtered = visitorlist;

    if (filterFlat) {
      filtered = filtered.filter(visitor => visitor.flat.flatnumber.includes(filterFlat));
    }
    if (filterPurpose) {
      filtered = filtered.filter(visitor => visitor.purpose === filterPurpose);
    }
    if (filterStartDate) {
      filtered = filtered.filter(visitor => new Date(visitor.checkin) >= new Date(filterStartDate));
    }
    if (filterEndDate) {
      filtered = filtered.filter(visitor => new Date(visitor.checkin) <= new Date(filterEndDate));
    }

    setFilteredVisitorList(filtered);
  };

  const handleAddVisitor = () => {
    setAddClick(true);
  };

  const handleAddClick = () => {
    const mobileRegex = /^\d{10}$/;

    if (!flat || !name || !mobile || !purpose) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all fields',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!mobileRegex.test(mobile)) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please enter a valid mobile number',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    setLoading(true);

    axios.post("/api/v1/visitor/add-visitor", {
      flatnumber: flat,
      name,
      mobile,
      purpose
    })
    .then(() => {
      Swal.fire({
        title: 'Visitor Added',
        icon: 'success',
        timer: 2000,
      }).then(() => {
        setFlat('');
        setName('');
        setMobile('');
        setPurpose('');
        setAddClick(false);
        setLoading(false);
        window.location.reload();
      });
    })
    .catch(error => {
      Swal.fire({
        title: 'Error',
        text: 'Failed to add visitor',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Add visitor error:', error);
      setLoading(false);
    });
  };

  const handleDownloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const dateVisitorMap = {};

      filteredVisitorList.forEach(visitor => {
        const checkin = visitor.checkin;
        if (checkin) {
          const date = new Date(checkin).toISOString().split('T')[0];
          if (!dateVisitorMap[date]) {
            dateVisitorMap[date] = [];
          }
          dateVisitorMap[date].push(visitor);
        }
      });

      Object.keys(dateVisitorMap).forEach(date => {
        const worksheet = workbook.addWorksheet(date);
        worksheet.columns = [
          { header: 'Flat', key: 'flat', width: 10 },
          { header: 'Name', key: 'name', width: 30 },
          { header: 'Mobile', key: 'mobile', width: 15 },
          { header: 'Purpose', key: 'purpose', width: 20 },
          { header: 'Time', key: 'time', width: 30 },
          { header: 'Date', key: 'date', width: 30 }
        ];
        dateVisitorMap[date].forEach(visitor => {
          worksheet.addRow({
            flat: visitor.flat.flatnumber,
            name: visitor.name,
            mobile: visitor.mobile,
            purpose: visitor.purpose,
            time: new Date(visitor.checkin).toLocaleDateString("en-IN"),
            date: new Date(visitor.checkin).toLocaleTimeString("en-IN")
          });
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Visitors_Register.xlsx';
      link.click();
    } catch (error) {
      console.error("Error generating Excel file:", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to generate Excel file',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="mx-auto">
      <button onClick={handleAddVisitor} className='block w-full max-w-lg m-auto py-2 bg-blue-500 text-white rounded-lg'>Add Visitor</button>
      <button onClick={handleDownloadExcel} className='block w-full max-w-lg m-auto py-2 bg-green-500 text-white rounded-lg mt-4'>Download Excel</button>
      {addClick && (
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <input
            placeholder="Flat"
            type="text"
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
            className="w-full p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
          />
          <input
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
          />
          <input
            placeholder="Mobile"
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
          />
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
          >
            <option value="">Select Visitor Type</option>
            <option value="guest">Guest</option>
            <option value="delivery">Delivery</option>
            <option value="cab_driver">Cab Driver</option>
            <option value="gas_delivery">Gas Delivery</option>
            <option value="grocery_shop">Grocery Shop</option>
            <option value="milkman">Milkman</option>
          </select>
          <button 
            onClick={handleAddClick} 
            className="p-2 px-10 mt-4 bg-blue-500 text-white rounded-lg" 
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color={"#fff"} /> : "Submit"}
          </button>
        </div>
      )}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl mb-4">Filter Visitors</h2>
        <input
          placeholder="Flat"
          type="text"
          value={filterFlat}
          onChange={(e) => setFilterFlat(e.target.value)}
          className="w-full p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
        />
        <select
          value={filterPurpose}
          onChange={(e) => setFilterPurpose(e.target.value)}
          className="w-full p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
        >
          <option value="">Select Visitor Type</option>
          <option value="guest">Guest</option>
          <option value="delivery">Delivery</option>
          <option value="cab_driver">Cab Driver</option>
          <option value="gas_delivery">Gas Delivery</option>
          <option value="grocery_shop">Grocery Shop</option>
          <option value="milkman">Milkman</option>
        </select>
        <input
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          className="w-full p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
        />
        <input
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          className="w-full p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
        />
        <button 
          onClick={handleFilter} 
          className="p-2 px-10 mt-4 bg-blue-500 text-white rounded-lg"
        >
          Apply Filters
        </button>
      </div>
      <div className='overflow-auto'>
        <table className='w-full text-gray-700 text-center table-auto shadow-lg bg-white divide-y divide-gray-200 rounded-lg overflow-hidden mt-5'>
          <thead className='bg-gray-200 text-gray-800 uppercase'>
            <tr>
              <th className="px-6 py-3 text-center text-sm font-semibold">#</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Flat</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Mobile</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitorList?.map((ele, index) => (
              <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{ele.flat.flatnumber}</td>
                <td className="px-6 py-4">{ele.name}</td>
                <td className="px-6 py-4">{ele.mobile}</td>
                <td className="px-6 py-4">{ele.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
