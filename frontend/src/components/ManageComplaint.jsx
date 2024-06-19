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
        <ul>
          {complaints.map((complaint, index) => (
            <li key={complaint._id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
              <p><strong>Serial No:</strong> {index+1}</p>
              <p><strong>Category:</strong> {complaint.category}</p>
              <p><strong>Description:</strong> {complaint.description}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
              <p><strong>Flat Number:</strong> {complaint.flatNumber.flatnumber}</p>
              <div className="flex space-x-2 mt-2">
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExecutiveComplaints;
