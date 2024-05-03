import React from 'react';
import { jsPDF } from "jspdf";
import { useState, useEffect } from 'react';
import axios from "axios";

export default function PaymentHistory() {
    const [transaction, setTransaction] = useState([]);
    const [user, setUser] = useState("");

    useEffect(() => {
        const getTrans = async() => {
            try {
                const response = await axios.get("/api/v1/account/get-transaction", { withCredentials: true });
                const user = await axios.get("/api/v1/users/get-current-user", { withCredentials: true });
                setTransaction(response.data.data.data);
                setUser(user.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        getTrans();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const jsPdfGenerator = (receiptNo, date, flatNo, amount, transactionDate, months, purpose) => {
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
        doc.text("Receipt No:", 15, 85);
        doc.setFont("helvetica", "bold");
        doc.text(`${receiptNo}`, 50, 85);

        // Date
        doc.setFont("helvetica", "normal");
        doc.text("Date:", 15, 95);
        doc.setFont("helvetica", "bold");
        doc.text(`${date}`, 35, 95);

        // Received with thanks from Flat No
        doc.setFont("helvetica", "normal");
        doc.text("Received with thanks from Flat No:", 15, 105);
        doc.setFont("helvetica", "bold");
        doc.text(`${flatNo}`, 85, 105);

        // Amount
        doc.setFont("helvetica", "normal");
        doc.text("Amount:", 15, 115);
        doc.setFont("helvetica", "bold");
        doc.text(`${amount}/-`, 40, 115);

        // Transaction Date
        doc.setFont("helvetica", "normal");
        doc.text("Transaction Date:", 15, 125);
        doc.setFont("helvetica", "bold");
        doc.text(`${transactionDate}`, 60, 125);

        // For the month
        doc.setFont("helvetica", "normal");
        doc.text("For the month of", 15, 135);
        doc.setFont("helvetica", "bold");
        doc.text(`${months}`, 50, 135);

        // On account of Monthly Maintenance Charges of Society
        doc.setFont("helvetica", "normal");
        doc.text(`On account of ${purpose} Charges of Society`, 15, 145);

        // Dashed lines
        doc.setLineWidth(0.1);
        doc.setDrawColor(0);
        doc.setLineDashPattern([1, 1], 0);
        doc.line(15, 150, 90, 150); // Draw dashed line

        // Treasurer's Signature
        const signatureData = '/static/images/treasurersign.jpg';
        doc.addImage(signatureData, 'PNG', 95, 155, 40, 20);

        // Treasurer
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Treasurer", 105, 190, null, null, "center");

        // Dashed lines
        doc.setLineWidth(0.1);
        doc.setDrawColor(0);
        doc.setLineDashPattern([1, 1], 0);
        doc.line(15, 195, 90, 195); // Draw dashed line
        doc.save(`${receiptNo}.pdf`);
    }

    return (
        <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
            <strong className='bg-blue-500 text-white py-3 px-4 flex items-center justify-between'>Recent Transactions</strong>
            <div className='mt-3'>
                <table className='w-full text-gray-700 text-center'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <td>ID</td>
                            <td>Type</td>
                            <td>Amount</td>
                            <td>Month</td>
                            <td>Date</td>
                            <td>Receipt</td>
                        </tr>
                    </thead>
                    <tbody className='border-t border-gray-400'>
                        {transaction.map((ele, index) => (
                            <tr key={index}>
                                <td>{ele._id}</td>
                                <td>{ele.purpose}</td>
                                <td>{ele.amount}</td>
                                <td>{ele.months.join(", ")}</td>
                                <td>{formatDate(ele.createdAt)}</td>
                                <td><button className="bg-green-500 hover:bg-green-700 text-white font-bold m-1 px-4 rounded" onClick={() => jsPdfGenerator(ele._id, new Date(), user.flatnumber, ele.amount, formatDate(ele.createdAt), ele.months.join(", "), ele.purpose)}>Download Now</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
