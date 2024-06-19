import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

function AdminChallan() {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallans = async () => {
      try {
        const response = await axios.get(`/api/v1/vehicle/challans`);
        setChallans(response.data.data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch challans");
      } finally {
        setLoading(false);
      }
    };

    fetchChallans();
  }, []);

  const handleGeneratePDF = (challan) => {
    const { _id, vehicle, amount, date, flat } = challan;

    const doc = new jsPDF();
    // Add background color
    doc.setFillColor('#f0f0f0'); // Light gray background color
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

    // Add logo
    const logoData = '/static/images/favicon-32x32.png'; // Update this path to your actual logo
    doc.addImage(logoData, 'PNG', 10, 10, 20, 20);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Challan Ticket', 105, 25, null, null, 'center');
    doc.setFontSize(14);
    doc.text("PEARL CREST FLAT OWNERS’ SOCIETY", 105, 35, null, null, 'center');
    doc.setFontSize(12);
    doc.text('ARGORA, PUNDAG ROAD, ARGORA, RANCHI – 834002', 105, 45, null, null, 'center');

    // Challan Details
    doc.setFont('times', 'normal');

    // Draw border around challan details
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(10, 70, 185, 140);

    // Challan ID
    doc.setFont('helvetica', 'normal');
    doc.text('Challan ID:', 15, 80);
    doc.setFont('helvetica', 'bold');
    doc.text(`${_id}`, 50, 80);

    // Vehicle Registration Number
    doc.setFont('helvetica', 'normal');
    doc.text('Vehicle Reg. No:', 15, 90);
    doc.setFont('helvetica', 'bold');
    doc.text(`${vehicle.reg_no}`, 60, 90);

    // Vehicle Type
    doc.setFont('helvetica', 'normal');
    doc.text('Vehicle Type:', 15, 100);
    doc.setFont('helvetica', 'bold');
    doc.text(`${vehicle.type}`, 60, 100);

    // Vehicle Model
    doc.setFont('helvetica', 'normal');
    doc.text('Vehicle Model:', 15, 110);
    doc.setFont('helvetica', 'bold');
    doc.text(`${vehicle.model}`, 65, 110);

    // Amount
    doc.setFont('helvetica', 'normal');
    doc.text('Amount:', 15, 120);
    doc.setFont('helvetica', 'bold');
    doc.text(`${amount}`, 50, 120);

    // Date
    doc.setFont('helvetica', 'normal');
    doc.text('Date:', 15, 130);
    doc.setFont('helvetica', 'bold');
    doc.text(`${new Date(date).toLocaleString('en-IN')}`, 50, 130);

    // Flat Number
    doc.setFont('helvetica', 'normal');
    doc.text('Flat Number:', 15, 140);
    doc.setFont('helvetica', 'bold');
    doc.text(`${flat.flatnumber}`, 60, 140);

    // Signature
    const signatureData = '/static/images/presidentsign.jpg';
    doc.addImage(signatureData, 'PNG', 80, 190, 40, 20);

    // Treasurer
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Mr. Ravindra Prasad, President', 105, 215, null, null, 'center');

    // Dashed lines
    doc.setLineWidth(0.1);
    doc.setDrawColor(0);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(0, 240, 400, 240); // Draw dashed line

    doc.save(`challan_${_id}.pdf`);
  };

  return (
    <div className="container mx-auto mt-10 p-4 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">All Challans</h1>
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && challans.length === 0 && (
        <p className="text-gray-500">No challans found.</p>
      )}
      {!loading && !error && challans.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Challan ID</th>
                <th className="py-2 px-4 border-b border-gray-200">Vehicle Reg. No</th>
                <th className="py-2 px-4 border-b border-gray-200">Vehicle Type</th>
                <th className="py-2 px-4 border-b border-gray-200">Vehicle Model</th>
                <th className="py-2 px-4 border-b border-gray-200">Amount</th>
                <th className="py-2 px-4 border-b border-gray-200">Date</th>
                <th className="py-2 px-4 border-b border-gray-200">Flat Number</th>
                <th className="py-2 px-4 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {challans.map((challan) => (
                <tr key={challan._id}>
                  <td className="py-2 px-4 border-b border-gray-200">{challan._id}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{challan.vehicle.reg_no}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{challan.vehicle.type}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{challan.vehicle.model}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{challan.amount}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{new Date(challan.date).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{challan.flat.flatnumber}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      className="py-1 px-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600"
                      onClick={() => handleGeneratePDF(challan)}
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminChallan;
