import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function MaidManagement() {
  const [maidList, setMaidList] = useState([]);
  const [addClick, setAddClick] = useState(false);
  const [flat, setFlat] = useState([]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [flatelement, setFlatelement] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllMaids = async () => {
      const response = await axios.get("/api/v1/maid/get-all-maid");
      setMaidList(response.data.data.Maidlist);
    };
    getAllMaids();
    console.log(maidList)
  }, []);

  const getAllMaids = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/maid/get-all-maid");
      setMaidList(response.data.data.Maidlist);
    } catch (error) {
      console.error('Error fetching maids:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaid = () => {
    setAddClick(true);
  };

  const handleAddClick = async () => {
    setLoading(true);
    try {
      await axios.post("/api/v1/maid/add-maid", {
        flatnumber: flat,
        name,
        mobile,
        aadhar
      });
      Swal.fire({
        icon: 'success',
        title: 'Maid added successfully!',
        showConfirmButton: false,
        timer: 1500
      });
      setFlat([]);
      setName('');
      setMobile('');
      setAadhar('');
      setAddClick(false);
      await getAllMaids();
    } catch (error) {
      console.error('Error adding maid:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFlat = () => {
    setFlat([...flat, flatelement]);
    setFlatelement('');
  };

  const handleDeleteFlat = (value) => {
    const newFlat = flat.filter(num => num !== value);
    setFlat(newFlat);
  };

  const handleCheckIn = async (_id) => {
    setLoading(true);
    try {
      await axios.post("/api/v1/maid/checkin", { _id });
      Swal.fire({
        icon: 'success',
        title: 'Checked In',
        timer: 1500
      });
      await getAllMaids();
    } catch (error) {
      console.error('Error checking in:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto">
      <button onClick={handleAddMaid} className='block w-full max-w-lg m-auto py-2 bg-blue-500 text-white rounded-lg'>Add Maid</button>
      {addClick && (
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <div className='flex'>
            <input
              placeholder="Flat"
              type="text"
              value={flatelement}
              onChange={(e) => setFlatelement(e.target.value)}
              className="w-full border-b-2 p-1 border-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
            />
            <button onClick={handleAddFlat} className="p-2 bg-blue-500 rounded-lg px-5 text-white">Add</button>
          </div>
          <p className='my-2'>{flat.map((ele, index) => {
            return <span className="bg-neutral-300 p-1 mx-2 px-4 rounded-lg" key={index}>{ele} <button onClick={() => handleDeleteFlat(ele)} className='text-neutral-600 text-bold'>X</button></span>;
          })}</p>
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
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className='w-full text-gray-700 text-center table-auto shadow-lg bg-white divide-y divide-gray-200 rounded-lg overflow-hidden mt-5'>
          <thead className='bg-gray-200 text-gray-800 uppercase'>
            <tr>
              <th className="px-6 py-3 text-center text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Mobile</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Aadhar</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Check In</th>
            </tr>
          </thead>
          <tbody>
            {maidList?.map((maid, index) => (
              <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
                <td className="px-6 py-4">{maid.name}</td>
                <td className="px-6 py-4">{maid.mobile}</td>
                <td className="px-6 py-4">{maid.aadhar}</td>
                <td className="px-6 py-4">{(maid.checkedin)?`${maid.checkin}`:<button onClick={() => handleCheckIn(maid._id)} className='p-2 bg-red-500 text-white font-bold rounded-lg'>Check In</button>}</td>              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
