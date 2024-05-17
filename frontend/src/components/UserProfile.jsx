import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from "sweetalert2";
const LabeledInput = ({ value, label, onChange, editable }) => (
  <label className="relative m-2">
    <div className="p-2 m-2 bg-neutral-100 rounded-sm border text-black border-black w-full">
      {editable ? (
        <input
          type="text"
          placeholder={value}
          onChange={onChange}
          className="bg-transparent rounded-sm border border-transparent focus:border-black focus:ring-0 w-full"
        />
      ) : (
        <div>{value}</div>
      )}
    </div>
    <span className="truncate absolute top-[1rem] md:top-[-0.5rem] left-6 text-opacity-80 font-medium bg-neutral-100 px-2">
      {label}
    </span>
  </label>
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
    console.log(vehicle)
  }, []);
  const user = JSON.parse(localStorage.getItem('user'))
  const flatid = user?._id
  const toggleOwnerEditMode = () => {
    setOwnerEditMode(!ownerEditMode);
  };

  const toggleVehicleEditMode = (index) => {
    setVehicleEditMode(prevEditMode => {
      const updatedEditMode = [...prevEditMode];
      updatedEditMode[index] = !updatedEditMode[index];
      return updatedEditMode;
    });
};

  const saveOwnerChanges = async () => {
    console.log(ownerAadhar, ownerEmail, ownerMobile)
    axios.patch("/api/v1/owners/update-owner", {
      _id: owner?._id,
      name: ownerName, 
      mobile: ownerMobile,
      aadhar: ownerAadhar,
      email: ownerEmail,
      spouse_name: ownerSpouseName,
      spouse_mobile: ownerSpouseMobile
    }, { withCredentials: true })
    .then(response => {
      toggleOwnerEditMode(); 
      Swal.fire({
        title: 'Owner Updated',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    })
    .catch(error => {
      console.log(error);
    });
  };
  const saveRenterChanges = async() => {
    axios.patch("/api/v1/renters/update-renter", {
      _id: renter?._id,
      name: renterName,
      mobile: renterMobile,
      aadhar: renterAadhar,
      email: renterEmail,
      spouse_name: renterSpouseName,
      spouse_mobile: renterSpouseMobile
    }, { withCredentials: true })
    .then(response => {
      toggleRenterEditMode(); 
      Swal.fire({
        title: 'Renter Updated',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    })
    .catch(error => {
      console.log(error);
    });
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
    maid?.mobile?.includes(searchQuery)
  );
  const handleAdd = async(_id) => {
    try {
      await axios.post("/api/v1/maid/add-maid-by-flat", { _id })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: "Maid added successfully",
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
  }
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
      let flat = [];
      flat.push(user?.flatnumber)
      console.log(flat);
      await axios.post("/api/v1/maid/add-maid", {
        flatnumber: flat,
        name,
        mobile,
        aadhar
      })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Maid added successfully!',
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
          text: error.message || 'Something went wrong!'
        });
        console.log('Error adding maid:', error);
      })
    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: error.message || 'Something went wrong!'
      });
      console.log('Error adding maid:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddMaid = () => {
    setAddClick(true);
  };
  return (
    <div className='m-5'>
      {loading ? ( 
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <h1 className='text-2xl m-3 font-semibold border-b-2 border-black w-1/4'>Your Profile</h1>
          <div className='grid gap-5 p-5'>
            <h2 className='text-lg font-medium border-l-2 bg-zinc-200 border-b-2 shadow-md shadow-black p-2 border-black'>Owner <button className="float-right py-1 px-10 bg-black text-white rounded-sm" onClick={toggleOwnerEditMode}>Update</button></h2>
            <div className='md:grid gap-5 grid-cols-2'>
              {ownerEditMode ? (
                <>
                  <LabeledInput value={owner?.name} label="Name" onChange={(e) => setOwnerName(e.target.value)} editable={ownerEditMode} />
                  <LabeledInput value={owner?.email} label="Email" onChange={(e) => setOwnerEmail(e.target.value)} editable={ownerEditMode} />
                  <LabeledInput value={owner?.mobile} label="Mobile" onChange={(e) => setOwnerMobile(e.target.value)} editable={ownerEditMode} />
                  <LabeledInput value={owner?.aadhar} label="Aadhar" onChange={(e) => setOwnerAadhar(e.target.value)} editable={ownerEditMode} />
                  <LabeledInput value={owner?.spouse_name} label="Spouse Name" onChange={(e) => setOwnerSpouseName(e.target.value)} editable={ownerEditMode} />
                  <LabeledInput value={owner?.spouse_mobile} label="Spouse Mobile" onChange={(e) => setOwnerSpouseMobile(e.target.value)} editable={ownerEditMode} />
                  <button className="m-5 p-2 w-1/4 bg-blue-700 text-white rounded-sm" onClick={saveOwnerChanges}>Save</button>
                  <button className="m-5 p-2 w-1/4 bg-red-500 text-white rounded-sm" onClick={toggleOwnerEditMode}>Cancel</button>
                </>
              ) : (
                <>
                  <LabeledInput value={owner?.name} label="Name" editable={ownerEditMode} />
                  <LabeledInput value={owner?.email} label="Email" editable={ownerEditMode} />
                  <LabeledInput value={owner?.mobile} label="Mobile" editable={ownerEditMode} />
                  <LabeledInput value={owner?.aadhar} label="Aadhar" editable={ownerEditMode} />
                  <LabeledInput value={owner?.spouse_name} label="Spouse Name" editable={ownerEditMode} />
                  <LabeledInput value={owner?.spouse_mobile} label="Spouse Mobile" editable={ownerEditMode} />
                </>
              )}
            </div>
            <h2 className='text-lg font-medium border-l-2 bg-zinc-200 border-b-2 shadow-md shadow-black p-2 border-black'>Renter <button className="float-right py-1 px-10 bg-black text-white rounded-sm" onClick={toggleRenterEditMode}>Update</button></h2>
            <div className='md:grid gap-5 grid-cols-2'>
              {renterEditMode ? (
                <>
                  <LabeledInput value={renter?.name} label="Name" onChange={(e) => setRenterName(e.target.value)} editable={renterEditMode} />
                  <LabeledInput value={renter?.email} label="Email" onChange={(e) => setRenterEmail(e.target.value)} editable={renterEditMode} />
                  <LabeledInput value={renter?.mobile} label="Mobile" onChange={(e) => setRenterMobile(e.target.value)} editable={renterEditMode} />
                  <LabeledInput value={renter?.aadhar} label="Aadhar" onChange={(e) => setRenterAadhar(e.target.value)} editable={renterEditMode} />
                  <LabeledInput value={renter?.spouse_name} label="Spouse Name" onChange={(e) => setRenterSpouseName(e.target.value)} editable={renterEditMode} />
                  <LabeledInput value={renter?.spouse_mobile} label="Spouse Mobile" onChange={(e) => setRenterSpouseMobile(e.target.value)} editable={renterEditMode} />
                  <button className="m-5 p-2 w-1/4 bg-blue-700 text-white rounded-sm" onClick={saveRenterChanges}>Save</button>
                  <button className="m-5 p-2 w-1/4 bg-red-500 text-white rounded-sm" onClick={toggleRenterEditMode}>Cancel</button>
                </>
              ) : (
                <>
                  <LabeledInput value={renter?.name} label="Name" editable={renterEditMode} />
                  <LabeledInput value={renter?.email} label="Email" editable={renterEditMode} />
                  <LabeledInput value={renter?.mobile} label="Mobile" editable={renterEditMode} />
                  <LabeledInput value={renter?.aadhar} label="Aadhar" editable={renterEditMode} />
                  <LabeledInput value={renter?.spouse_name} label="Spouse Name" editable={renterEditMode} />
                  <LabeledInput value={renter?.spouse_mobile} label="Spouse Mobile" editable={renterEditMode} />
                </>
              )}
            </div>
            <h2 className='text-lg font-medium border-l-2 bg-zinc-200 border-b-2 shadow-md shadow-black p-2 border-black'>Vehicles</h2>
{vehicle?.map((ele, index) => (
  <div key={index}>
    <p className='bg-blue-500 font-medium text-white py-3 px-4 flex items-center justify-between'>Vehicle {index+1}</p>
    {vehicleEditMode[index] ? (
      <div>
        <button className="p-2 px-5 m-2 bg-green-700 text-white rounded-sm" onClick={() => saveVehicleChanges(ele._id, index)}>Save</button>
        <button className="p-2 px-5 m-2 bg-red-500 text-white rounded-sm" onClick={() => toggleVehicleEditMode(index)}>Cancel</button>
      </div>
    ) : (
      <button className="bg-black m-3 p-2 w-1/2 text-white rounded-sm" onClick={() => toggleVehicleEditMode(index)}>Update</button>
    )}
    <div className='md:grid gap-5 grid-cols-2'>
      {vehicleEditMode[index] ? (
        <>
          <label className="relative m-2">
            <div className='p-2 m-2 bg-neutral-100 rounded-sm border text-black border-black w-full'>
              <select className="bg-transparent rounded-sm border border-transparent w-full focus:border-black focus:ring-0" placeholder={ele?.type} label="Type" onChange={(e) => setvehcileType(e.target.value)} editable={vehicleEditMode[index]}>
                <option value="FourWheeler">FourWheeler</option>
                <option value="TwoWheeler">TwoWheeler</option>
              </select>
            </div>
            <span className="truncate absolute top-[1rem] md:top-[-0.5rem] left-6 text-opacity-80 font-medium bg-neutral-100 px-2">
              Type
            </span>
          </label>
          <LabeledInput value={ele?.reg_no} label="Registration Number" onChange={(e) => setvehicleReg(e.target.value)} editable={vehicleEditMode[index]} />
          <LabeledInput value={ele?.model} label="Model" onChange={(e) => setvehicleModel(e.target.value)} editable={vehicleEditMode[index]} />               
        </>
      ) : (
        <>
          <LabeledInput value={ele?.type} label="Type" editable={vehicleEditMode[index]} />
          <LabeledInput value={ele?.reg_no} label="Registration Number" editable={vehicleEditMode[index]} />
          <LabeledInput value={ele?.model} label="Model" editable={vehicleEditMode[index]} />
        </>
      )}
    </div>
    
  </div>
))}
<h2 className='text-lg font-medium border-l-2 bg-zinc-200 border-b-2 shadow-md shadow-black p-2 border-black'>Manage your HouseMaids</h2>
<button onClick={handleAddMaid} className='block w-full max-w-lg m-auto py-2 bg-blue-500 text-white rounded-lg'>Add Maid</button>
      {addClick && (
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
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
          placeholder="Search maids name or phone number"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-2"
        />
      </div>
    <div className="overflow-x-auto">
          <table className='text-gray-700 w-full text-center shadow-lg bg-white rounded-lg overflow-hidden mt-5'>
            <thead className='bg-gray-200 text-gray-800 uppercase'>
              <tr>
                <th className="px-4 py-2 border border-gray-300">Name</th>
                <th className="px-4 py-2 border border-gray-300">Mobile</th>
                <th className="px-4 py-2 border border-gray-300">Aadhar</th>
                <th className="px-4 py-2 border border-gray-300">Add as Your Maid</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaidList.map((maid, index) => (
                <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
                  <td className="px-4 py-2 border border-gray-300">{maid.name}</td>
                  <td className="px-4 py-2 border border-gray-300">{maid.mobile}</td>
                  <td className="px-4 py-2 border border-gray-300">{maid.aadhar}</td> 
                  <td className="px-4 py-2 border border-gray-300">
                  {maid.flat.some(flat => flat._id === flatid) ? (
                    "Added"
                  ) : (
                    <button onClick={() => handleAdd(maid._id)} className='p-2 bg-red-500 text-white font-bold rounded-lg'>
                      Add
                    </button>
                  )}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        </>
      )}
    </div>
  );
}
