import React from 'react'

export default function FacilityReservation() {
  return (
    <div className='m-5'>
    <strong className='text-xl m-5 font-semibold'>Book Your Facility</strong>
    <div className='grid gap-5 p-5'>
        <select className="p-2 rounded-sm shadow-lg border border-black " name="Complaint type" id="type">
            <option value="None">Choose Facility</option>
            <option value="">Community Hall</option>
            <option value="">Terrace Block A</option>
            <option value="">Terrace Block B</option>
            <option value="">Terrace Block C</option>
            <option value="">Basement Area</option>
        </select>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="date"/>
        <p>Amount = {3000}</p>
    </div>
    <button className='m-5 bg-black text-white px-5 py-2 rounded-xl hover:opacity-80'>Continue & Pay</button>
    </div>
  )
}
