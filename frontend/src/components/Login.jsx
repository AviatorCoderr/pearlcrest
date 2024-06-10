import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BarLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/v1/users/get-current-user");
        localStorage.setItem("user", JSON.stringify(response.data.data));
        navigate("/db");
      } catch (error) {
        setIsFetchingUser(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchUser().finally(() => {
        setIsFetchingUser(false); 
      });
    }, 10000); 

    fetchUser().then(() => {
      clearTimeout(timeoutId);
      setIsFetchingUser(false); 
    });
  }, [navigate]);

  const handleLogin = () => {
    setIsLoggingIn(true);
    axios
      .post(
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
        console.log("Login success:", JSON.stringify(response.data.data.flat));
        localStorage.setItem("user", JSON.stringify(response.data.data.flat));
        navigate("/db");
      })
      .catch((error) => {
        Swal.fire({
          title: "Invalid Credentials",
          text: "Check your flatnumber or password",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Login error:", error);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row items-stretch">
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
            <input
              type="text"
              placeholder="Flat Number"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"} Password
              </button>
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="w-full flex items-center">
              <input type="checkbox" className="w-4 h-4 mr-2" />
              <p className="text-sm">Remember Me</p>
            </div>
            <Link to="/forgot-password">
              <p className="text-sm cursor-pointer underline underline-offset-2 font-medium whitespace-nowrap">
                Forgot Password
              </p>
            </Link>
          </div>

          <div className="w-full flex flex-col my-4">
            <button
              className="bg-black text-white w-full rounded-md p-4 text-center flex items-center justify-center my-2 hover:bg-black/90"
              onClick={handleLogin}
            >
              Log In
            </button>
          </div>
        </div>
      </div>

      {(isLoggingIn || isFetchingUser) && (
        <div className="fixed top-0 left-0 w-full h-full overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white m-4 p-6 rounded-lg w-full max-w-md md:max-w-4xl max-h-full overflow-y-auto">
            <BarLoader className="m-auto my-5" color="#4a90e2" size={100} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:flex justify-center items-center">
                <img
                  loading="lazy"
                  className="w-1/2 rounded-full md:rounded-none md:w-3/4 shadow-2xl m-auto shadow-black border-2 border-black"
                  src='/static/images/manish_jpg.jpg'
                  alt="img"
                />
              </div>
              <div className="text-left">
                <h1 className="text-lg bg-gray-100 text-gray-800 font-bold p-3">Know Your Treasurer</h1>
                <p className="mt-6 leading-8 text-gray-700">
                  Meet <strong>Manish</strong>, a <strong>Senior Programmer in the Finance Department at Central Coalfields Limited, Ranchi</strong>. An academic <strong>topper in Master of Computer Applications</strong>, Manish excels in MS Excel and Programming, enhancing financial processes with his technical expertise. As a <strong>blackbelt in karate</strong>, he embodies discipline and dedication.
                </p>
                <p className="mt-6 leading-8 text-gray-700">
                  Serving as the <strong>Treasurer of the Pearl Crest Society</strong>, Manish is committed to maintaining integrity and transparency, enforcing a <strong>strict no-corruption policy</strong>. His blend of technical proficiency and ethical standards drives the society towards innovation and accountability.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
