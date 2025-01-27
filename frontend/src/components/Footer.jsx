import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

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
    <div className="bg-black text-gray-400 py-12 px-8 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Copyright Section */}
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold mb-2">All Rights Reserved</p>
          <p className="text-sm">Copyright © 2023</p>
          <a
            href="https://thepearlcrestsociety.in/"
            className="text-blue-500 hover:text-blue-400 transition-colors duration-300"
          >
            thepearlcrestsociety.in
          </a>
        </div>

        {/* Quick Links Section */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/features"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/votereg"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                Voter Register
              </Link>
            </li>
            <li>
              <Link
                to="/votelog"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                Voter Login
              </Link>
            </li>
            <li>
              <Link
                to="/votelogoff"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                CEO Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Review Form Section */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Your Review</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Flat Number"
              className="w-full rounded-md border border-gray-600 bg-black px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              value={flatNumber}
              onChange={(e) => setFlatNumber(e.target.value)}
              disabled={submitting}
            />
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-md border border-gray-600 bg-black px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
            <textarea
              placeholder="Enter your review"
              className="w-full rounded-md border border-gray-600 bg-black px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              rows="3"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={submitting}
            />
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 transition-colors duration-300"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Footer;