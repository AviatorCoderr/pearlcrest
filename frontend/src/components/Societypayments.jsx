import React, { useState, useEffect } from 'react';
import axios from "axios";
import Swal from 'sweetalert2'; // Import Swal
import { CircleLoader } from 'react-spinners'; // Import CircleLoader if not already imported

const Societypayments = () => {
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [purpose, setPurpose] = useState(null);
  const [monthsPaid, setMonthsPaid] = useState([]);
  const [amountper, setAmountper] = useState(0.0);
  const [paydemand, setpaydemand] = useState([]);
  const [amount, setAmount] = useState(0.0);
  const [qrCodeDataUri, setQrCodeDataUri] = useState('');
  const [qrlink, setQrLink] = useState(null);
  const [checkout, setCheckout] = useState(false);
  const [transactionId, setTransactionId] = useState(''); // Define transactionId state
  const [loading, setLoading] = useState(false); // Define loading state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); 

  useEffect(() => {
    const getMonthsPaid = async () => {
      try {
        const response = await axios.get("/api/v1/account/get-maintenance-record", { withCredentials: true });
        setMonthsPaid(response.data.data);
      } catch (error) {
        console.error("Error fetching months paid:", error);
      }
    };

    const getDemand = async () => {
      try {
        const response = await axios.get("/api/v1/demand/getpaydemand")
        const filtered = (response.data.data.response.filter((ele) => ele.type !== "FACILITY RESERVATION"))
        setpaydemand(filtered)
      } catch (error) {
        console.error(error.message)
      }
    }

    getMonthsPaid();
    getDemand();
  }, []);

  useEffect(() => {
    const selectedAmount = paydemand.find((ele) => ele.type === purpose)?.amount || 0;
    setAmountper(selectedAmount);
    let newAmount;
    if (purpose === "MAINTENANCE") {
      newAmount = selectedMonths.length * selectedAmount;
    } else {
      newAmount = selectedAmount;
    }
    setAmount(newAmount);
  }, [selectedMonths, purpose, paydemand]);


  const handlePurposeChange = (e) => {
    const selectedPurpose = e.target.value;
    setPurpose(selectedPurpose);
    setCheckout(false);
    setSelectedMonths([]);
  };

  const handleMonthToggle = (month) => {
    const index = selectedMonths.indexOf(month);
    if (index === -1) {
      setSelectedMonths([...selectedMonths, month]);
    } else {
      setSelectedMonths(selectedMonths.filter((m) => m !== month));
    }
    if (checkout === true)
      setCheckout(!checkout);
  };

  const isMonthSelected = (month) => selectedMonths.includes(month);

  const getMonthYearString = (date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: '2-digit' }).format(date);
  };

  const getAllMonthsOfYear = (year) => {
    const months = [];
    const nextYear = year + 1;

    for (let i = 3; i < 15; i++) { 
      const currentMonth = i % 12; 
      const currentDate = new Date(currentMonth < 3 ? nextYear : year, currentMonth);
      const monthYearString = getMonthYearString(currentDate);
      months.push(monthYearString);
    }
    return months;
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
    setSelectedMonths([]);
  };
  const currentyear=  new Date().getFullYear()
  const years = [currentyear-4, currentyear-3, currentyear-2, currentyear-1, currentyear, currentyear + 1];
  const months = getAllMonthsOfYear(selectedYear);

  const handleCheckout = async () => {
    if (purpose === "MAINTENANCE" && selectedMonths.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select months',
      });
    }
    else if (!amount || !purpose) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Some fields are empty',
      });
    }
    else {
      const response = await axios.post("/api/v1/account/generate-qr", { amount });
      setQrCodeDataUri(response.data.qrCodeDataUri);
      setQrLink(response.data.qrcodeUrl);
      setCheckout(true);
    }
  };

  const handleConfirm = async () => {
    if (!transactionId) {
      Swal.fire({
        icon: 'error',
        title: 'Enter Transaction ID',
        text: 'Please enter transaction ID correctly else your payment will not be verified.'
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/account/add-untrans", {
        purpose, amount, months: selectedMonths, transactionId
      });
      // Handle success
      Swal.fire({
        icon: 'success',
        title: 'Payment Confirmed',
        text: `Your payment has been successfully confirmed. your transaction id is ${response?.data?.data?._id}`
      })
      .then(response => {
        window.location.reload()
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: error.response.data.message || 'An error occurred while confirming payment.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold mb-8">Make Your Payments</h2>
      <div className="grid gap-5 p-5 bg-white rounded-lg shadow-md">
        <select onChange={handlePurposeChange} className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500">
          <option value={null}>Choose Payment Purpose</option>
          {paydemand.map((ele, index) => (
            <option key={index} value={ele.type}>{ele.type}</option>
          ))}
        </select>
        {(amountper === 0.0) ?
          <input
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder='Enter Amount you wish to contribute'
            type='number'
            min={0}
            onChange={(e) => setAmount(parseFloat(e.target.value))}>
          </input>
          :
          <></>
        }
        {purpose === "MAINTENANCE" &&
          <>
            <select onChange={handleYearChange} defaultValue={2024} className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500">
              {years.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {months.map((month, index) => (
                <label key={index} className={`cursor-pointer p-2 flex gap-2 ${(monthsPaid.includes(month)) ? "bg-green-500" : "bg-red-500"} rounded-lg shadow-sm`}>
                  <input
                    type="checkbox"
                    checked={isMonthSelected(month)}
                    onChange={() => handleMonthToggle(month)}
                    disabled={monthsPaid.includes(month)}
                  />
                  {month}
                </label>
              ))}
            </div>
          </>
        }
      </div>
      <div className="m-3 flex justify-between items-center">
        <p>Payable Amount:</p>
        <p className="font-semibold text-xl text-blue-500">₹{amount ? amount : 0}</p>
      </div>
      <button onClick={() => handleCheckout()} className="mt-5 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition duration-300">Continue & Pay</button>
      <div>
        {checkout &&
          <div className='m-5'>
            <p className="text-red-500 font-semibold mb-2">Transaction ID is required. Please provide it:</p>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">Enter Transaction Id</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
        }
        {(qrCodeDataUri && checkout) &&
          <div>
            <div className="mt-8 flex justify-center items-center">
              <a href={qrlink} target="_blank" rel="noopener noreferrer"><img src={qrCodeDataUri} alt="QR Code" className="w-full md:w-64 border-2 border-black h-64" /></a>
            </div>
            <div className="mt-8 flex-row justify-center items-center">
              <p className="text-lg text-center font-semibold">Scan this QR Code</p>
              <p className="text-lg text-center font-semibold">OR</p>
              <p className='text-lg text-center font-semibold'>Click on the QR for UPI Payments</p>
              <p className='text-lg text-center font-semibold'>OR</p>
              <p className='text-lg text-center font-semibold'>Transfer the amount through any payment mode and share the transaction ID</p>
              <p className='text-lg text-center font-semibold'>IFSC CODE - PUNB0093900</p>
              <p className='text-lg text-center font-semibold'>ACCOUNT NUMBER - 0939000100236216</p>
            </div>
            <div className="mt-4 flex justify-center items-center space-x-4">
              <p>Supported for now only on</p>
              <img className="w-12 h-12" src="/static/images/download.png" alt="bhim_upi" />
            </div>
            <button
              className="mt-8 w-full py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              onClick={() => handleConfirm()}
              disabled={loading}
            >
              {loading ? <CircleLoader color="#ffffff" loading={loading} size={20} /> : 'Confirm Booking'} {/* Show CircleLoader while loading */}
            </button>
          </div>
        }
      </div>
    </div>
  );
};

export default Societypayments;
