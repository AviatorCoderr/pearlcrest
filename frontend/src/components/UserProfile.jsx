import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function UserProfile() {
  const [owner, setOwner] = useState(null);
  const [renter, setRenter] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [pet, setPet] = useState(null);
  useEffect(() => {
    const getPet = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/pets/get-pets", { withCredentials: true });
        setPet(response.data.data.pets);
      } catch (error) {
        console.log(error);
      }
    };
    const getVehicle = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/vehicle/get-vehicles", { withCredentials: true });
        setVehicle(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getRenter = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/renters/get-renter", { withCredentials: true });
        setRenter(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getOwner = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/owners/get-owner", { withCredentials: true });
        setOwner(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getOwner();
    getRenter();
    getVehicle();
    getPet();
    console.log(owner)
    console.log(renter)
    console.log(vehicle)
    console.log(pet)
  }, []);

  return (
    <div className='m-5'>
      <strong className='text-xl m-5 font-semibold'>Your Profile</strong>
      <div className='grid gap-5 p-5'>
        <strong>Owner Details</strong>
        <div className='grid gap-5 grid-cols-2'>
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue={owner?.name} />
          <input className="p-2 rounded-sm shadow-lg border border-black" type="email" defaultValue={owner?.email} />
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue={owner?.mobile} />
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue={owner?.aadhar} />
        </div>
        <strong>Owner's Spouse Details</strong>
        <div className='grid gap-5 grid-cols-2'>
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue={owner?.spouse_name} />
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue={owner?.spouse_mobile} />
        </div>
        <strong>Renter's Details</strong>
        <div className='grid gap-5 grid-cols-2'>
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue={renter?.name} />
          <input className="p-2 rounded-sm shadow-lg border border-black" type="email" defaultValue={renter?.email} />
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue={renter?.mobile} />
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue={renter?.aadhar} />
        </div>
        <strong>Renter's Spouse Details</strong>
        <div className='grid gap-5 grid-cols-2'>
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue={renter?.spouse_name} />
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue={renter?.spouse_mobile} />
        </div>
        <strong>Vehicle Details</strong>
        <div className='grid gap-5 grid-cols-2'>
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue='' />
          <input className="p-2 rounded-sm shadow-lg border border-black" type="email" defaultValue='' />
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue='' />
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue='' />
        </div>
        <strong>Pet Details</strong>
        {pet?.map(pet => (
          <div className='grid gap-5 grid-cols-2'>
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue={pet?.type} />
          <input className="p-2 rounded-sm shadow-lg border border-black" type="text" defaultValue={pet?.breed} />
          </div>
        ))}
      </div>
      <button className='m-5 bg-black text-white px-5 py-2 rounded-xl hover:opacity-80'>Continue & Pay</button>
    </div>
  );
}
