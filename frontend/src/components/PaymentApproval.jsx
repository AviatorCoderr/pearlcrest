import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import Swal from 'sweetalert2';
import ClipLoader from 'react-spinners/ClipLoader';
import jsPDF from 'jspdf';

export default function PaymentApproval() {
    const [response, setResponse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        axios.get("/api/v1/account/get-untrans")
            .then(response =>{
                setResponse(response.data?.data || []);
                setLoading(false);
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: "Something went wrong",
                    text: error.response?.data?.message || "Unknown error occurred"
                });
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-IN");
    }

    const jsPdfGenerator = (receiptNo, date, flatNo, amount, transactionDate, months, purpose, mode, transactionId) => {
        const doc = new jsPDF();
        const logoData = '/static/images/favicon-32x32.png';
        doc.addImage(logoData, 'PNG', 10, 10, 20, 20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("e-Money Receipt", 105, 25, null, null, "center");
        doc.setFontSize(14);
        doc.text("PEARL CREST FLAT OWNERS’ SOCIETY", 105, 35, null, null, "center");
        doc.setFontSize(12);
        doc.text("ARGORA, PUNDAG ROAD, ARGORA, RANCHI – 834002", 105, 45, null, null, "center");
        doc.setFont("times", "normal");
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(10, 70, 185, 130);
        doc.setFont("helvetica", "normal");
        doc.text("Receipt No:", 15, 80);
        doc.setFont("helvetica", "bold");
        doc.text(`${receiptNo}`, 50, 80);
        doc.setFont("helvetica", "normal");
        doc.text("Transaction Id:", 15, 90);
        doc.setFont("helvetica", "bold");
        doc.text(`${transactionId ? transactionId : "CASH"}`, 50, 90);
        // Remaining code...
        return doc.output('arraybuffer');
    };

    const handleApprove = async (flatnumber, mode, purpose, amount, months, transactionId, date, untransid) => {
        try {
            setButtonDisabled(true);
            const response = await axios.post("/api/v1/account/approve", {
                flatnumber, mode, purpose, amount, months, transactionId, date, untransid
            });
            const transaction = response.data.data.trans[0];
            const receipt = jsPdfGenerator(transaction?._id, formatDate(transaction?.createdAt), flatnumber, transaction?.amount, formatDate(transaction?.date), transaction?.months?.join(", "), transaction?.purpose, transaction?.mode, transaction?.transactionId);
            axios.post("/api/v1/account/sendrecieptmail", {
                flatnumber, trans_id: transaction._id, receipt
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Payment Confirmed and mail sent',
                    text: response.data.message || "Success"
                }).then(() => window.location.reload());
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Mail not sent',
                    text: error?.response?.data?.message
                })
            })
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong. Try again',
                text: error.response?.data?.message || "Unknown error occurred"
            }).then(() => window.location.reload());
        } finally {
            setButtonDisabled(false);
        }
    }

    const handleDeny = async(untransid) => {
        try {
            setButtonDisabled(true);
            await axios.post("/api/v1/account/deny", { untransid });
            Swal.fire({
                icon: 'success',
                title: 'Payment Denied and mailed'
            }).then(response => {
                window.location.reload()
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
               icon: 'error',
               title: 'Something went wrong. Please try again',
               text: error?.response?.data?.message
            });
        } finally {
            setButtonDisabled(false);
        }
    }

    return (
        <div className='bg-white rounded-md shadow-md overflow-hidden'>
            <div className='bg-blue-500 text-white py-3 px-4'>
                <strong className='text-lg'>Approve Payments</strong>
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
                                <th className='px-4 py-2 border border-gray-300'>Serial No</th>
                                <th className='px-4 py-2 border border-gray-300'>Flat Number</th>
                                <th className='px-4 py-2 border border-gray-300'>Payment Id</th>
                                <th className='px-4 py-2 border border-gray-300'>Transaction Id</th>
                                <th className='px-4 py-2 border border-gray-300'>Mode</th>
                                <th className='px-4 py-2 border border-gray-300'>Purpose</th>
                                <th className='px-4 py-2 border border-gray-300'>Amount</th>
                                <th className='px-4 py-2 border border-gray-300'>Date</th>
                                <th className='px-4 py-2 border border-gray-300'>Months</th>
                                <th className='px-4 py-2 border border-gray-300'>Approve</th>
                                <th className='px-4 py-2 border border-gray-300'>Deny</th>
                            </tr>
                        </thead>
                        <tbody className='border-t border-gray-400'>
                            {response.map((item, index) => (
                                <tr key={item.transactionId}>
                                    <td className='px-4 py-2 border border-gray-300'>{index+1}</td>
                                    <td className='px-4 py-2 border border-gray-300'>{item.flat?.flatnumber}</td>
                                    <td className='px-4 py-2 border border-gray-300'>{item._id}</td>
                                    <td className='px-4 py-2 border border-gray-300'>{item.transactionId}</td>
                                    <td className='px-4 py-2 border border-gray-300'>{item.mode}</td>
                                    <td className='px-4 py-2 border border-gray-300'>{item.purpose}</td>
                                    <td className='px-4 py-2 border border-gray-300'>{item.amount}</td>
                                    <td className='px-4 py-2 border border-gray-300'>{formatDate(item.date)}</td>
                                    <td className='px-4 py-2 border border-gray-300'>{item?.months?.join(", ")}</td>
                                    <td className='px-4 py-2 border border-gray-300'>
                                        <button 
                                            onClick={() => handleApprove(item.flat?.flatnumber, item.mode, item.purpose, item.amount, item.months, item.transactionId, item.date, item._id)} 
                                            className={`p-2 bg-green-500 text-white font-bold ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                            disabled={buttonDisabled}
                                        >
                                            Approve
                                        </button>
                                    </td>
                                    <td className='px-4 py-2 border border-gray-300'>
                                        <button 
                                            onClick={() => handleDeny(item._id)} 
                                            className={`p-2 bg-red-500 text-white font-bold ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                            disabled={buttonDisabled}
                                        >
                                            Deny
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
