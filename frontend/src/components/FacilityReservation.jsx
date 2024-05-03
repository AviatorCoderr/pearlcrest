import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function FacilityReservation() {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [purpose, setPurpose] = useState(null);
    const [amount, setAmount] = useState(0);
    const [days, setDays] = useState(null);

    useEffect(() => {
        const calculateAmount = () => {
            if (start && end) {
                const startDate = new Date(start);
                const endDate = new Date(end);
                const daysDifference = Math.abs((endDate - startDate) / (1000 * 60 * 60 * 24));
                setDays(daysDifference + 1);
                return (2000 * (daysDifference + 1)).toFixed(2); // Rounded to 2 decimal places
            }
            return 0;
        };
        setAmount(calculateAmount());
    }, [start, end]);

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
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-8">Book Your Facility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">Choose Facility</label>
                    <select
                        id="purpose"
                        name="purpose"
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Select Facility</option>
                        <option value="Community Hall">Community Hall</option>
                        <option value="Terrace Block A">Terrace Block A</option>
                        <option value="Terrace Block B">Terrace Block B</option>
                        <option value="Terrace Block C">Terrace Block C</option>
                        <option value="Basement Area">Basement Area</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                        id="startDate"
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        onChange={(e) => setStart(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                        id="endDate"
                        type="date"
                        min={start || new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        onChange={(e) => setEnd(e.target.value)}
                    />
                </div>
                <div className="col-span-2">
                    <p className="text-gray-700">Number of Days: {days}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-gray-700">Estimated Amount: ₹ {amount}</p>
                </div>
            </div>
            <button
                className="mt-8 w-full py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                onClick={handleCheckout}
            >
                Continue & Pay
            </button>
        </div>
    );
}
