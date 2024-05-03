import React, { useEffect, useState } from 'react';
import axios from 'axios'
export default function FacilityReservation() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [purpose, setPurpose] = useState(null)
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    const calculateAmount = () => {
      if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const daysDifference = Math.abs((endDate - startDate) / (1000 * 60 * 60 * 24));
        return (2000 * (daysDifference+1)).toFixed(2); // Rounded to 2 decimal places
      }
      return 0;
    };
    setAmount(calculateAmount)
  }, [start, end])
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
    <div className='m-5'>
      <strong className='text-xl m-5 font-semibold'>Book Your Facility</strong>
      <div className='grid gap-5 p-5'>
        <select onChange={(e) => setPurpose(e.target.value)} className="p-2 rounded-sm shadow-lg border border-black" name="Facility" id="type">
          <option value="None">Choose Facility</option>
          <option value="Community Hall">Community Hall</option>
          <option value="Terrace Block A">Terrace Block A</option>
          <option value="Terrace Block B">Terrace Block B</option>
          <option value="Terrace Block C">Terrace Block C</option>
          <option value="Basement Area">Basement Area</option>
        </select>
        <input className="p-2 rounded-sm shadow-lg border border-black" type="date" onChange={(e) => setStart(e.target.value)} />
        <input className="p-2 rounded-sm shadow-lg border border-black" type="date"  onChange={(e) => setEnd(e.target.value)} />
        <p>Amount = {amount}</p>
      </div>
      <button className='m-5 bg-black text-white px-5 py-2 rounded-xl hover:opacity-80' onClick={handleCheckout}>Continue & Pay</button>
    </div>
  );
}
