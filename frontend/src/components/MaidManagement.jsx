import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { RingLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
export default function MaidManagement() {
  const navigate = useNavigate()
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))?.flatnumber;
        if(user!=="GUARD") navigate("/db/unauth")
    })
  const [maidList, setMaidList] = useState([]);
  const [addClick, setAddClick] = useState(false);
  const [flat, setFlat] = useState([]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [flatelement, setFlatelement] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getAllMaids();
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
      const mobilePattern = /^[6-9]\d{9}$/;
      if (!mobilePattern.test(mobile)) {
        throw new Error('Invalid mobile number');
      }
  
      const aadharPattern = /^\d{12}$/;
      if (!aadharPattern.test(aadhar)) {
        throw new Error('Invalid Aadhar number');
      }    
      
      if(flat.length===0){
        throw new Error('Add Flat Number')
      }
      axios.post("/api/v1/maid/add-maid", {
        flatnumber: flat,
        name,
        mobile,
        aadhar
      })
      .then(response => {
        console.log(response)
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
        getAllMaids();
      })
      .catch(error => {
        console.log('Error adding maid:', error);
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: error.response.data.message || 'Something went wrong!'
        });
      })
    } catch (error) {
      console.log('Error adding maid:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: error.response.data.message || 'Something went wrong!'
      });
      
    } finally {
      setLoading(false);
    }
  };
  

  const handleAddFlat = () => {
    setFlat([...flat, flatelement.toUpperCase()]);
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

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const filteredMaidList = maidList.filter(maid =>
    maid.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
    maid.mobile.includes(searchQuery)
  );
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
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
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by name or phone number"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
        />
      </div>
      {loading ? (
        <RingLoader className="mt-10 mx-auto" color="#00BFFF" loading={loading} size={60} />
      ) : (
        <div className="overflow-x-auto">
          <table className='text-gray-700 w-full text-center shadow-lg bg-white rounded-lg overflow-hidden mt-5'>
            <thead className='bg-gray-200 text-gray-800 uppercase'>
              <tr>
                <th className="px-4 py-2 border border-gray-300">Name</th>
                <th className="px-4 py-2 border border-gray-300">Mobile</th>
                <th className="px-4 py-2 border border-gray-300">Aadhar</th>
                <th className="px-4 py-2 border border-gray-300">Check In</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaidList.map((maid, index) => (
                <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
                  <td className="px-4 py-2 border border-gray-300">{maid.name}</td>
                  <td className="px-4 py-2 border border-gray-300">{maid.mobile}</td>
                  <td className="px-4 py-2 border border-gray-300">{maid.aadhar}</td>
                  <td className="px-4 py-2 border border-gray-300">
                  {(maid?.checkedin && isToday(new Date(maid.checkin[maid.checkin.length-1]))) ? (
                    `${formatDate(maid.checkin[maid.checkin.length-1])}`
                  ) : (
                    <button onClick={() => handleCheckIn(maid._id)} className='p-2 bg-red-500 text-white font-bold rounded-lg'>Check In</button>
                  )}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
