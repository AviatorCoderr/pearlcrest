import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function AddPaymentVoucher() {
  const [mode, setMode] = useState('');
  const [amount, setAmount] = useState('');
  const [executive, setExecutive] = useState('');
  const [department, setDepartment] = useState('');
  const [partyname, setPartyname] = useState('');
  const [partycontact, setPartycontact] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchname = async () => {
      try {
        const response = await axios.get('/api/v1/owners/get-owner', {withCredentials: true});
        setExecutive(response.data.data.name);
      } catch (error) {
        console.error('Error fetching executive:', error);
      }
    };
    fetchname();
    console.log(executive)
  }, []);

  const handleSubmit = async () => {
    try{
      const confirmation = await Swal.fire({
        title: 'Confirm Details',
        html: `
          <div>
            <p><strong>Name of Service Provider:</strong> ${partyname}</p>
            <p><strong>Mobile Number of Service Provider:</strong> ${partycontact}</p>
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>Description of Work:</strong> ${description}</p>
            <p><strong>Mode of Payment:</strong> ${mode}</p>
            <p><strong>Amount:</strong> ${amount}</p>
          </div>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      });
      if(confirmation.isConfirmed){
        axios.post('http://localhost:8000/api/v1/account/add-expenditure', {
          mode: mode,
          amount: amount,
          executive_name: executive,
          department: department,
          partyname: partyname,
          partycontact: partycontact,
          description: description,
        }, {withCredentials: true})
        .then(response => {
          console.log('Expense added:', response.data);
          Swal.fire({
            title: 'Expense Added',
            text: 'Data added successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        })
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to add expense',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Add expense error:', error);
    }
  };

  return (
    <div className='m-5'>
      <strong className='text-xl m-5 font-semibold'>Add Payment Voucher</strong>
      <div className='grid gap-5 p-5'>
        <input
          className='p-2 rounded-sm shadow-lg border border-black '
          type='text'
          placeholder='Name of Service Provider'
          onChange={(e) => setPartyname(e.target.value)}
        />
        <input
          className='p-2 rounded-sm shadow-lg border border-black '
          type='text'
          placeholder='Mobile Number of Service Provider'
          onChange={(e) => setPartycontact(e.target.value)}
        />
        <select
          className='p-2 rounded-sm shadow-lg border border-black'
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value=''>Select Department</option>
          <option value='Labour Expenses'>Labour Expenses</option>
          <option value='Diesel Expenses for Genset'>Diesel Expenses for Genset</option>
          <option value='Electricity Bill Paid'>Electricity Bill Paid</option>
          <option value='Garbage collection Charges'>Garbage collection Charges</option>
          <option value='Genset Maintenance Charges'>Genset Maintenance Charges</option>
          <option value='OTIS Elevator Maintenace Charges'>OTIS Elevator Maintenace Charges</option>
          <option value='Plumbing Charges'>Plumbing Charges</option>
          <option value='Household Items Purchased'>Household Items Purchased</option>
          <option value='HouseKeeping Charges'>HouseKeeping Charges</option>
          <option value='Festival Celebration Expenses'>Festival Celebration Expenses</option>
          <option value='Administrative Expenses'>Administrative Expenses</option>
          <option value='Maali Charges'>Maali Charges</option>
          <option value='Security Expenses'>Security Expenses</option>
          <option value='Sewerage Cleaning Charges'>Sewerage Cleaning Charges</option>
          <option value='Shiv Mandir Expenses'>Shiv Mandir Expenses</option>
          <option value='Printing and Stationery'>Printing and Stationery</option>
          <option value='Travelling and Transport Expenses'>Travelling and Transport Expenses</option>
          <option value='Water Tank Cleaning Expenses'>Water Tank Cleaning Expenses</option>
          <option value='Bank Charges'>Bank Charges</option>
          <option value='Fixed Assets Purchased'>Fixed Assets Purchased</option>
          <option value='Investment in FD'>Investment in FD</option>
        </select>
        <input
          className='p-2 rounded-sm shadow-lg border border-black '
          type='text'
          placeholder='Description of Work'
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className='p-2 rounded-sm shadow-lg border border-black '
          type='text'
          placeholder='Mode of payment'
          onChange={(e) => setMode(e.target.value)}
        />
        <input
          className='p-2 rounded-sm shadow-lg border border-black '
          type='number'
          placeholder='Amount'
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button
        onClick={handleSubmit}
        className='m-5 bg-black text-white px-5 py-2 rounded-xl hover:opacity-80'
      >
        Submit
      </button>
    </div>
  );
}
