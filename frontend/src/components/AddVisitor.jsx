import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function AddVisitor() {
  const [visitorlist, setVisitorlist] = useState([]);
  const [addClick, setAddClick] = useState(false);
  const [flat, setFlat] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    const getAllVisitors = async () => {
      const response = await axios.get("/api/v1/visitor/get-all-visitor");
      setVisitorlist(response.data.data.visitorData);
    };
    getAllVisitors();
    console.log(visitorlist)
  }, []);

  const handleAddVisitor = () => {
    setAddClick(true);
  };

  const handleAddClick = () => {
    // Regular expression for mobile number validation
    const mobileRegex = /^\d{10}$/;

    // Validation checks
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
      })
      .then(() => {
        setFlat('');
        setName('');
        setMobile('');
        setPurpose('');
        setAddClick(false);
        window.location.reload();
      })
    })
    .catch(error => {
      Swal.fire({
        title: 'Error',
        text: 'Failed to add visitor',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Add visitor error:', error);
    });
  };

  return (
    <div className="mx-auto">
      <button onClick={handleAddVisitor} className='block w-full max-w-lg m-auto py-2 bg-blue-500 text-white rounded-lg'>Add Visitor</button>
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
          <button onClick={handleAddClick} className="p-2 px-10 mt-4 bg-blue-500 text-white rounded-lg">Submit</button>
        </div>
      )}
      <table className='w-full text-gray-700 text-center table-auto shadow-lg bg-white divide-y divide-gray-200 rounded-lg overflow-hidden mt-5'>
        <thead className='bg-gray-200 text-gray-800 uppercase'>
          <tr>
          <th className="px-6 py-3 text-center text-sm font-semibold">Flat</th>
            <th className="px-6 py-3 text-center text-sm font-semibold">Name</th>
            <th className="px-6 py-3 text-center text-sm font-semibold">Mobile</th>
            <th className="px-6 py-3 text-center text-sm font-semibold">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {visitorlist?.map((ele, index) => (
            <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
              <td className="px-6 py-4">{ele.flat.flatnumber}</td>
              <td className="px-6 py-4">{ele.name}</td>
              <td className="px-6 py-4">{ele.mobile}</td>
              <td className="px-6 py-4">{ele.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
