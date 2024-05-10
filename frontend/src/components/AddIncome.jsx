import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from "jspdf";
import { ClipLoader } from 'react-spinners';
export default function AddIncome() {
  const [mode, setMode] = useState('');
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState(0);
  const [months, setMonths] = useState([]);
  const [flatnumber, setFlat] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paydemand, setPaydemand] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getDemand = async () => {
      try {
        const response = await axios.get("/api/v1/demand/getpaydemand");
        setPaydemand(response.data.data.response);
      } catch (error) {
        console.error(error.message);
      }
    };
    getDemand();
    console.log(paydemand)
  }, []);

  useEffect(() => {
    if(purpose === "MAINTENANCE") {
      setAmount(months.length * (paydemand.find((ele) => ele.type === purpose)?.amount || 0));
    }
  }, [months, purpose, paydemand]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMonths([...months, value]);
    } else {
      setMonths(months.filter((month) => month !== value));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const jsPdfGenerator = (receiptNo, date, flatNo, amount, transactionDate, months, purpose, mode, transactionId) => {
    const doc = new jsPDF();
    // Add logo
    const logoData = '/static/images/favicon-32x32.png';
    doc.addImage(logoData, 'PNG', 10, 10, 20, 20);
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("e-Money Receipt", 105, 25, null, null, "center");
    doc.setFontSize(14);
    doc.text("PEARL CREST FLAT OWNERS’ SOCIETY", 105, 35, null, null, "center");
    doc.setFontSize(12);
    doc.text("ARGORA, PUNDAG ROAD, ARGORA, RANCHI – 834002", 105, 45, null, null, "center");
    // Receipt Details
    doc.setFont("times", "normal");
    // Draw border around receipt details
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 70, 185, 130);
    // Receipt No
    doc.setFont("helvetica", "normal");
    doc.text("Receipt No:", 15, 80);
    doc.setFont("helvetica", "bold");
    doc.text(`${receiptNo}`, 50, 80);

    // Transaction Id or Mode
    doc.setFont("helvetica", "normal");
    doc.text("Transaction Id:", 15, 90);
    doc.setFont("helvetica", "bold");
    doc.text(`${(transactionId) ? transactionId : "CASH"}`, 50, 90);

    // Date
    doc.setFont("helvetica", "normal");
    doc.text("Date:", 15, 100);
    doc.setFont("helvetica", "bold");
    doc.text(`${date}`, 35, 100);
    
    // Received with thanks from Flat No
    doc.setFont("helvetica", "normal");
    doc.text(`Received with thanks in ${mode} from Flat No:`, 15, 110);
    doc.setFont("helvetica", "bold");
    doc.text(`${flatNo}`, 100, 110);
    
    // Amount
    doc.setFont("helvetica", "normal");
    doc.text("Amount:", 15, 120);
    doc.setFont("helvetica", "bold");
    doc.text(`${amount}/-`, 40, 120);
    
    // Transaction Date
    doc.setFont("helvetica", "normal");
    doc.text("Transaction Date:", 15, 130);
    doc.setFont("helvetica", "bold");
    doc.text(`${transactionDate}`, 60, 130);
    
    // For the month
    doc.setFont("helvetica", "normal");
    doc.text("For the month of", 15, 140);
    doc.setFont("helvetica", "bold");
    doc.text(`${months}`, 50, 140);
    
    // On account of purpose Charges of Society
    doc.setFont("helvetica", "normal");
    doc.text(`On account of ${purpose} Charges of Society`, 15, 150);

    // Dashed lines
    doc.setLineWidth(0.1);
    doc.setDrawColor(0);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(15, 155, 90, 155); // Draw dashed line
    
    // Treasurer's Signature
    const signatureData = '/static/images/treasurersign.jpg';
    doc.addImage(signatureData, 'PNG', 95, 160, 40, 20);
    
    // Treasurer
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Treasurer", 105, 195, null, null, "center");

    // Dashed lines
    doc.setLineWidth(0.1);
    doc.setDrawColor(0);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(15, 200, 90, 200); // Draw dashed line

    return doc.output('arraybuffer');
};



  const handleSubmit = async () => {
    try {
      setLoading(true);
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
        if (purpose === "Cash Deposit" || purpose === "Cash withdrawal") {
          const response = await axios.post('/api/v1/account/add-admin-income', {
            mode: mode,
            amount: amount,
            purpose: purpose,
            months: [...months, currentMonthString],
            flatnumber: flatnumber
          });
          Swal.fire({
            title: 'Income Added',
            text: 'Data added successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else if (purpose === "MAINTENANCE") {
          const response = await axios.post('/api/v1/account/add-admin-transaction', {
            mode: mode,
            amount: amount,
            purpose: purpose,
            months: months,
            flatnumber: flatnumber,
            transactionId
          });
          const transdata = response?.data?.data?.trans[0];
          const receipt = jsPdfGenerator(transdata?._id, formatDate(transdata?.date), flatnumber, transdata?.amount, formatDate(transdata?.createdAt), transdata?.months.join(", "), transdata?.purpose, transdata?.mode);
          const mailresponse = await axios.post("/api/v1/account/sendrecieptmail", {
            flatnumber, trans_id: transdata._id, receipt
          },
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          Swal.fire({
            title: 'Income Added',
            text: 'Data added successfully and email sent to flatier',
            icon: 'success',
            showConfirmButton: false
          });
          setMode('');
          setPurpose('');
          setAmount(0);
          setMonths([]);
          setFlat('');
          setTransactionId('');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error?.response?.data?.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Add income error:', error);
    }
    finally{
      setLoading(false);
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
          onChange={(e) => setPurpose(e.target.value.toUpperCase())}
        >
          <option value='none'>Select Purpose</option>
          <option value='Maintenance'>Maintenance</option>
          <option value='Cash withdrawal'>Cash withdrawal</option>
          <option value='Cash Deposit'>Cash Deposit</option>
          <option value='Bank Interest'>Bank Interest</option>
        </select>
        {purpose !== "Cash withdrawal" && purpose !== "Cash Deposit" && purpose !== "Bank Interest" ?
          <input
            className='p-2 rounded-sm shadow-lg border border-black'
            type='text'
            placeholder='Flat number'
            onChange={(e) => setFlat(e.target.value.toUpperCase())}
          /> : <></>
        }
        <select
          className='p-2 rounded-sm shadow-lg border border-black'
          type='text'
          placeholder='Mode of payment'
          onChange={(e) => setMode(e.target.value.toUpperCase())}
        >
          <option value="">Choose mode</option>
          <option value="CASH">Cash</option>
          <option value="BANK">Bank</option>
        </select>
        {purpose !== "MAINTENANCE" ?
          <input
            className='p-2 rounded-sm shadow-lg border border-black'
            type='number'
            placeholder='Amount'
            onChange={(e) => setAmount(e.target.value)}
          /> : <></>
        }
        {(purpose === "MAINTENANCE") ?
          <div>
            {(mode === "BANK") ? <input type="text" onChange={(e) => setTransactionId(e.target.value)} className='p-2 mb-2 w-full rounded-sm shadow-lg border border-black' placeholder='TransactionID' /> : <></>}
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
        {(purpose === "MAINTENANCE") ? <div className="">
            <p>Payable Amount:</p>
            <p className="font-semibold text-xl text-blue-500">₹{amount}</p>
          </div>
          :
          <></>}
      </div>
      <button
        onClick={handleSubmit}
        className={`m-5 px-5 py-2 rounded-xl hover:opacity-80 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black text-white'}`}
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <ClipLoader color='#ffffff' loading={loading} size={20} />
        ) : (
          'Submit'
        )}
      </button>
    </div>
  );
}
