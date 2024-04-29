import React, { useState, useEffect } from 'react';
import axios from "axios";
import image from "../../public/static/images/favicon-32x32.png";

const Societypayments = () => {
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [purpose, setPurpose] = useState("None"); // Set default purpose
  const [monthsPaid, setMonthsPaid] = useState([]);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const getMonthsPaid = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/account/get-maintenance-record", { withCredentials: true });
        setMonthsPaid(response.data.data);
      } catch (error) {
        console.error("Error fetching months paid:", error);
      }
    };
    getMonthsPaid();
  }, []);

  useEffect(() => {
    setAmount(selectedMonths.length * 1700);
  }, [selectedMonths]);

  const handlePurposeChange = (e) => {
    setPurpose(e.target.value);
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
      const response = await axios.post("http://localhost:8000/api/v1/payment/checkout", { amount });
      const { data: { key } } = await axios.post("http://localhost:8000/api/v1/getkey");
      
      const options = {
        key,
        amount: response.data.data.order.amount,
        currency: "INR",
        name: "Pearl Crest Society",
        description: purpose,
        image: "/static/images/favicon-32x32.png",
        order_id: response.data.data.order.id,
        callback_url: "https://localhost:8000/api/v1/payment/paymentverification",
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
    <div className="m-5">
      <strong className="text-xl m-5 font-semibold">Make your Payments</strong>
      <div className="grid gap-5 p-5">
        <select onChange={handlePurposeChange} value={purpose} className="p-2 rounded-sm shadow-lg border border-black" name="Complaint type" id="type">
          <option value="None">Choose for what</option>
          <option value="Maintenance">Monthly Maintenance</option>
          <option value="Corpus Fund">Corpus Fund</option>
          <option value="Saraswati Puja Donation">Saraswati Puja Donation</option>
          <option value="Other">Other</option>
        </select>
        {purpose === "Maintenance" ?
          <div className="grid grid-cols-4 gap-2">
            {months.map((month, index) => (
              <label key={index} className={`cursor-pointer p-2 flex gap-2 ${(monthsPaid.includes(month)) ? "bg-green-500" : "bg-red-500"}`}>
                <input
                  type="checkbox"
                  checked={isMonthSelected(month)}
                  onChange={() => handleMonthToggle(month)}
                  disabled={monthsPaid.includes(month)}
                />
                {month}
              </label>
            ))}
            <p>Payable Amount = {amount}</p>
          </div> : <></>
        }
      </div>
      <button onClick={handleCheckout} className="m-5 bg-black text-white px-5 py-2 rounded-xl hover:opacity-80">Continue & Pay</button>
    </div>
  );
};

export default Societypayments;
