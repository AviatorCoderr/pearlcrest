// src/components/SubmitComplaint.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const categories = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'sewerage', label: 'Sewerage' },
  { value: 'parking', label: 'Parking' },
  { value: 'security', label: 'Security' },
  { value: 'lift', label: 'Lift' },
  { value: 'technical', label: 'Technical/Website Related' }
];

const statusColors = {
  'pending': 'bg-yellow-100 text-yellow-700',
  'in progress': 'bg-blue-100 text-blue-700',
  'resolved': 'bg-green-100 text-green-700',
};

const SubmitComplaint = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/complain/user-complaints');
      setComplaints(response.data.data);
      setError(null);
    } catch (error) {
      showError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = validateForm();
    if (!valid) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to submit this complaint?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post('/api/v1/complain/complaints', { category, description });
        setMessage('Complaint submitted successfully');
        setComplaints([...complaints, response.data.data]);
        setCategory('');
        setDescription('');
        Swal.fire(
          'Submitted!',
          'Your complaint has been submitted.',
          'success'
        );
      } catch (error) {
        showError('Failed to submit complaint');
      }
    }
  };

  const validateForm = () => {
    if (!category) {
      showError('Please select a category');
      return false;
    }
    if (!description.trim()) {
      showError('Please enter a description');
      return false;
    }
    return true;
  };

  const showError = (errorMessage) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: errorMessage,
    });
  };

  const handleRatingHover = (complaintId, value) => {
    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) =>
        complaint._id === complaintId ? { ...complaint, tempRating: value } : complaint
      )
    );
  };

  const handleRatingClick = async (complaintId, value) => {
    try {
      await axios.patch(`/api/v1/complain/complaints/${complaintId}/rate`, { rating: value });
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaintId ? { ...complaint, rating: value, tempRating: 0 } : complaint
        )
      );
      Swal.fire('Thank you!', 'Your rating has been submitted.', 'success');
    } catch (error) {
      showError('Failed to submit rating');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4 items-center">
          <div className="w-1/2">
            <label className="block text-lg font-semibold text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label className="block text-lg font-semibold text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4 text-green-500">{message}</p>}
      <h2 className="text-2xl font-bold mt-10 mb-6 text-gray-800">Your Complaints</h2>
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && complaints.length === 0 && <p className="text-gray-500">No complaints found</p>}
      {!loading && complaints.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.map((complaint) => (
                <tr key={complaint._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.description}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium rounded ${statusColors[complaint.status]}`}>{complaint.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {complaint.status.toLowerCase() === 'resolved' ? (
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-6 w-6 cursor-pointer ${index < (complaint.rating || complaint.tempRating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                            viewBox="0 0 20 20"
                            fill={index < (complaint.rating || complaint.tempRating || 0) ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            onMouseOver={() => handleRatingHover(complaint._id, index + 1)}
                            onMouseOut={() => handleRatingHover(complaint._id, 0)}
                            onClick={() => handleRatingClick(complaint._id, index + 1)}
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10 1l2.39 4.853h5.13l-4.15 3.447 1.56 5.05L10 12.207 5.07 14.35l1.56-5.05-4.15-3.447h5.13L10 1z"
                            />
                          </svg>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
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

export default SubmitComplaint;
