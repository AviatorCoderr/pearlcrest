import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FiCopy } from 'react-icons/fi';
const LabeledInput = ({ label, value, onChange, type }) => (
  <label className="relative m-2">
    <span className='absolute top-[-1.5rem] md:top-[-0.85rem] left-6 text-opacity-80 font-medium bg-neutral-100 px-2'>{label}</span>
    <input
      className='p-2 rounded-sm shadow-lg border border-black w-full'
      type={type}
      value={value}
      onChange={onChange}
    />
  </label>
);

export default function AddPaymentVoucher() {
  const navigate = useNavigate()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))?.flatnumber;
    if(user!=="PCS") navigate("/db/unauth")
  })
  const [mode, setMode] = useState('');
  const [amount, setAmount] = useState('');
  const [department, setDepartment] = useState('');
  const [partyname, setPartyname] = useState('');
  const [partycontact, setPartycontact] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date()); 
  const user = JSON.parse(localStorage.getItem("user"))

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
        text: `${label} copied to clipboard`,
        timer: 1500,
        showConfirmButton: false
      });
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Failed to copy',
        text: 'Could not copy to clipboard'
      });
    });
  };
  const handleSubmit = async () => {
    if (!department || !description || !mode || !amount) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all fields',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }
    const mobileRegex = /^\d{10}$/;

    // Regular expression for amount validation
    const amountRegex = /^\d+(\.\d{1,2})?$/;

    if (!mobileRegex.test((partycontact)? partycontact : "0000000000")) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please enter a valid mobile number',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!amountRegex.test(amount)) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please enter a valid amount (e.g., 100 or 100.50)',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
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
            <p><strong>Date:</strong> ${date}</p>
          </div>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      });
      if (confirmation.isConfirmed) {
        axios.post('/api/v1/account/add-expenditure', {
          mode: mode,
          amount: amount,
          executive_name: user.flatnumber,
          department: department,
          partyname: partyname,
          partycontact: partycontact,
          description: description,
          date
        }, { withCredentials: true })
          .then(response => {
            console.log('Expense added:', response.data);
            Swal.fire({
              title: 'Expense Added',
              text: 'Data added successfully',
              icon: 'success',
              confirmButtonText: 'OK',
            })
            .then(() => {
              setMode('');
              setAmount('');
              setDepartment('');
              setPartyname('');
              setPartycontact('');
              setDescription('');
              setDate('');
              window.location.reload()
            })
          })
          .catch(error => {
            Swal.fire({
              title: 'Error',
              text: 'Failed to add expense',
              icon: 'error',
              confirmButtonText: 'OK',
            })
            console.error('Add expense error:', error);
          });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to add expense',
        icon: 'error',
        confirmButtonText: 'OK',
      })
      console.error('Add expense error:', error);
    }
  };

  return (
    <div className='m-5'>
      <strong className='text-xl m-5 font-semibold'>Add Payment Voucher</strong>
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 m-5 mb-6'>
        <h3 className='text-lg font-medium text-gray-800 mb-3 flex items-center'>
          <span className='mr-2 text-blue-500'>🏦</span> Society Bank Details
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-700">Account Name</span>
              <p className="text-sm font-semibold text-gray-900">PEARL CREST FLAT OWNERS SOCIETY</p>
            </div>
            <button
              onClick={() => copyToClipboard('PEARL CREST FLAT OWNERS SOCIETY', 'Account Name')}
              className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Copy Account Name"
            >
              <FiCopy size={18} />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-700">Account Number</span>
              <p className="text-sm font-semibold text-gray-900 tracking-wide">_00000448674139299</p>
            </div>
            <button
              onClick={() => copyToClipboard('_00000448674139299', 'Account Number')}
              className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Copy Account Number"
            >
              <FiCopy size={18} />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-700">IFS Code</span>
              <p className="text-sm font-semibold text-gray-900 tracking-wide">SBIN0004143</p>
            </div>
            <button
              onClick={() => copyToClipboard('SBIN0004143', 'IFS Code')}
              className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Copy IFS Code"
            >
              <FiCopy size={18} />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-700">UPI ID</span>
              <p className="text-sm font-semibold text-gray-900 tracking-wide">4867413299@sbi</p>
            </div>
            <button
              onClick={() => copyToClipboard('4867413299@sbi', 'UPI ID')}
              className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Copy UPI ID"
            >
              <FiCopy size={18} />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-700">Account Type</span>
              <p className="text-sm font-semibold text-gray-900">Current Account</p>
            </div>
            <button
              onClick={() => copyToClipboard('Current Account', 'Account Type')}
              className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Copy Account Type"
            >
              <FiCopy size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className='grid gap-5 p-5'>
        <LabeledInput
          label='Name of Service Provider'
          value={partyname}
          onChange={(e) => setPartyname(e.target.value)}
        />
        <LabeledInput
          label='Mobile Number of Service Provider'
          value={partycontact}
          onChange={(e) => setPartycontact(e.target.value)}
        />
        <label className="relative m-2">
          <span className='absolute top-[-1.5rem] md:top-[-0.85rem] left-6 text-opacity-80 font-medium bg-neutral-100 px-2'>Expense Head</span>
          <select
            className='p-2 rounded-sm shadow-lg border border-black w-full'
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value=''>Select Expense Head</option>
            <option value='Labour Expenses'>Labour Expenses</option>
            <option value='Diesel Expenses for Genset'>Diesel Expenses for Genset</option>
            <option value='Electricity Bill Paid'>Electricity Bill Paid</option>
            <option value='Garbage collection Charges'>Garbage collection Charges</option>
            <option value='Genset Maintenance Charges'>Genset Maintenance Charges</option>
            <option value='OTIS Elevator Maintenance Charges'>OTIS Elevator Maintenance Charges</option>
            <option value='Plumbing Charges'>Plumbing Charges</option>
            <option value='Household Items Purchased'>Household Items Purchased</option>
            <option value='HouseKeeping Charges'>HouseKeeping Charges</option>
            <option value='Festival Celebration Expenses'>Festival Celebration Expenses</option>
            <option value='Administrative Expenses'>Administrative Expenses</option>
            <option value='Plantation Expenses'>Plantation Expenses</option>
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
        </label>
        <LabeledInput
          label='Description of Work'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="relative m-2">
          <span className='absolute top-[-1.5rem] md:top-[-0.85rem] left-6 text-opacity-80 font-medium bg-neutral-100 px-2'>Mode of Payment</span>
          <select
            className='p-2 rounded-sm shadow-lg border border-black w-full'
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value=''>Choose one</option>
            <option value="CASH">CASH</option>
            <option value="BANK">BANK</option>
          </select>
        </label>
        <LabeledInput
          label='Amount'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <LabeledInput
          label='Date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
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
