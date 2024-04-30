import React, { useState, useEffect } from 'react';
import axios from "axios";

// Reusable component for input with label
const LabeledInput = ({ value, label, onChange, editable }) => (
  <label className="relative m-2">
    <div contentEditable={editable} className={`p-2 m-2 bg-neutral-100 rounded-sm border text-black border-black w-full ${editable ? 'cursor-text' : 'cursor-not-allowed'}`}>
      {value}
    </div>
    <span className='absolute top-[-1.5rem] md:top-[-0.85rem] left-6 text-opacity-80 font-medium bg-neutral-100 px-2'>{label}</span>
  </label>
);

export default function UserProfile() {
  const [owner, setOwner] = useState(null);
  const [renter, setRenter] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [pet, setPet] = useState(null);

  // State variables to track edit mode for each section
  const [ownerEditMode, setOwnerEditMode] = useState(false);
  const [renterEditMode, setRenterEditMode] = useState(false);
  const [petEditMode, setPetEditMode] = useState(false);
  const [VehicleEditMode, setVehicleEditMode] = useState(false);

  const [vehicleEntries, setVehicleEntries] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ownerResponse, renterResponse, vehicleResponse, petResponse] = await Promise.all([
          axios.get("https://pearlcrest.onrender.com/api/v1/owners/get-owner", { withCredentials: true }),
          axios.get("https://pearlcrest.onrender.com/api/v1/renters/get-renter", { withCredentials: true }),
          axios.get("https://pearlcrest.onrender.com/api/v1/vehicle/get-vehicles", { withCredentials: true }),
          axios.get("https://pearlcrest.onrender.com/api/v1/pets/get-pets", { withCredentials: true })
        ]);
        setOwner(ownerResponse.data.data);
        setRenter(renterResponse.data.data);
        setVehicle(vehicleResponse.data.data);
        setPet(petResponse.data.data);
        console.log(pet);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // Function to toggle edit mode for owner section
  const toggleOwnerEditMode = () => {
    setOwnerEditMode(!ownerEditMode);
  };

  // Function to toggle edit mode for renter section
  const toggleRenterEditMode = () => {
    setRenterEditMode(!renterEditMode);
  };

  // Function to toggle edit mode for pet section
  const togglePetEditMode = () => {
    setPetEditMode(!petEditMode);
  };

  const toggleVehicleEditMode = () => {
    setVehicleEditMode(!VehicleEditMode);
  };
  // Function to save changes made in owner section
  const saveOwnerChanges = () => {
    // Implement save logic here
    toggleOwnerEditMode();
  };

  // Function to save changes made in renter section
  const saveRenterChanges = () => {
    // Implement save logic here
    toggleRenterEditMode();
  };

  // Function to save changes made in pet section
  const savePetChanges = () => {
    // Implement save logic here
    togglePetEditMode();
  };
  const addVehicleEntry = () => {
    setVehicleEntries([...vehicleEntries, {}]);
  };

  return (
    <div className='m-5'>
      <h1 className='text-2xl m-3 font-semibold border-b-2 border-black w-1/4'>Your Profile</h1>
      <div className='grid gap-5 p-5'>
        <h2 className='text-lg font-medium border-l-2 bg-zinc-200 border-b-2 shadow-md shadow-black p-2 border-black'>Owner</h2>
        <div className='md:grid gap-5 grid-cols-2'>
          {ownerEditMode ? (
            <>
              <LabeledInput value={owner?.name} label="Name" onChange={(e) => setOwner({ ...owner, name: e.target.value })} editable={ownerEditMode} />
              <LabeledInput value={owner?.email} label="Email" onChange={(e) => setOwner({ ...owner, email: e.target.value })} editable={ownerEditMode} />
              <LabeledInput value={owner?.mobile} label="Mobile" onChange={(e) => setOwner({ ...owner, mobile: e.target.value })} editable={ownerEditMode} />
              <LabeledInput value={owner?.aadhar} label="Aadhar" onChange={(e) => setOwner({ ...owner, aadhar: e.target.value })} editable={ownerEditMode} />
              <LabeledInput value={owner?.spouse_name} label="Spouse Name" editable={ownerEditMode} />
              <LabeledInput value={owner?.spouse_mobile} label="Spouse Mobile" editable={ownerEditMode} />
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
              <button className="m-5 p-2 w-1/4 bg-black text-white rounded-sm" onClick={toggleOwnerEditMode}>Edit</button>
            </>
          )}
        </div>
        <h2 className='text-lg font-medium border-l-2 bg-zinc-200 border-b-2 shadow-md shadow-black p-2 border-black'>Renter</h2>
        <div className='md:grid gap-5 grid-cols-2'>
          {renterEditMode ? (
            <>
              <LabeledInput value={renter?.name} label="Name" onChange={(e) => setRenter({ ...renter, name: e.target.value })} editable={renterEditMode} />
              <LabeledInput value={renter?.email} label="Email" onChange={(e) => setRenter({ ...renter, email: e.target.value })} editable={renterEditMode} />
              <LabeledInput value={renter?.mobile} label="Mobile" onChange={(e) => setRenter({ ...renter, mobile: e.target.value })} editable={renterEditMode} />
              <LabeledInput value={renter?.aadhar} label="Aadhar" onChange={(e) => setRenter({ ...renter, aadhar: e.target.value })} editable={renterEditMode} />
              <LabeledInput value={renter?.spouse_name} label="Spouse Name" editable={ownerEditMode} />
              <LabeledInput value={renter?.spouse_mobile} label="Spouse Mobile" editable={ownerEditMode} />
              <button className="m-5 p-2 w-1/4 bg-blue-700 text-white rounded-sm"  onClick={saveRenterChanges}>Save</button>
              <button className="m-5 p-2 w-1/4 bg-red-500 text-white rounded-sm" onClick={toggleRenterEditMode}>Cancel</button>
            </>
          ) : (
            <>
              <LabeledInput value={renter?.name} label="Name" editable={renterEditMode} />
              <LabeledInput value={renter?.email} label="Email" editable={renterEditMode} />
              <LabeledInput value={renter?.mobile} label="Mobile" editable={renterEditMode} />
              <LabeledInput value={renter?.aadhar} label="Aadhar" editable={renterEditMode} />
              <LabeledInput value={renter?.spouse_name} label="Spouse Name" editable={ownerEditMode} />
              <LabeledInput value={renter?.spouse_mobile} label="Spouse Mobile" editable={ownerEditMode} />
              <button className="m-5 p-2 w-1/4 bg-black text-white rounded-sm" onClick={toggleRenterEditMode}>Edit</button>
            </>
          )}
        </div>
        <h2 className='text-lg font-medium border-l-2 bg-zinc-200 border-b-2 shadow-md shadow-black p-2 border-black'>Pets</h2>
          <div className='md:grid gap-5 grid-cols-2'>
            {petEditMode ? (
              <>
                <LabeledInput value={pet?.type} label="Type" editable={petEditMode} />
                <LabeledInput value={pet?.breed} label="Breed" editable={petEditMode} />
                <button className="m-5 p-2 w-1/4 bg-blue-700 text-white rounded-sm" onClick={savePetChanges}>Save</button>
                <button className="m-5 p-2 w-1/4 bg-red-500 text-white rounded-sm" onClick={togglePetEditMode}>Cancel</button>
              </>
            ) : (
              <>
                <LabeledInput value={pet?.type} label="Type" editable={petEditMode} />
                <LabeledInput value={pet?.breed} label="Breed" editable={petEditMode} />
                <button className="m-5 p-2 w-1/4 bg-black text-white rounded-sm" onClick={togglePetEditMode}>Edit</button>
              </>
            )}
          </div>
          <h2 className='text-lg font-medium border-l-2 bg-zinc-200 border-b-2 shadow-md shadow-black p-2 border-black'>Vehicle</h2>
          <button className="m-5 p-2 w-1/4 bg-blue-700 text-white rounded-sm" onClick={addVehicleEntry}>Add vehicle</button>
        <div className=''>
          {vehicleEntries.map((entry, index) => (
            <div key={index} className='flex flex-col'>
              <h3>Vehicle {index+1}</h3>
              <select className="m-3 border-black border-b-2" label="Type" disabled={!VehicleEditMode} >
              <option value="None">None</option>
              <option value="Cycle">Cycle</option>
              <option value="Four Wheeler">Four Wheeler</option>
              <option value="Two Wheeler">Two Wheeler</option>
              </select>
              <LabeledInput label="License Plate" editable={VehicleEditMode} />
              <LabeledInput label="Colour" editable={VehicleEditMode} />
              <LabeledInput label="Model" editable={VehicleEditMode} />
              <button className="m-5 p-2 w-1/4 bg-black text-white rounded-sm" onClick={toggleVehicleEditMode}>Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
