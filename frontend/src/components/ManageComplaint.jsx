// components/ExecutiveComplaints.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExecutiveComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('/api/v1/complain/complaints');
        setComplaints(response.data.data);
      } catch (error) {
        setError('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/v1/complain/complaints/${id}`, { status });
      setComplaints((prev) =>
        prev.map((complaint) => (complaint._id === id ? { ...complaint, status } : complaint))
      );
    } catch (error) {
      setError('Failed to update status');
    }
  };

  return (
    <div className="mx-auto mt-10 p-4 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Manage Complaints</h2>
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && complaints.length === 0 && <p className="text-gray-500">No complaints found</p>}
      {!loading && complaints.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flat Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {complaints.map((complaint, index) => (
                <tr key={complaint._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{complaint.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{complaint.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{complaint.flatNumber.flatnumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{complaint.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {['pending', 'in progress', 'resolved'].map((status) => (
                      <button
                        key={status}
                        className={`py-1 px-3 rounded ${complaint.status === status ? 'bg-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        onClick={() => handleStatusChange(complaint._id, status)}
                        disabled={complaint.status === status}
                      >
                        {status}
                      </button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const getStatusColorClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'resolved':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default ExecutiveComplaints;
