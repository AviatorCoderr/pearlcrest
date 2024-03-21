import React from 'react'

export default function Societypayments() {
  return (
    <div className='m-5'>
    <strong className='text-xl m-5 font-semibold'>Make your Payments</strong>
    <div className='grid gap-5 p-5'>
        <select className="p-2 rounded-sm shadow-lg border border-black " name="Complaint type" id="type">
            <option value="None">Choose for what</option>
            <option value="">Monthly Maintainence</option>
            <option value="">Corpus Fund</option>
            <option value="">Saraswati Puja Donation</option>
            <option value="">Other</option>
        </select>
        <input className="p-2 rounded-sm shadow-lg border border-black " type="date"/>
        <p >Payable Amount = {3000}</p>
    </div>
    <button className='m-5 bg-black text-white px-5 py-2 rounded-xl hover:opacity-80'>Continue & Pay</button>
    </div>
  )
}
