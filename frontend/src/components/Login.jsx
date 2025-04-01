import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BarLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaStar } from 'react-icons/fa';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const navigate = useNavigate();

  const handleContinue = () => {
    setIsLoading(true);
    axios.post(
      "/api/v1/users/login",
      {
        flatnumber: username,
        password: password,
      },
      {
        withCredentials: true,
      }
    )
    .then((response) => {
      console.log(response);
      localStorage.setItem("user", JSON.stringify(response.data.data.flat));
      setIsLoading(false);
      setShowReviewPopup(true); // Show review popup after successful login
    })
    .catch((error) => {
      Swal.fire({
        title: "Invalid Credentials",
        text: "Check your flatnumber or password",
        icon: "error",
        confirmButtonText: "OK",
      })
      .then(result => {
        if(result.isConfirmed) {
          setIsLoggingIn(false);
          setIsLoading(false);
        }
      });
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    setIsLoggingIn(true);
  };

  const submitReview = async () => {
    if (!review || rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Please complete your review",
        text: "Both a rating and written feedback are required",
      });
      return;
    }

    try {
      const response = await axios.post("/api/v1/review/add-review", {
        flatnumber: username,
        name: "Resident", // You can modify this or get from user data
        review,
        rating
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Thank you!",
          text: "Your feedback helps us improve!",
          timer: 1500
        });
        navigate("/db");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Couldn't submit your review. Please try again later.",
      });
    } finally {
      setShowReviewPopup(false);
    }
  };

  const skipReview = () => {
    setShowReviewPopup(false);
    navigate("/db");
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row items-stretch bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="relative w-full md:w-1/2 flex-shrink-0 hidden md:block">
        <img
          src="/static/images/PC2.jpg"
          className="w-full h-full object-cover"
          alt="Background"
        />
      </div>
      <div className="w-full bg-white p-6 md:p-20 justify-between">
        <h3 className="text-xl text-black font-semibold">Pearl Crest</h3>

        <div className="w-full flex flex-col max-w-[500px]">
          <div className="flex flex-col w-full mb-5">
            <h3 className="text-3xl font-semibold mb-4">Login</h3>
            <p className="text-base mb-2">Enter Your login details.</p>
          </div>
          <div className="w-full flex flex-col">
            <div className="relative flex items-center">
              <FaUser className="absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Flat Number"
                className="w-full text-black pl-10 py-2 my-2 bg-transparent border-b border-gray-300 outline-none focus:outline-none focus:border-purple-500 transition-colors"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative flex items-center">
              <FaLock className="absolute left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full text-black pl-10 py-2 my-2 bg-transparent border-b border-gray-300 outline-none focus:outline-none focus:border-purple-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute right-4 text-gray-400 hover:text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="w-full flex items-center justify-between mt-4">
            <div className="w-full flex items-center">
              <input type="checkbox" className="w-4 h-4 mr-2" />
              <p className="text-sm">Remember Me</p>
            </div>
            <Link to="/forgot-password">
              <p className="text-sm cursor-pointer underline underline-offset-2 font-medium whitespace-nowrap text-purple-600 hover:text-purple-800">
                Forgot Password
              </p>
            </Link>
          </div>

          <div className="w-full flex flex-col my-4">
            <button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white w-full rounded-md p-4 text-center flex items-center justify-center my-2 hover:from-purple-700 hover:to-blue-700 transition-all"
              onClick={handleContinue}
            >
              Log In
            </button>
          </div>
        </div>
      </div>


      {/* Review Popup */}
      {showReviewPopup && (
        <div className="fixed top-0 left-0 w-full h-full overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white m-4 p-8 rounded-lg w-full max-w-md max-h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">We Value Your Feedback!</h2>
            <p className="text-center text-gray-600 mb-6">
              From Mr. Manish, Treasurer !!!
              Your experience helps us improve our services for all residents. 
              Please take a moment to share your thoughts.
            </p>
            
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="What do you like about our services? How can we improve?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={skipReview}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Skip for now
              </button>
              <button
                onClick={submitReview}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}