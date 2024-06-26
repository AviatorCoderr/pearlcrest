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
        return new Date(dateString).toLocaleDateString('en-IN');
    };

    const jsPdfGenerator = (receiptNo, date, flatNo, amount, transactionDate, months, purpose, mode, transactionId) => {
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
        doc.text("Receipt No:", 15, 80);
        doc.setFont("helvetica", "bold");
        doc.text(`${receiptNo}`, 50, 80);
    
        // Transaction Id or Mode
        doc.setFont("helvetica", "normal");
        doc.text("Transaction Id:", 15, 90);
        doc.setFont("helvetica", "bold");
        doc.text(`${(transactionId) ? transactionId : "CASH"}`, 50, 90);
    
        // Date
        doc.setFont("helvetica", "normal");
        doc.text("Date:", 15, 100);
        doc.setFont("helvetica", "bold");
        doc.text(`${new Date(date).toLocaleString("en-IN")}`, 35, 100);
        
        // Received with thanks from Flat No
        doc.setFont("helvetica", "normal");
        doc.text(`Received with thanks in ${mode} from Flat No:`, 15, 110);
        doc.setFont("helvetica", "bold");
        doc.text(`${flatNo}`, 100, 110);
        
        // Amount
        doc.setFont("helvetica", "normal");
        doc.text("Amount:", 15, 120);
        doc.setFont("helvetica", "bold");
        doc.text(`${amount}/-`, 40, 120);
        
        // Transaction Date
        doc.setFont("helvetica", "normal");
        doc.text("Transaction Date:", 15, 130);
        doc.setFont("helvetica", "bold");
        doc.text(`${new Date(transactionDate).toLocaleString("en-IN")}`, 60, 130);
        
        // For the month
        doc.setFont("helvetica", "normal");
        doc.text("For the month of", 15, 140);
        doc.setFont("helvetica", "bold");
        doc.text(`${months}`, 50, 140);
        
        // On account of purpose Charges of Society
        doc.setFont("helvetica", "normal");
        doc.text(`On account of ${purpose} Charges of Society`, 15, 150);
    
        // Dashed lines
        doc.setLineWidth(0.1);
        doc.setDrawColor(0);
        doc.setLineDashPattern([1, 1], 0);
        doc.line(15, 155, 90, 155); // Draw dashed line
        
        // Treasurer's Signature
        const signatureData = '/static/images/treasurersign.jpg';
        doc.addImage(signatureData, 'PNG', 95, 160, 40, 20);
        
        // Treasurer
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Treasurer", 105, 195, null, null, "center");
    
        // Dashed lines
        doc.setLineWidth(0.1);
        doc.setDrawColor(0);
        doc.setLineDashPattern([1, 1], 0);
        doc.line(15, 200, 90, 200); // Draw dashed line
    
        doc.save(`${flatNo} for ${purpose} ${months}`)
    };

    return (
        <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1 overflow-auto'>
            <h2 className="text-3xl font-semibold mb-8">Your Payment History</h2>
            <div className='mt-3 overflow-auto'>
                <table className='w-full text-gray-700 text-center border border-gray-300'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <th className="border border-gray-300">ID</th>
                            <th className="border border-gray-300">Type</th>
                            <th className="border border-gray-300">Amount</th>
                            <th className="border border-gray-300">Month</th>
                            <th className="border border-gray-300">Date</th>
                            <th className="border border-gray-300">Receipt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction.map((ele, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300">{ele._id}</td>
                                <td className="border border-gray-300">{ele.purpose}</td>
                                <td className="border border-gray-300">{ele.amount}</td>
                                <td className="border border-gray-300">{ele.months.join(", ")}</td>
                                <td className="border border-gray-300">{formatDate(ele.date)}</td>
                                <td className="border border-gray-300"><button className="bg-green-500 hover:bg-green-700 text-white font-bold m-1 px-4 py-1 rounded" onClick={() => jsPdfGenerator(ele._id, ele.createdAt, user.flatnumber, ele.amount, ele.date, ele.months.join(", "), ele.purpose, ele.mode, ele.transactionId)}>Download Now</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
