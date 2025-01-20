import React, { useEffect, useState } from "react";
import axios from "axios";

const VoteReceipt = () => {
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await axios.get("/api/v1/ele/vote-receipt");
        setReceipt(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching receipt");
      }
    };
    fetchReceipt();
  }, []);

  if (error) {
    return <div className="text-center text-xl text-red-500 mt-8">{error}</div>;
  }

  if (!receipt) {
    return <div className="text-center text-xl text-gray-600 mt-8">Loading your receipt...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-12">
      <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">Pearl Crest Society Elections 2025</h1>
      
      <div className="border-b-2 pb-6 mb-6">
        <div className="flex justify-between text-lg text-gray-800">
          <p><strong>Verification Token:</strong> {receipt.verificationToken}</p>
          <p><strong>Timestamp:</strong> {receipt.timestamp}</p>
        </div>
      </div>

      <div className="mt-8 text-center text-green-500 font-semibold">
        <p>Thank you for voting! Your vote has been successfully submitted and verified. </p>
        <p>Kindly note your verification token for future purpose.</p>
      </div>
    </div>
  );
};

export default VoteReceipt;
