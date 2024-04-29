import axios from 'axios';
import React, { useState } from 'react';

function FindVehicle() {
  const [regNo, setRegNo] = useState('');
  const [vehicleData, setVehicleData] = useState(null);

  const handleInputChange = (e) => {
    setRegNo((e.target.value).toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(regNo);
    try {
      const response = await axios.get("/api/v1/vehicle/get-vehicle-by-regno", {
        reg_no: regNo
      });
      console.log("Data found", response.data);
      setVehicleData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <label className=''>
          Enter Vehicle Registration Number:
          <input className=' p-1 m-4 border-2 border-black' type="text" onChange={handleInputChange} />
        </label>
        <button className="p-2 px-5 rounded-lg text-white font-medium bg-blue-500" onClick={handleSubmit}>Search</button>
      </div>

      {vehicleData && (
        <div>
          <h2>Vehicle Details</h2>
          <p>Registration Number: {vehicleData.vehicle.reg_no}</p>
        </div>
      )}
    </div>
  );
}

export default FindVehicle;
