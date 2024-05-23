import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { RingLoader, ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

export default function MaidManagement() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))?.flatnumber;
    if (user !== "GUARD") navigate("/db/unauth");
  }, [navigate]);

  const [maidList, setMaidList] = useState([]);
  const [addClick, setAddClick] = useState(false);
  const [flat, setFlat] = useState([]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [purpose, setPurpose] = useState('');
  const [flatelement, setFlatelement] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState({});

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
    setIsSubmitting(true);
    try {
      const mobilePattern = /^[6-9]\d{9}$/;
      if (!mobilePattern.test(mobile)) {
        throw new Error('Invalid mobile number');
      }

      const aadharPattern = /^\d{12}$/;
      if (aadhar && !aadharPattern.test(aadhar)) {
        throw new Error('Invalid Aadhar number');
      }

      if (flat.length === 0) {
        throw new Error('Add Flat Number');
      }

      await axios.post("/api/v1/maid/add-maid", {
        flatnumber: flat,
        name,
        mobile,
        aadhar,
        purpose
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
      setPurpose('');
      setAddClick(false);
      getAllMaids();
    } catch (error) {
      console.log('Error adding maid:', error);
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: error?.data?.response?.message || error?.message || 'Something went wrong!'
      });
    } finally {
      setIsSubmitting(false);
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
    setCheckInLoading(prevState => ({ ...prevState, [_id]: true }));
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
      setCheckInLoading(prevState => ({ ...prevState, [_id]: false }));
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
    <div className="mx-auto p-6 bg-white rounded-md shadow-md">
      <button onClick={handleAddMaid} className='block w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600'>Add Regular Visitor</button>
      {addClick && (
        <div className="mt-4 bg-white rounded-md shadow-md p-4">
          <div className='flex mb-4'>
            <input
              placeholder="Flat"
              type="text"
              value={flatelement}
              onChange={(e) => setFlatelement(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              disabled={isSubmitting}
            />
            <button onClick={handleAddFlat} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ml-2" disabled={isSubmitting}>Add</button>
          </div>
          <div className="mb-4">
            {flat.map((ele, index) => (
              <span className="bg-gray-200 p-2 rounded-md inline-block mr-2 mb-2" key={index}>
                {ele} <button onClick={() => handleDeleteFlat(ele)} className='text-red-500 font-bold ml-1'>X</button>
              </span>
            ))}
          </div>
          <input
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          <input
            placeholder="Mobile"
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full p-2 mb-4 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          <input
            placeholder="Aadhar"
            type="text"
            value={aadhar}
            onChange={(e) => setAadhar(e.target.value)}
            className="w-full p-2 mb-4 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          <select
            placeholder="Purpose"
            type="text"
            onChange={(e) => setPurpose(e.target.value.toUpperCase())}
            className="w-full p-2 mb-4 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Choose purpose</option>
            <option value="MAID">MAID</option>
            <option value="MILKMAN">MILKMAN</option>
            <option value="SCHOOL VAN">SCHOOL VAN</option>
            <option value="NEWSPAPER">NEWSPAPER</option>
            <option value="STAFF">STAFF</option>
            <option value="GARBAGE VAN">GARBAGE VAN</option>
          </select>
          <button onClick={handleAddClick} className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" disabled={isSubmitting}>
            {isSubmitting ? <ClipLoader size={20} color={"#fff"} /> : "Submit"}
          </button>
        </div>
      )}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Search by name or phone number"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border-2 border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {loading ? (
        <RingLoader className="mt-10 mx-auto" color="#00BFFF" loading={loading} size={60} />
      ) : (
        <div className="overflow-x-auto mt-5">
          <table className='text-gray-700 w-full text-center shadow-md bg-white rounded-md overflow-hidden'>
            <thead className='bg-gray-200 text-gray-800 uppercase'>
              <tr>
                <th className="px-4 py-2 border-gray-300">Name</th>
                <th className="px-4 py-2 border-gray-300">Mobile</th>
                <th className="px-4 py-2 border-gray-300">Aadhar</th>
                <th className="px-4 py-2 border-gray-300">Purpose</th>
                <th className="px-4 py-2 border-gray-300">Check In</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaidList.map((maid, index) => (
                <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
                  <td className="px-4 py-2 border-gray-300">{maid.name}</td>
                  <td className="px-4 py-2 border-gray-300">{maid.mobile}</td>
                  <td className="px-4 py-2 border-gray-300">{maid.aadhar}</td>
                  <td className="px-4 py-2 border-gray-300">{maid.purpose}</td>
                  <td className="px-4 py-2 border-gray-300">
                    {(maid?.checkedin && isToday(new Date(maid.checkin[maid.checkin.length - 1]))) ? (
                      `${formatDate(maid.checkin[maid.checkin.length - 1])}`
                    ) : (
                      <button onClick={() => handleCheckIn(maid._id)} className='p-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600' disabled={checkInLoading[maid._id]}>
                        {checkInLoading[maid._id] ? <ClipLoader size={20} color={"#fff"} /> : "Check In"}
                      </button>
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
