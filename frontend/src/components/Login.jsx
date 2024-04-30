import { useNavigate } from "react-router-dom";
import axios from "axios"
import { useState } from "react";
import Swal from "sweetalert2";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();    
  const handleLogin = () => {
    console.log(username, password)
    axios.get("/api/v1/users/login", {
      flatnumber: username,
      password: password
    },
    {
      withCredentials: true
    })
    .then(response => {
      console.log(response)
      console.log("Login success:", JSON.stringify(response.data.data.flat)); 
      localStorage.setItem("user", JSON.stringify(response.data.data.flat))               
      navigate("/db")
    })
    .catch(error => {
      Swal.fire({
        title: "Invalid Credentials",
        text: "Check your flatnumber or password",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Login error:", error);
    });
  }

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row items-stretch">
      <div className="relative w-full md:w-1/2 flex-shrink-0 hidden md:block">
        <img
          src="/static/images/PC2.jpg"
          className="w-full h-full object-cover"
          alt="Background"
        />
      </div>
      <div className="w-full md:w-1/2 bg-white flex flex-col p-6 md:p-20 justify-between">
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
            <input
              type="password"
              placeholder="Password"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="w-full flex items-center">
              <input type="checkbox" className="w-4 h-4 mr-2" />
              <p className="text-sm">Remember Me</p>
            </div>
            <p className="text-sm cursor-pointer underline underline-offset-2 font-medium whitespace-nowrap">
              Forgot Password
            </p>
          </div>

          <div className="w-full flex flex-col my-4">
            <button 
              className="bg-black text-white w-full rounded-md p-4 text-center flex items-center justify-center my-2 hover:bg-black/90"
              onClick={handleLogin}>
              Log In
            </button>
            <button className="font-semibold bg-white text-black w-full rounded-md p-4 text-center flex items-center justify-center my-2 border-2 border-black">
              Sign Up
            </button>
          </div>
        </div>
        <div className="w-full items-center justify-center flex">
          <p className="text-sm font-normal text-black">
            Dont have an account?
            <span className="font-semibold underline underline-offset cursor-pointer">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
