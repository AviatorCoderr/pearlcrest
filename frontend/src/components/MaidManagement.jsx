import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function MaidManagement() {
  const [maidList, setMaidList] = useState([]);
  const [addClick, setAddClick] = useState(false);
  const [flat, setFlat] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhar, setAadhar] = useState('');
  useEffect(() => {
    const getAllMaids = async () => {
      const response = await axios.get("http://localhost:8000/api/v1/maid/get-all-maid");
      setMaidList(response.data.data.maidList);
    };
    getAllMaids();
  }, []);

  const handleAddMaid = () => {
    setAddClick(true);
  };

  const handleAddClick = () => {
    axios.post("http://localhost:8000/api/v1/maid/add-maid", {
      flatnumber,
      name,
      mobile,
      aadhar
    })
    .then(response => {
      console.log(response);
      Swal.fire({
        icon: 'success',
        title: 'Maid added successfully!',
        showConfirmButton: false,
        timer: 1500
      });
      setFlat('');
      setName('');
      setMobile('');
      setAadhar('');
      setAddClick(false);
      getAllMaids();
    })
    .catch(error => {
      console.error('Error adding maid:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    });
  };

  return (
    <div className="mx-auto">
      <button onClick={handleAddMaid} className='block w-full max-w-lg m-auto py-2 bg-blue-500 text-white rounded-lg'>Add Maid</button>
      {addClick && (
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <input
            placeholder="Flat"
            type="text"
            onChange={(e) => setFlat(e.target.value)}
            className="w-full p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
          />
          <input
            placeholder="Name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            className="w-full p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
          />
          <input
            placeholder="Mobile"
            type="text"
            onChange={(e) => setMobile(e.target.value)}
            className="w-full p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
          />
          <input
            placeholder="Aadhar"
            type="text"
            onChange={(e) => setAadhar(e.target.value)}
            className="w-full p-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
          />
          <button onClick={handleAddClick} className="p-2 px-10 mt-4 bg-blue-500 text-white rounded-lg">Submit</button>
        </div>
      )}
      <table className='w-full text-gray-700 text-center table-auto shadow-lg bg-white divide-y divide-gray-200 rounded-lg overflow-hidden mt-5'>
        <thead className='bg-gray-200 text-gray-800 uppercase'>
          <tr>
            <th className="px-6 py-3 text-center text-sm font-semibold">Flat</th>
            <th className="px-6 py-3 text-center text-sm font-semibold">Name</th>
            <th className="px-6 py-3 text-center text-sm font-semibold">Mobile</th>
            <th className="px-6 py-3 text-center text-sm font-semibold">Aadhar</th>
          </tr>
        </thead>
        <tbody>
          {maidList?.map((maid, index) => (
            <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
              <td className="px-6 py-4">{maid.flat}</td>
              <td className="px-6 py-4">{maid.name}</td>
              <td className="px-6 py-4">{maid.mobile}</td>
              <td className="px-6 py-4">{maid.aadhar}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
