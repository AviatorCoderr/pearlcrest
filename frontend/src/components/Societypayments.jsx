import React, { useState, useEffect } from 'react';
import axios from "axios";

const Societypayments = () => {
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [purpose, setPurpose] = useState("None");
  const [monthsPaid, setMonthsPaid] = useState([]);
  const [amount, setAmount] = useState(0);
  const [paydemand, setpaydemand] = useState([]);
  
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
        setpaydemand(response.data.data.response)
      } catch (error) {
        console.error(error.message)
      }
    }

    getMonthsPaid();
    getDemand();
  }, []);

  useEffect(() => {
    if(purpose === "MAINTENANCE") {
      setAmount(selectedMonths.length * 1700);
    } else {
      const selectedAmount = paydemand.find((ele) => ele.type === purpose)?.amount || 0;
      setAmount(selectedAmount);
    }
  }, [selectedMonths, purpose, paydemand]);

  const handlePurposeChange = (e) => {
    const selectedPurpose = e.target.value;
    setPurpose(selectedPurpose);
  };

  const handleMonthToggle = (month) => {
    const index = selectedMonths.indexOf(month);
    if (index === -1) {
      setSelectedMonths([...selectedMonths, month]);
    } else {
      setSelectedMonths(selectedMonths.filter((m) => m !== month));
    }
  };

  const isMonthSelected = (month) => selectedMonths.includes(month);

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

  const months = getAllMonthsOfYear();

  const handleCheckout = async () => {
    try {
      const response = await axios.post("/api/v1/payment/checkout", { amount });
      const { data: { key } } = await axios.post("/api/v1/getkey");
      
      const options = {
        key,
        amount: response.data.data.order.amount,
        currency: "INR",
        name: "Pearl Crest Society",
        description: purpose,
        image: "/static/images/favicon-32x32.png",
        order_id: response.data.data.order.id,
        callback_url: "/api/v1/payment/paymentverification",
        prefill: {
          "name": "Kushagra Sahay",
          "email": "kushagra.sahay@gmail.com",
          "contact": "8210183523"
        },
        notes: {
          "address": "Razorpay Corporate Office"
        },
        theme: {
          "color": "#3399cc"
        }
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 rounded-lg shadow-xl">
    <h2 className="text-3xl font-semibold mb-8">Make Your Payments</h2>
      <div className="grid gap-5 p-5 bg-white rounded-lg shadow-md">
        <select onChange={handlePurposeChange} className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500">
          <option value="">Choose Payment Purpose</option>
          {paydemand.map((ele, index) => (
            <option key={index} value={ele.type}>{ele.type}</option>
          ))}
        </select>
        {purpose === "MAINTENANCE" ?
          <div className="flex flex-col md:grid md:grid-cols-4 gap-2">
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
            <div className="col-span-4 flex justify-between items-center">
              <p>Payable Amount:</p>
              <p className="font-semibold text-xl text-blue-500">₹{amount.toFixed(2)}</p>
            </div>
          </div>
          :
          <div className="col-span-4 flex justify-between items-center">
            <p>Payable Amount:</p>
            <p className="font-semibold text-xl text-blue-500">₹{amount.toFixed(2)}</p>
          </div>
        }
      </div>
      <button onClick={handleCheckout} className="mt-5 bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition duration-300">Continue & Pay</button>
    </div>
  );
};

export default Societypayments;
