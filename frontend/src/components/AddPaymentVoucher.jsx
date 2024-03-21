import React from 'react'

export default function AddPaymentVoucher() {
  return (
    <div className='m-5'>
        <strong className='text-xl m-5 font-semibold'>Add Payment Voucher</strong>
        <div className='grid gap-5 p-5'>
            <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='Name of Service Provider' />
            <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='Mobile Number of Service Provider'/>
            <select className="p-2 rounded-sm shadow-lg border border-black" defaultValue="Select" name="type of work" id="">
                <option value="">None</option>
                <option value="">Sewage</option>
            </select>
            <input className="p-2 rounded-sm shadow-lg border border-black " type="text" placeholder='Description of Work'/>
            <input className="p-2 rounded-sm shadow-lg border border-black " type="number" placeholder='Amount'/>
        </div>
        <button className='m-5 bg-black text-white px-5 py-2 rounded-xl hover:opacity-80'>Submit</button>
    </div>
  )
}
