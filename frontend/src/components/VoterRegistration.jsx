import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BarLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

export default function VoterRegistration() {
  const [flatnumber, setFlatNumber] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOTP] = useState("");
  const [isOTPMode, setIsOTPMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle OTP Request
  const requestOTP = () => {
    if (!flatnumber || !email  || !mobile || !name) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please enter your flat number, email and mobile.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsLoading(true);
    axios.post(
      "/api/v1/election/voter-reg-otp",
      { flatnumber, name, email, mobile }
    )
    .then((response) => {
      Swal.fire({
        title: "OTP Sent",
        text: "A one-time password has been sent to your email.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setIsOTPMode(true);
      setIsLoading(false);
    })
    .catch((error) => {
      Swal.fire({
        title: "Error Sending OTP",
        text: error.response?.data?.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setIsLoading(false);
    });
  };

  // Handle Voter Registration
  const handleRegister = () => {
    if (!flatnumber || !name || !email || !mobile || !otp) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please fill all the fields and enter the OTP.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsLoading(true);
    axios.post(
      "/api/v1/election/voter-reg",
      { flatnumber, name, email, mobile, otp },
      { withCredentials: true }
    )
    .then((response) => {
      Swal.fire({
        title: "Registration Successful",
        text: "You have successfully registered as a voter.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        location.reload()
      });
      setIsLoading(false);
    })
    .catch((error) => {
      Swal.fire({
        title: "Error in Registration",
        text: error.response?.data?.message || "Invalid OTP. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setIsLoading(false);
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 bg-cover bg-center" style={{ backgroundImage: "url('/static/images/PC2.jpg')" }}>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
      <h3 className="text-center text-3xl font-bold text-blue-600 mb-2">🗳️ Pearl Crest Society Elections 2025</h3>
      <p className="text-center text-gray-500 mb-8">"Your Vote, Your Voice – Make it Count!"</p>
        <h2 className="text-2xl font-bold mb-4 text-center">Voter Registration</h2>
        {!isOTPMode ? (
          <>
            <input
              type="text"
              placeholder="Flat Number (Like A104, CG4, B203)"
              value={flatnumber}
              onChange={(e) => setFlatNumber(e.target.value)}
              className="mb-4 p-3 w-full border rounded"
            />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 p-3 w-full border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 p-3 w-full border rounded"
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="mb-4 p-3 w-full border rounded"
            />
            <button
              onClick={requestOTP}
              className="bg-blue-600 text-white p-3 rounded w-full"
              disabled={isLoading}
            >
              {isLoading ? <BarLoader color="#fff" width="100%" /> : "Request OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="mb-4 p-3 w-full border rounded"
            />
            <button
              onClick={handleRegister}
              className="bg-green-600 text-white p-3 rounded w-full"
              disabled={isLoading}
            >
              {isLoading ? <BarLoader color="#fff" width="100%" /> : "Register"}
            </button>
          </>
        )}
        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
        <div className="mt-4 text-center">
            <Link to="/votelog" className="text-blue-600 hover:underline">Already Registered? Login Here</Link>
        </div>
      </div>
    </div>
  );
}
