import React from 'react'

export default function AddComplaints() {
  return (
    <div className='m-5'>
    <strong className='text-xl m-5 font-semibold'>Register your Complaints</strong>
    <div className='grid gap-5 p-5'>
        <select className="p-2 rounded-sm shadow-lg border border-black " name="Complaint type" id="type">
            <option value="None">Type of Complaint</option>
            <option value="">Sewage</option>
            <option value="">Other</option>
        </select>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='Description'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="image"/>
    </div>
    <button className='m-5 bg-black text-white px-5 py-2 rounded-xl hover:opacity-80'>Submit</button>
    </div>
  )
}