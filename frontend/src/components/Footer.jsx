import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Footer() {
  const [flatNumber, setFlatNumber] = useState("");
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true); 

    // Basic validation
    if (!flatNumber || !name || !review) {
      // Display validation errors next to each input field
      if (!flatNumber) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Flat Number is required",
        });
      } else if (!name) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Name is required",
        });
      } else if (!review) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Review is required",
        });
      }
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("/api/v1/review/add-review", {
        flatnumber: flatNumber,
        name,
        review,
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Review submitted successfully!",
        });

        setFlatNumber("");
        setName("");
        setReview("");
      }
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred while submitting the review.",
      });
    } finally {
      setSubmitting(false); 
    }
  };

  return (
    <div className="grid bg-black p-16 text-gray-400 md:grid-cols-3">
      <div className="text-center leading-10">
        <p>All Rights Reserved</p>
        <p>Copyright @2023</p>
        <a href="https://thepearlcrestsociety.in/">
          thepearlcrestsociety.in
        </a>
      </div>
      <div>
        <ul className="text-center leading-10">
          <li>
            <button
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              Contact Us
            </button>
          </li>
          <li></li>
          <li>
            <button
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              Login
            </button>
          </li>
          <li>
            <button
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              Features
            </button>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-3 text-center">
        <p>Your Review down here</p>
        <input
          type="text"
          placeholder="Flat Number"
          className="rounded-md border px-4 py-2 text-center"
          autoComplete="Flatnumber"
          value={flatNumber}
          onChange={(e) => setFlatNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          className="rounded-md border px-4 py-2 text-center"
          autoComplete="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your review"
          className="h-20 rounded-md border px-4 py-2 text-center"
          autoComplete=""
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={submitting} 
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

export default Footer;
