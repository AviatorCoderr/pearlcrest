import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function AddIncome() {
  const [mode, setMode] = useState('');
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState([]);
  const [flatnumber, setFlat] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMonths([...months, value]);
    } else {
      setMonths(months.filter((month) => month !== value));
    }
  };

  const handleSubmit = async () => {
    try {
      const confirmation = await Swal.fire({
        title: 'Confirm Details',
        html: `
          <div>
            <p><strong>Flat:</strong> ${flatnumber}</p>
            <p><strong>Purpose:</strong> ${purpose}</p>
            <p><strong>Mode of Payment:</strong> ${mode}</p>
            <p><strong>Amount:</strong> ${amount}</p>
            <p><strong>Months:</strong> ${months.join(', ')}</p>
          </div>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
      });
      if (confirmation.isConfirmed) {
        const currentMonthString = new Date().toLocaleString('default', { month: 'long' });
        console.log("Current month:", currentMonthString);
        if(purpose==="Cash Deposit" || purpose==="Cash withdrawal"){
          await axios.post('http://localhost:8000/api/v1/account/add-admin-income', {
          mode: mode,
          amount: amount,
          purpose: purpose,
          months: [...months, currentMonthString],
          flatnumber: flatnumber
        })
        .then(response => {
            Swal.fire({
                title: 'Income Added',
                text: 'Data added successfully',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        })
        }
        else{
          await axios.post('http://localhost:8000/api/v1/account/add-admin-transaction', {
          mode: mode,
          amount: amount,
          purpose: purpose,
          months: months,
          flatnumber: flatnumber,
          transactionId
        })
        .then(response => {
            Swal.fire({
                title: 'Income Added',
                text: 'Data added successfully',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        })
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to add income',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Add expense error:', error);
    } 
  };
  const getMonthYearString = (date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: '2-digit' }).format(date);
  };
  const getAllMonthsOfYear = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const currentDate = new Date(2024, i);
      const monthYearString = getMonthYearString(currentDate);
      months.push(monthYearString);
    }
    return months;
  };
  const mon = getAllMonthsOfYear();
  return (
    <div className='m-5'>
      <strong className='text-xl m-5 font-semibold'>Add Income</strong>
      <div className='grid gap-5 p-5'>
        <select
          className='p-2 rounded-sm shadow-lg border border-black'
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value='none'>Select Purpose</option>
          <option value='Maintenance'>Maintenance</option>
          <option value='Cash withdrawal'>Cash withdrawal</option>
          <option value='Cash Deposit'>Cash Deposit</option>
          <option value='Bank Interest'>Bank Interest</option>
        </select>
        {purpose!=="Cash withdrawal" && purpose!=="Cash Deposit" && purpose!="Bank Interest" ?
          <input
            className='p-2 rounded-sm shadow-lg border border-black'
            type='text'
            placeholder='Flat number'
            onChange={(e) => setFlat(e.target.value)}
          /> : <></>
        }
        <select
          className='p-2 rounded-sm shadow-lg border border-black'
          type='text'
          placeholder='Mode of payment'
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="">Choose mode</option>
          <option value="CASH">Cash</option>
          <option value="BANK">Bank</option>
        </select>
        <input
          className='p-2 rounded-sm shadow-lg border border-black'
          type='number'
          placeholder='Amount'
          onChange={(e) => setAmount(e.target.value)}
        />
        {(purpose==="Maintenance") ?
        <div>
          <input type="text" onChange={(e) => setTransactionId(e.target.value)} className='p-2 mb-2 w-full rounded-sm shadow-lg border border-black' placeholder='TransactionID'/>
          <p className='font-semibold'>Select Months:</p>
          {mon.map((month) => (
            <div key={month} className='flex items-center'>
              <input
                type='checkbox'
                id={month}
                value={month}
                onChange={handleCheckboxChange}
                checked={months.includes(month)}
              />
              <label htmlFor={month} className='ml-2'>{month}</label>
            </div>
          ))}
        </div>
        :
        <></>
        }
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
