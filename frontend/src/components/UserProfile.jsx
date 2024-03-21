import React from 'react'

export default function UserProfile() {
  return (
    <div className='m-5'>
    <strong className='text-xl m-5 font-semibold'>Your Profile</strong>
    <div className='grid gap-5 p-5'>
        <strong>Owner Details</strong>
        <div className='grid gap-5 grid-cols-2'>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='NAME'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="email" placeholder='EMAIL'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='CONTACT NO'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='AADHAR NO'/>
        </div>
        <strong>Owner's Spouse Details</strong>
        <div className='grid gap-5 grid-cols-2'>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='NAME'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="email" placeholder='EMAIL'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='CONTACT NO'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='AADHAR NO'/>
        </div>
        <strong>Renter's Details</strong>
        <div className='grid gap-5 grid-cols-2'>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='NAME'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="email" placeholder='EMAIL'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='CONTACT NO'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='AADHAR NO'/>
        </div>
        <strong>Renter's Spouse Details</strong>
        <div className='grid gap-5 grid-cols-2'>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='NAME'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="email" placeholder='EMAIL'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='CONTACT NO'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='AADHAR NO'/>
        </div>
        <strong>Vehicle Details</strong>
        <div className='grid gap-5 grid-cols-2'>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='NAME'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="email" placeholder='EMAIL'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='CONTACT NO'/>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='AADHAR NO'/>
        </div>
    </div>
    <button className='m-5 bg-black text-white px-5 py-2 rounded-xl hover:opacity-80'>Continue & Pay</button>
    </div>
  )
}
