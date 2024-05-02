import React, { useState } from 'react';
import axios from 'axios';

export default function AddVisitor() {
  const [formData, setFormData] = useState({
    flatnumber: '',
    name: '',
    mobile: '',
    numofpeople: '',
    purpose: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/addvisitor', formData);
      console.log(response.data); // Handle success response here
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <strong className="text-xl m-5 font-semibold">Visitor Management</strong>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Flat Number:</label>
          <input type="text" name="flatnumber" value={formData.flatnumber} onChange={handleChange} />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Mobile:</label>
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
        </div>
        <div>
          <label>Number of People:</label>
          <input type="text" name="numofpeople" value={formData.numofpeople} onChange={handleChange} />
        </div>
        <div>
          <label>Purpose:</label>
          <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} />
        </div>
        <button type="submit">Add Visitor</button>
      </form>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
}
