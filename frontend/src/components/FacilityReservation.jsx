import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import { CircleLoader } from 'react-spinners';

export default function FacilityReservation() {
    const [selectedDates, setSelectedDates] = useState([]);
    const [purpose, setPurpose] = useState('');
    const [type, setType] = useState('');
    const [amountPerDay, setAmountPerDay] = useState(0.0);
    const [amount, setAmount] = useState(0.0);
    const [qrCodeDataUri, setQrCodeDataUri] = useState('');
    const [transactionId, setTransactionId] = useState(null);
    const [qrlink, setQrLink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkout, setCheckout] = useState(false);
    const [track, setTrack] = useState([]);
    const [allDates, setAllDates] = useState([]);

    useEffect(() => {
        const fetchTrackDates = async () => {
            try {
                const response = await axios.get("/api/v1/booking/trackdates");
                setAllDates(response.data.data);
            } catch (error) {
                console.error("Error fetching track dates:", error.message);
            }
        };
        fetchTrackDates();
    }, []);

    useEffect(() => {
        const Array = allDates.find((ele) => ele.type === type);
        const datesArray = Array?.dates
        const formattedTrackDates = datesArray ? datesArray.map(date => new Date(date)) : [];
        setTrack(formattedTrackDates);
        console.log(track)
    }, [type, allDates]);

    useEffect(() => {
        const fetchAmountPerDay = async () => {
            try {
                const response = await axios.get("/api/v1/demand/getpaydemand");
                const facilityReservations = response.data.data.response.filter(obj => obj.type === "FACILITY RESERVATION");
                setAmountPerDay(facilityReservations.length > 0 ? facilityReservations[0].amount : 0);
            } catch (error) {
                console.error("Error fetching amount per day:", error.message);
            }
        };
        fetchAmountPerDay();
    }, []);

    useEffect(() => {
        setAmount((selectedDates.length * amountPerDay).toFixed(2));
    }, [selectedDates, amountPerDay]);

    const handleCheckout = async () => {
        if (!type || !purpose || selectedDates.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select facility, purpose, and at least one date before checkout!',
            });
        } else {
            try {
                const response = await axios.post("/api/v1/account/generate-qr", { amount });
                setQrCodeDataUri(response.data.qrCodeDataUri);
                setQrLink(response.data.qrcodeUrl);
                setCheckout(true);
            } catch (error) {
                console.error("Error generating QR code:", error.message);
            }
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        const confirmationDetails = `
            Facility: ${type}<br/>
            Purpose: ${purpose}<br/>
            Dates: ${selectedDates.map(date => new Date(date).toLocaleDateString()).join(', ')}<br/>
            Number of Days: ${selectedDates.length}<br/>
            Payable Amount: ₹${amount}<br/>
        `;

        try {
            const result = await Swal.fire({
                title: 'Please Review Your Booking Details',
                html: confirmationDetails,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirm Booking',
                cancelButtonText: 'Edit Details'
            });

            if (result.isConfirmed) {
                const response = await axios.post("/api/v1/booking/book-facility", {
                    purpose,
                    type,
                    amount,
                    dates: selectedDates,
                    transid: transactionId
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Confirmed',
                    text: response.data.message,
                }).then(() => {
                    window.location.reload();
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Booking Failed',
                text: error.response.data.message,
                icon: 'error',
                showConfirmButton: true
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDateClick = (date) => {
        const newDateTimestamp = date.getTime();
        const isDateIncluded = selectedDates.some(selectedDate => selectedDate.getTime() === newDateTimestamp);
        if (!isDateIncluded) {
            setSelectedDates([...selectedDates, date]);
        } else {
            setSelectedDates(selectedDates.filter(selectedDate => selectedDate.getTime() !== newDateTimestamp));
        }
        setCheckout(!checkout);
    };

    const filterDates = (date) => {
        const formattedDate = date.toLocaleDateString();
        const formattedTrackDates = track.map(trackDate => trackDate.toLocaleDateString());
        return !formattedTrackDates.includes(formattedDate);
    };

    const dayClassName = (date) => {
        const formattedDate = date.toLocaleDateString();
        const isSelected = selectedDates.some(selectedDate => new Date(selectedDate).toLocaleDateString() === formattedDate);
        const isTrackDate = track.some(trackDate => trackDate.toLocaleDateString() === formattedDate);

        if (isSelected) {
            return "selected";
        } else if (isTrackDate) {
            return "track-date";
        }
        return "";
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-semibold mb-8">Book Your Facility</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="m-5">
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">Choose Facility</label>
                    <select
                        id="purpose"
                        name="purpose"
                        onChange={(e) => setType(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Select Facility</option>
                        <option value="Community HalL">Community Hall</option>
                        <option value="Terrace Block A">Terrace Block A</option>
                        <option value="Terrace Block B">Terrace Block B</option>
                        <option value="Terrace Block C">Terrace Block C</option>
                        <option value="Basement Area">Basement Area</option>
                    </select>
                </div>
                <div className="m-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                    <input
                        type="text"
                        placeholder="eg: Birthday Party, Anniversary, Wedding Sangeet etc."
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        onChange={(e) => setPurpose(e.target.value.toUpperCase())}
                    />
                </div>
                <div className="m-5">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Select Dates</label>
                    <DatePicker
                        selected={null}
                        onChange={(date) => handleDateClick(date)}
                        inline
                        minDate={ new Date()}
                        filterDate={filterDates}
                        dayClassName={dayClassName}
                    />
                </div>
                <div className="m-5">
                    <p className="text-gray-700">Number of Days: {selectedDates.length}</p>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Selected Dates</label>
                    <div>
                        {selectedDates.sort((a, b) => a.getTime() - b.getTime()).map((date, index) => (
                            <p key={index}>{date.toLocaleDateString()}</p>
                        ))}
                    </div>
                </div>
                <div className="flex m-5 justify-between items-center">
                    <p>Payable Total Amount:</p>
                    <p className="font-semibold text-xl text-blue-500">₹{amount}</p>
                </div>
            </div>
            <button
                className="mt-8 w-full py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                onClick={handleCheckout}
                disabled={loading}
            >
                Checkout
            </button>
            {checkout && (
                <div className="m-5">
                    <p className="text-red-500 font-semibold mb-2">Transaction ID is required. Please provide it:</p>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">Enter Transaction Id</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        onChange={(e) => setTransactionId(e.target.value)}
                    />
                </div>
            )}
            {qrCodeDataUri && checkout && (
                <div>
                    <div className="mt-8 flex justify-center items-center">
                        <a href={qrlink} target="_blank" rel="noopener noreferrer"><img src={qrCodeDataUri} alt="QR Code" className="w-full md:w-64 border-2 border-black h-64" /></a>
                    </div>
                    <div className="mt-8 flex-row justify-center items-center">
                        <p className="text-lg text-center font-semibold">Scan this QR Code</p>
                        <p className="text-lg text-center font-semibold">OR</p>
                        <p className="text-lg text-center font-semibold">Click on the QR for UPI Payments</p>
                        <p className="text-lg text-center font-semibold">OR</p>
                        <p className="text-lg text-center font-semibold">Transfer the amount through any payment mode and share the transaction ID</p>
                        <p className='text-lg text-center font-semibold'>IFSC CODE - PUNB0093900</p>
                        <p className='text-lg text-center font-semibold'>ACCOUNT NUMBER - 0939000100236216</p>
                    </div>
                    <div className="mt-4 flex justify-center items-center space-x-4">
                        <p>Supported for now only on</p>
                        <img className="w-12 h-12" src="/static/images/download.png" alt="bhim_upi" />
                    </div>
                    <button
                        className="mt-8 w-full py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? <CircleLoader color="#ffffff" loading={loading} size={20} /> : 'Confirm Booking'}
                    </button>
                </div>
            )}
        </div>
    );
}
