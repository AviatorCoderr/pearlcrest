import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

export default function BookingDetails() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get("/api/v1/booking/get-all-booking")
            .then(response => {
                setBookings(response.data.data);
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const cancelBooking = async (bookingId) => {
        // Confirmation prompt
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to cancel this booking!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (confirmation.isConfirmed) {
            axios.post("/api/v1/booking/cancel-booking", {
                resid: bookingId
            })
                .then(response => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Booking Cancelled'
                    }).then(() => {
                        window.location.reload();
                    });
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Something went wrong',
                        text: error.response.data.message
                    });
                });
        }
    };

    return (
        <div className='bg-white rounded-md shadow-md overflow-hidden'>
            <div className='bg-blue-500 text-white py-3 px-4'>
                <strong className='text-lg'>Booking Details</strong>
            </div>
            <div className='px-4 py-3 overflow-auto'>
                <table className='w-full text-gray-700 border-collapse border border-gray-300'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='px-4 py-2 border border-gray-300'>Flat Number</th>
                            <th className='px-4 py-2 border border-gray-300'>Transaction Id</th>
                            <th className='px-4 py-2 border border-gray-300'>Amount</th>
                            <th className='px-4 py-2 border border-gray-300'>Area Required</th>
                            <th className='px-4 py-2 border border-gray-300'>Dates</th>
                            <th className='px-4 py-2 border border-gray-300'>Purpose</th>
                            <th className='px-4 py-2 border border-gray-300'>Cancel Booking</th>
                        </tr>
                    </thead>
                    <tbody className='border-t border-gray-400'>
                        {bookings.map(rec => (
                            <tr key={rec._id} className='hover:bg-gray-100 transition-all'>
                                <td className='px-4 py-2 border border-gray-300'>{rec?.flat?.flatnumber}</td>
                                <td className='px-4 py-2 border border-gray-300'>{rec?.transaction?._id}</td>
                                <td className='px-4 py-2 border border-gray-300'>{rec?.transaction?.amount}</td>
                                <td className='px-4 py-2 border border-gray-300'>{rec?.type}</td>
                                <td className='px-4 py-2 border border-gray-300'>
                                    <ul>
                                        {rec?.dates.map((date, index) => (
                                            <li key={index}>{new Date(date).toLocaleDateString()},</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className='px-4 py-2 border border-gray-300'>{rec?.purpose}</td>
                                <td className='px-4 py-2 border border-gray-300'>
                                    <button onClick={() => cancelBooking(rec._id)} className='p-2 bg-red-500 text-white font-bold'>Cancel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
