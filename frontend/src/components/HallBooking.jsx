import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import Swal from 'sweetalert2';
import ClipLoader from 'react-spinners/ClipLoader';

export default function HallBooking() {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true); // State to track loading
    
    useEffect(() => {
        axios.get("/api/v1/booking/get-booking")
        .then(response => {
            setResponse(response.data.data);
            setLoading(false); // Set loading to false when response is received
            console.log(response)
        })
        .catch(error => {
            console.log(error.message);
            setLoading(false); // Set loading to false on error
        });
    }, []);
    
    const approve = async(resid, transid) => {
        setLoading(true); // Set loading to true when button is clicked
        axios.post("/api/v1/booking/accept-booking", {
            resid,
            transid
        })
        .then(response => {
            Swal.fire({
                icon: 'success',
                title: 'Approved'
            })
            .then(response => {
                window.location.reload()
            })
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message
            })
        })
        .finally(() => setLoading(false)); // Set loading to false after API call
    }
    
    const deny = async(resid, transid) => {
        setLoading(true); // Set loading to true when button is clicked
        axios.post("/api/v1/booking/reject-booking",{
            resid, transid
        })
        .then(response => {
            Swal.fire({
                icon: 'success',
                title: 'Denied'
            })
            .then(response => {
                window.location.reload()
            })
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message
            })
        })
        .finally(() => setLoading(false)); // Set loading to false after API call
    }
    
    return (
        <div className='bg-white rounded-md shadow-md overflow-hidden'>
            <div className='bg-blue-500 text-white py-3 px-4'>
                <strong className='text-lg'>Booking Requests</strong>
            </div>
            <div className='px-4 py-3 overflow-auto'>
                {loading ? (
                    <div className="flex justify-center items-center">
                        <ClipLoader color="#3B82F6" loading={loading} size={35} />
                    </div>
                ) : (
                    <table className='w-full text-gray-700 border-collapse border border-gray-300'>
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className='px-4 py-2 border border-gray-300'>Flat Number</th>
                                <th className='px-4 py-2 border border-gray-300'>Transaction Id</th>
                                <th className='px-4 py-2 border border-gray-300'>Payment Id</th>
                                <th className='px-4 py-2 border border-gray-300'>Amount</th>
                                <th className='px-4 py-2 border border-gray-300'>Area Required</th>
                                <th className='px-4 py-2 border border-gray-300'>Dates</th>
                                <th className='px-4 py-2 border border-gray-300'>Purpose</th>
                                <th className='px-4 py-2 border border-gray-300'>Approve</th>
                                <th className='px-4 py-2 border border-gray-300'>Deny</th>
                            </tr>
                        </thead>
                        <tbody className='border-t border-gray-400'>
                            {response?.map(rec => {
                                if (!rec?.verified) {
                                    return (
                                        <tr key={rec._id} className='hover:bg-gray-100 transition-all'>
                                            <td className='px-4 py-2 border border-gray-300'>{rec?.flat?.flatnumber}</td>
                                            <td className='px-4 py-2 border border-gray-300'>{rec?.transactionUn?.transactionId}</td>
                                            <td className='px-4 py-2 border border-gray-300'>{rec?.transactionUn?._id}</td>
                                            <td className='px-4 py-2 border border-gray-300'>{rec?.transactionUn?.amount}</td>
                                            <td className='px-4 py-2 border border-gray-300'>{rec?.type}</td>
                                            <td className='px-4 py-2 border border-gray-300'>
                                                {rec?.dates.map(date => (
                                                    <div key={date}>{new Date(date).toLocaleDateString()},</div>
                                                ))}
                                            </td>
                                            <td className='px-4 py-2 border border-gray-300'>{rec?.purpose}</td>
                                            <td className='px-4 py-2 border border-gray-300'>
                                                <button 
                                                    onClick={() => approve(rec?._id, rec?.transactionUn?._id)} 
                                                    className='p-2 bg-green-500 text-white font-bold' 
                                                    disabled={loading} // Disable button when loading
                                                >
                                                    Approve
                                                </button>
                                            </td>
                                            <td className='px-4 py-2 border border-gray-300'>
                                                <button 
                                                    onClick={() => deny(rec?._id, rec?.transactionUn?._id)} 
                                                    className='p-2 bg-red-500 text-white font-bold' 
                                                    disabled={loading} // Disable button when loading
                                                >
                                                    Deny
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                                return null; 
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
