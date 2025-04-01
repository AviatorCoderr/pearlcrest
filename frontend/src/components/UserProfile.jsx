import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit, FiSave, FiTrash2, FiPlus, FiX, FiSearch, FiUser, FiMail, FiPhone, FiCreditCard, FiUsers } from 'react-icons/fi';
import { FaCar, FaDog, FaUserTie } from 'react-icons/fa';

const LabeledInput = ({ value, label, onChange, editable, icon: Icon }) => (
  <div className="relative mb-4">
    <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="bg-blue-50 p-3 text-blue-600">
        <Icon size={20} />
      </div>
      {editable ? (
        <input
          type="text"
          value={value}
          placeholder={label}
          onChange={onChange}
          className="flex-1 p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-r-lg"
        />
      ) : (
        <div className="flex-1 p-3 text-gray-700">{value || "Not provided"}</div>
      )}
    </div>
    <span className="absolute -top-2 left-8 bg-white px-2 text-xs font-medium text-gray-500">
      {label}
    </span>
  </div>
);

export default function UserProfile() {
  const [owner, setOwner] = useState(null);
  const [renter, setRenter] = useState(null);
  const [vehicle, setVehicle] = useState([]);
  const [pet, setPet] = useState(null);
  const [ownerEditMode, setOwnerEditMode] = useState(false);
  const [renterEditMode, setRenterEditMode] = useState(false);
  const [petEditMode, setPetEditMode] = useState(false);
  const [vehicleEditMode, setVehicleEditMode] = useState([]);

  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerMobile, setOwnerMobile] = useState('');
  const [ownerAadhar, setOwnerAadhar] = useState('');
  const [ownerSpouseName, setOwnerSpouseName] = useState('');
  const [ownerSpouseMobile, setOwnerSpouseMobile] = useState('');

  const [renterName, setRenterName] = useState('');
  const [renterEmail, setRenterEmail] = useState('');
  const [renterMobile, setRenterMobile] = useState('');
  const [renterAadhar, setRenterAadhar] = useState('');
  const [renterSpouseName, setRenterSpouseName] = useState('');
  const [renterSpouseMobile, setRenterSpouseMobile] = useState('');

  const [vehicleType, setvehcileType] = useState(null);
  const [vehicleModel, setvehicleModel] = useState(null);
  const [vehicleReg, setvehicleReg] = useState(null);
  const [maidlist, setMaidlist] = useState([])
  const [vehicleEntries, setVehicleEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); 
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [addClick, setAddClick] = useState(false);
  const [maidpurpose, setmaidpurpose] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ownerResponse, renterResponse, vehicleResponse, petResponse, maidResponse] = await Promise.all([
          axios.get("/api/v1/owners/get-owner", { withCredentials: true }),
          axios.get("/api/v1/renters/get-renter", { withCredentials: true }),
          axios.get("/api/v1/vehicle/get-vehicles", { withCredentials: true }),
          axios.get("/api/v1/pets/get-pets", { withCredentials: true }),
          axios.get("/api/v1/maid/get-all-maid")
        ]);
        
        const ownerData = ownerResponse.data.data;
        setOwner(ownerData);
        setOwnerName(ownerData?.name);
        setOwnerEmail(ownerData?.email);
        setOwnerMobile(ownerData?.mobile);
        setOwnerAadhar(ownerData?.aadhar);
        setOwnerSpouseName(ownerData?.spouse_name);
        setOwnerSpouseMobile(ownerData?.spouse_mobile);
        
        const renterData = renterResponse.data.data
        setRenter(renterData);
        setRenterName(renterData?.name);
        setRenterEmail(renterData?.email);
        setRenterMobile(renterData?.mobile);
        setRenterAadhar(renterData?.aadhar);
        setRenterSpouseName(renterData?.spouse_name);
        setRenterSpouseMobile(renterData?.spouse_mobile);
        
        const vehicleData = vehicleResponse.data.data.vehicles;
        setVehicle(vehicleData);
        setMaidlist(maidResponse.data.data.Maidlist)
        setVehicleEditMode(new Array(vehicleData.length).fill(false))
        setPet(petResponse.data.data);
        setLoading(false); 
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const user = JSON.parse(localStorage.getItem('user'))
  const flatid = user?._id

  const toggleOwnerEditMode = () => {
    setOwnerEditMode(!ownerEditMode);
  };

  // Vehicles state
  const [newVehicleType, setNewVehicleType] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newVehicleReg, setNewVehicleReg] = useState('');
  const [addingNewVehicle, setAddingNewVehicle] = useState(false);

  const handleCancelAddVehicle = () => {
    setNewVehicleType('');
    setNewVehicleModel('');
    setNewVehicleReg('');
    setAddingNewVehicle(false);
  };

  const handleAddNewVehicle = async () => {
    try {
      const response = await axios.post("/api/v1/vehicle/add-vehicle", {
        type: newVehicleType,
        model: newVehicleModel,
        reg_no: newVehicleReg
      });
      
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Vehicle Added',
          timer: 1500,
          showConfirmButton: false
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        console.error("Failed to add vehicle.");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error.message);
    }
  };

  const toggleVehicleEditMode = (index) => {
    setVehicleEditMode(prevEditMode => {
      const updatedEditMode = [...prevEditMode];
      updatedEditMode[index] = !updatedEditMode[index];
      return updatedEditMode;
    });
  };

  const saveOwnerChanges = async () => {
    try {
      await axios.patch("/api/v1/owners/update-owner", {
        _id: owner?._id,
        name: ownerName, 
        mobile: ownerMobile,
        aadhar: ownerAadhar,
        email: ownerEmail,
        spouse_name: ownerSpouseName,
        spouse_mobile: ownerSpouseMobile
      }, { withCredentials: true });
      
      toggleOwnerEditMode(); 
      Swal.fire({
        title: 'Owner Updated',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.log(error);
    }
  };

  const saveRenterChanges = async() => {
    try {
      await axios.patch("/api/v1/renters/update-renter", {
        _id: renter?._id,
        name: renterName,
        mobile: renterMobile,
        aadhar: renterAadhar,
        email: renterEmail,
        spouse_name: renterSpouseName,
        spouse_mobile: renterSpouseMobile
      }, { withCredentials: true });
      
      toggleRenterEditMode(); 
      Swal.fire({
        title: 'Renter Updated',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.log(error);
    }
  };

  const toggleRenterEditMode = () => {
    setRenterEditMode(!renterEditMode);
  };

  const saveVehicleChanges = async (_id, index) => {
    try {
      const response = await axios.patch("/api/v1/vehicle/update-vehicle", {
        _id,
        type: vehicleType,
        model: vehicleModel,
        reg_no: vehicleReg
      });
      
      if (response.status === 200) {
        toggleVehicleEditMode(index); 
        Swal.fire({
          title: 'Vehicle Updated',
          timer: 1500,
          showConfirmButton: false
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        console.error("Failed to update vehicle.");
      }
    } catch (error) {
      console.error("Error updating vehicle:", error.message);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMaidList = maidlist?.filter(maid =>
    maid?.name?.toUpperCase().includes(searchQuery?.toUpperCase()) ||
    maid?.mobile?.includes(searchQuery) || maid?.purpose?.includes(searchQuery.toUpperCase())
  );

  const handleAdd = async(_id) => {
    try {
      await axios.post("/api/v1/maid/add-maid-by-flat", { _id })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: "Visitor added successfully",
          timer: 2000
        })
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      })
    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops, something went wrong',
        text: error.response.data.message || 'Something went wrong!'
      });
    }
  };

  const handleAddClick = async () => {
    setLoading(true);
    try {
      const mobilePattern = /^[6-9]\d{9}$/;
      if (!mobilePattern.test(mobile)) {
        throw new Error('Invalid mobile number');
      }
  
      const aadharPattern = /^\d{12}$/;
      if (aadhar && !aadharPattern.test(aadhar)) {
        throw new Error('Invalid Aadhar number');
      }
      
      let flat = [];
      flat.push(user?.flatnumber);
      
      await axios.post("/api/v1/maid/add-maid", {
        flatnumber: flat,
        name,
        mobile,
        aadhar,
        purpose: maidpurpose
      })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Visitor added successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        setName('');
        setMobile('');
        setAadhar('');
        setAddClick(false);
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
      .catch(error => {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: error?.response?.data?.message || error.message || 'Something went wrong!'
        });
      });
    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: error?.response?.data?.message || error.message || 'Something went wrong!'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaid = () => {
    setAddClick(true);
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-6xl'>
      {loading ? ( 
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className='text-3xl font-bold text-gray-800'>My Profile</h1>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              Flat No: {user?.flatnumber}
            </div>
          </div>

          {/* Owner Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
              <h2 className='text-xl font-semibold text-white flex items-center'>
                <FaUserTie className="mr-2" /> Owner Information
              </h2>
              <button 
                onClick={toggleOwnerEditMode}
                className="flex items-center bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {ownerEditMode ? <FiX className="mr-1" /> : <FiEdit className="mr-1" />}
                {ownerEditMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div className='p-6 grid md:grid-cols-2 gap-6'>
              {ownerEditMode ? (
                <>
                  <LabeledInput 
                    value={ownerName} 
                    label="Name" 
                    onChange={(e) => setOwnerName(e.target.value)} 
                    editable={ownerEditMode} 
                    icon={FiUser}
                  />
                  <LabeledInput 
                    value={ownerEmail} 
                    label="Email" 
                    onChange={(e) => setOwnerEmail(e.target.value)} 
                    editable={ownerEditMode} 
                    icon={FiMail}
                  />
                  <LabeledInput 
                    value={ownerMobile} 
                    label="Mobile" 
                    onChange={(e) => setOwnerMobile(e.target.value)} 
                    editable={ownerEditMode} 
                    icon={FiPhone}
                  />
                  <LabeledInput 
                    value={ownerAadhar} 
                    label="Aadhar" 
                    onChange={(e) => setOwnerAadhar(e.target.value)} 
                    editable={ownerEditMode} 
                    icon={FiCreditCard}
                  />
                  <LabeledInput 
                    value={ownerSpouseName} 
                    label="Spouse Name" 
                    onChange={(e) => setOwnerSpouseName(e.target.value)} 
                    editable={ownerEditMode} 
                    icon={FiUsers}
                  />
                  <LabeledInput 
                    value={ownerSpouseMobile} 
                    label="Spouse Mobile" 
                    onChange={(e) => setOwnerSpouseMobile(e.target.value)} 
                    editable={ownerEditMode} 
                    icon={FiPhone}
                  />
                  <div className="md:col-span-2 flex justify-end space-x-4">
                    <button 
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center"
                      onClick={toggleOwnerEditMode}
                    >
                      <FiX className="mr-2" /> Cancel
                    </button>
                    <button 
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                      onClick={saveOwnerChanges}
                    >
                      <FiSave className="mr-2" /> Save Changes
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <LabeledInput value={owner?.name} label="Name" editable={ownerEditMode} icon={FiUser} />
                  <LabeledInput value={owner?.email} label="Email" editable={ownerEditMode} icon={FiMail} />
                  <LabeledInput value={owner?.mobile} label="Mobile" editable={ownerEditMode} icon={FiPhone} />
                  <LabeledInput value={owner?.aadhar} label="Aadhar" editable={ownerEditMode} icon={FiCreditCard} />
                  <LabeledInput value={owner?.spouse_name} label="Spouse Name" editable={ownerEditMode} icon={FiUsers} />
                  <LabeledInput value={owner?.spouse_mobile} label="Spouse Mobile" editable={ownerEditMode} icon={FiPhone} />
                </>
              )}
            </div>
          </div>

          {/* Renter Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4 flex justify-between items-center">
              <h2 className='text-xl font-semibold text-white flex items-center'>
                <FiUser className="mr-2" /> Renter Information
              </h2>
              <button 
                onClick={toggleRenterEditMode}
                className="flex items-center bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {renterEditMode ? <FiX className="mr-1" /> : <FiEdit className="mr-1" />}
                {renterEditMode ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div className='p-6 grid md:grid-cols-2 gap-6'>
              {renterEditMode ? (
                <>
                  <LabeledInput 
                    value={renterName} 
                    label="Name" 
                    onChange={(e) => setRenterName(e.target.value)} 
                    editable={renterEditMode} 
                    icon={FiUser}
                  />
                  <LabeledInput 
                    value={renterEmail} 
                    label="Email" 
                    onChange={(e) => setRenterEmail(e.target.value)} 
                    editable={renterEditMode} 
                    icon={FiMail}
                  />
                  <LabeledInput 
                    value={renterMobile} 
                    label="Mobile" 
                    onChange={(e) => setRenterMobile(e.target.value)} 
                    editable={renterEditMode} 
                    icon={FiPhone}
                  />
                  <LabeledInput 
                    value={renterAadhar} 
                    label="Aadhar" 
                    onChange={(e) => setRenterAadhar(e.target.value)} 
                    editable={renterEditMode} 
                    icon={FiCreditCard}
                  />
                  <LabeledInput 
                    value={renterSpouseName} 
                    label="Spouse Name" 
                    onChange={(e) => setRenterSpouseName(e.target.value)} 
                    editable={renterEditMode} 
                    icon={FiUsers}
                  />
                  <LabeledInput 
                    value={renterSpouseMobile} 
                    label="Spouse Mobile" 
                    onChange={(e) => setRenterSpouseMobile(e.target.value)} 
                    editable={renterEditMode} 
                    icon={FiPhone}
                  />
                  <div className="md:col-span-2 flex justify-end space-x-4">
                    <button 
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center"
                      onClick={toggleRenterEditMode}
                    >
                      <FiX className="mr-2" /> Cancel
                    </button>
                    <button 
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                      onClick={saveRenterChanges}
                    >
                      <FiSave className="mr-2" /> Save Changes
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <LabeledInput value={renter?.name} label="Name" editable={renterEditMode} icon={FiUser} />
                  <LabeledInput value={renter?.email} label="Email" editable={renterEditMode} icon={FiMail} />
                  <LabeledInput value={renter?.mobile} label="Mobile" editable={renterEditMode} icon={FiPhone} />
                  <LabeledInput value={renter?.aadhar} label="Aadhar" editable={renterEditMode} icon={FiCreditCard} />
                  <LabeledInput value={renter?.spouse_name} label="Spouse Name" editable={renterEditMode} icon={FiUsers} />
                  <LabeledInput value={renter?.spouse_mobile} label="Spouse Mobile" editable={renterEditMode} icon={FiPhone} />
                </>
              )}
            </div>
          </div>

          {/* Vehicles Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4 flex justify-between items-center">
              <h2 className='text-xl font-semibold text-white flex items-center'>
                <FaCar className="mr-2" /> Vehicle Information
              </h2>
              <button 
                onClick={() => setAddingNewVehicle(true)}
                className="flex items-center bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <FiPlus className="mr-1" /> Add Vehicle
              </button>
            </div>
            <div className="p-6">
              {addingNewVehicle && (
                <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Vehicle</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={newVehicleType}
                        onChange={(e) => setNewVehicleType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Type</option>
                        <option value="FourWheeler">Four Wheeler</option>
                        <option value="TwoWheeler">Two Wheeler</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                      <input
                        placeholder="e.g. Honda City"
                        type="text"
                        value={newVehicleModel}
                        onChange={(e) => setNewVehicleModel(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration No.</label>
                      <input
                        placeholder="e.g. MH01AB1234"
                        type="text"
                        value={newVehicleReg}
                        onChange={(e) => setNewVehicleReg(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button 
                      onClick={handleCancelAddVehicle} 
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center"
                    >
                      <FiX className="mr-1" /> Cancel
                    </button>
                    <button 
                      onClick={handleAddNewVehicle} 
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center"
                    >
                      <FiSave className="mr-1" /> Add Vehicle
                    </button>
                  </div>
                </div>
              )}

              {vehicle?.length > 0 ? (
                vehicle.map((ele, index) => (
                  <div key={index} className="mb-6 last:mb-0 border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        <FaCar className="mr-2 text-purple-600" /> Vehicle {index+1}
                      </h3>
                      <div className="flex space-x-2">
                        {vehicleEditMode[index] ? (
                          <>
                            <button 
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center text-sm"
                              onClick={() => toggleVehicleEditMode(index)}
                            >
                              <FiX className="mr-1" /> Cancel
                            </button>
                            <button 
                              className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center text-sm"
                              onClick={() => saveVehicleChanges(ele._id, index)}
                            >
                              <FiSave className="mr-1" /> Save
                            </button>
                          </>
                        ) : (
                          <button 
                            className="px-3 py-1 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200 transition-colors duration-200 flex items-center text-sm"
                            onClick={() => toggleVehicleEditMode(index)}
                          >
                            <FiEdit className="mr-1" /> Edit
                          </button>
                        )}
                      </div>
                    </div>
                    <div className='grid md:grid-cols-3 gap-4'>
                      {vehicleEditMode[index] ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                              value={vehicleType || ele?.type}
                              onChange={(e) => setvehcileType(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Type</option>
                              <option value="FourWheeler">Four Wheeler</option>
                              <option value="TwoWheeler">Two Wheeler</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration No.</label>
                            <input
                              value={vehicleReg || ele?.reg_no}
                              onChange={(e) => setvehicleReg(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                            <input
                              value={vehicleModel || ele?.model}
                              onChange={(e) => setvehicleModel(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <LabeledInput value={ele?.type} label="Type" editable={vehicleEditMode[index]} icon={FaCar} />
                          <LabeledInput value={ele?.reg_no} label="Registration No." editable={vehicleEditMode[index]} icon={FiCreditCard} />
                          <LabeledInput value={ele?.model} label="Model" editable={vehicleEditMode[index]} icon={FiEdit} />
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaCar className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p>No vehicles registered yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Regular Visitors Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 px-6 py-4 flex justify-between items-center">
              <h2 className='text-xl font-semibold text-white flex items-center'>
                <FiUsers className="mr-2" /> Regular Visitors
              </h2>
              <button 
                onClick={handleAddMaid}
                className="flex items-center bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <FiPlus className="mr-1" /> Add Visitor
              </button>
            </div>
            <div className="p-6">
              {addClick && (
                <div className="mb-8 bg-orange-50 rounded-lg p-6 border border-orange-200">
                  <h3 className="text-lg font-medium text-orange-800 mb-4">Add New Visitor</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        placeholder="Visitor's name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                      <input
                        placeholder="Mobile number"
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar (Optional)</label>
                      <input
                        placeholder="Aadhar number"
                        type="text"
                        value={aadhar}
                        onChange={(e) => setAadhar(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                      <select
                        value={maidpurpose}
                        onChange={(e) => setmaidpurpose(e.target.value.toUpperCase())}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select purpose</option>
                        <option value="MAID">Maid</option>
                        <option value="MILKMAN">Milkman</option>
                        <option value="SCHOOL VAN">School Van</option>
                        <option value="NEWSPAPER">Newspaper</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button 
                      onClick={() => setAddClick(false)} 
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center"
                    >
                      <FiX className="mr-1" /> Cancel
                    </button>
                    <button 
                      onClick={handleAddClick} 
                      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200 flex items-center"
                    >
                      <FiSave className="mr-1" /> Add Visitor
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search visitors by name, phone or purpose"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aadhar
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purpose
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMaidList.length > 0 ? (
                      filteredMaidList.map((maid, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {maid.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {maid.mobile}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {maid.aadhar || "NA"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${maid.purpose === 'MAID' ? 'bg-green-100 text-green-800' : 
                                maid.purpose === 'MILKMAN' ? 'bg-blue-100 text-blue-800' : 
                                maid.purpose === 'SCHOOL VAN' ? 'bg-purple-100 text-purple-800' : 
                                'bg-orange-100 text-orange-800'}`}>
                              {maid.purpose || "NA"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {maid.flat.some(flat => flat._id === flatid) ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Added
                              </span>
                            ) : (
                              <button 
                                onClick={() => handleAdd(maid._id)} 
                                className="px-3 py-1 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition-colors duration-200 text-xs font-medium"
                              >
                                Add to my flat
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No visitors found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}