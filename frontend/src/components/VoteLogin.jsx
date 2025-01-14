import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BarLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

export default function Login() {
  const [flatnumber, setFlatNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    setIsLoading(true);
    axios.post(
      "/api/v1/election/voter-login",
      { flatnumber, email, otp },
      { withCredentials: true }
    )
    .then((response) => {
      console.log("Login success:");
      Swal.fire({
        title: "Login Successful",
        text: "You have successfully logged in. Redirecting...",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/vote-dash"); // Redirect to the dashboard or desired page
      });
      setIsLoading(false);
    })
    .catch((error) => {
      Swal.fire({
        title: "Invalid Credentials",
        text: "Check otp",
        icon: "error",
        confirmButtonText: "OK",
      });
      setIsLoading(false);
    });
  };

  const getOtp = () => {
    setIsLoading(true);
    axios.post(
      "/api/v1/election/voter-otp",
      { flatnumber, email },
    )
    .then((response) => {
      console.log("OTP sent:");
      Swal.fire({
        title: "OTP Sent",
        text: "A one-time password has been sent to your email.",
        icon: "success",
        confirmButtonText: "OK",
      });
      setIsLoading(false);
    })
    .catch((error) => {
      console.log(error.message);
      Swal.fire({
        title: "Invalid Credentials",
        text: "Email not in the registered voter's list",
        icon: "error",
        confirmButtonText: "OK",
      });
      setIsLoading(false);
    });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/static/images/election-bg.jpg')" }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Form Container */}
      <div className="relative bg-white rounded-lg shadow-lg p-10 max-w-md w-full">
        <h3 className="text-center text-3xl font-bold text-blue-600 mb-2">🗳️ Pearl Crest Society Elections 2025</h3>
        <p className="text-center text-gray-500 mb-8">"Your Vote, Your Voice – Make it Count!"</p>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Flat Number (A104 / CG4 / D1)"
            className="w-full p-3 rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none"
            onChange={(e) => setFlatNumber(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="w-full bg-red-500 text-white py-3 rounded-md font-semibold hover:bg-red-600 transition-all"
            onClick={getOtp}
          >
            Get OTP on mail
          </button>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="OTP"
              className="w-full p-3 rounded-md border border-gray-300 focus:border-blue-600 focus:outline-none"
              onChange={(e) => setOTP(e.target.value)}
            />
            <button
              className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            className="w-full bg-red-500 text-white py-3 rounded-md font-semibold hover:bg-red-600 transition-all"
            onClick={handleContinue}
          >
            {isLoading ? <BarLoader color="#fff" /> : "Log In"}
          </button>
        </div>
        <p className="text-center text-gray-400 text-sm mt-8">Need help? Contact your election officer!</p>
      </div>
    </div>
  );
}
