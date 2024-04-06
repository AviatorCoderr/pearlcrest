import React from 'react';
import { jsPDF } from "jspdf";

const recenttransdata = [
    {
        id: '1',
        type: 'Maintenance',
        amount: 1700,
        month: 'March 23',
        date: '28-02-2024',
        receipt: 'click'
    },
    // Other transaction objects
]

export default function PaymentHistory() {
    const jsPdfGenerator = (receiptNo, date, flatNo, amount, transactionDate, months) => {
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
        doc.text("On account of Monthly Maintenance Charges of Society", 15, 145);
    
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
    
        doc.save("sample.pdf");
    }
    return (
        <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
            <strong>Recent Transactions</strong>
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
                        {recenttransdata.map((ele, index) => (
                            <tr key={index}>
                                <td>{ele.id}</td>
                                <td>{ele.type}</td>
                                <td>{ele.amount}</td>
                                <td>{ele.month}</td>
                                <td>{ele.date}</td>
                                <td><button onClick={() => jsPdfGenerator(ele.id, new Date(), "A104", ele.amount, ele.date, ele.month)}>Receipt</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
