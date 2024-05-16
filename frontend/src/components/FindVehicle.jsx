import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function FindVehicle() {
  const navigate = useNavigate()
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const flat = user?.flatnumber
        const pos = user?.position
        if(flat!=="GUARD" && pos!="executive" && flat!="PCS") navigate("/db/unauth")
    })
  const [regNo, setRegNo] = useState('');
  const [vehicleData, setVehicleData] = useState(null);

  const handleInputChange = (e) => {
    setRegNo((e.target.value).toUpperCase());
  };

  const handleSubmit = async (e) => {
    try {
      const response = await axios.post("/api/v1/vehicle/get-vehicle-by-regno", {
        reg_no: regNo
      });
      setVehicleData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-gray-100 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block mb-2 text-lg font-medium text-gray-800">
          Enter Vehicle Registration Number:
        </label>
        <input 
          className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
          type="text"
          onChange={handleInputChange}
        />
      </div>
      <button 
        className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        onClick={handleSubmit}
      >
        Search
      </button>

      {vehicleData && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Vehicle Details</h2>
          <p><span className="font-semibold">Flat Number:</span> {vehicleData.flatnumber}</p>
          <p><span className="font-semibold">Registration Number:</span> {vehicleData.vehicle.reg_no}</p>
          <p><span className="font-semibold">Type:</span> {vehicleData.vehicle.type}</p>
          <p><span className="font-semibold">Model:</span> {vehicleData.vehicle.model}</p>
          <p><span className="font-semibold">Owner's Number:</span> {`${vehicleData.owner?.mobile}, ${vehicleData.owner?.spouse_mobile}`}</p>
          <p><span className="font-semibold">Renter's Number:</span> {`${vehicleData.renter?.mobile}, ${vehicleData.renter?.spouse_mobile}`}</p>
        </div>
      )}
    </div>
  );
}

export default FindVehicle;
