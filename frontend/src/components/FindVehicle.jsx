import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function FindVehicle() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const flat = user?.flatnumber;
    const pos = user?.position;
    if (flat !== "GUARD" && pos !== "executive" && flat !== "PCS") navigate("/db/unauth");
  }, []);

  const [regNo, setRegNo] = useState('');
  const [vehicleData, setVehicleData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [challanMessage, setChallanMessage] = useState(null);

  const handleInputChange = (e) => {
    setRegNo(e.target.value.toUpperCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios.post("/api/v1/vehicle/get-vehicle-by-regno", {
      reg_no: regNo
    })
    .then(response => {
      setVehicleData(response.data.data);
      setError(null);
    })
    .catch(error => {
      setVehicleData(null);
      setError("Vehicle does not exist");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleSendChallan = async () => {
    if (!vehicleData || !vehicleData.vehicle._id) return;

    // Use SweetAlert for confirmation
    const result = await Swal.fire({
      title: 'Generate Challan',
      text: 'Are you sure you want to generate a challan for this vehicle?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, generate challan'
    });

    if (result.isConfirmed) {
      setLoading(true);
      await axios.post("/api/v1/vehicle/generate-challan", {
        vehicleId: vehicleData.vehicle._id
      })
      .then(response => {
        setChallanMessage("Challan generated successfully!");
      })
      .catch(error => {
        setChallanMessage("Failed to generate challan.");
      })
      .finally(() => {
        setLoading(false);
      });
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

      {loading && <p className="text-blue-500 mt-4">Loading...</p>}
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
      
      {vehicleData && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Vehicle Details</h2>
          <p><span className="font-semibold">Flat Number:</span> {vehicleData.flatnumber}</p>
          <p><span className="font-semibold">Registration Number:</span> {vehicleData.vehicle.reg_no}</p>
          <p><span className="font-semibold">Type:</span> {vehicleData.vehicle.type}</p>
          <p><span className="font-semibold">Model:</span> {vehicleData.vehicle.model}</p>
          <p><span className="font-semibold">Owner's Number:</span> 
            <a href={`tel:${vehicleData.owner?.mobile}`}>{vehicleData.owner?.mobile}</a>, 
            <a href={`tel:${vehicleData.owner?.spouse_mobile}`}>{vehicleData.owner?.spouse_mobile}</a>
          </p>
          <p><span className="font-semibold">Renter's Number:</span> 
            <a href={`tel:${vehicleData.renter?.mobile}`}>{vehicleData.renter?.mobile}</a>, 
            <a href={`tel:${vehicleData.renter?.spouse_mobile}`}>{vehicleData.renter?.spouse_mobile}</a>
          </p>
          <button
            className="w-full py-2 px-4 mt-4 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600"
            onClick={handleSendChallan}
          >
            Send Challan
          </button>
        </div>
      )}

      {challanMessage && <p className="mt-4">{challanMessage}</p>}
    </div>
  );
}

export default FindVehicle;
