import React from "react";
import { Link } from "react-router-dom";
export default function Login() {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row items-stretch">
      <div className="relative w-full md:w-1/2 flex-shrink-0 hidden md:block shadow-2xl">
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
              type="email"
              placeholder="Email"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
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
            <Link to="/db">
            <button className="bg-black text-white w-full rounded-md p-4 text-center flex items-center justify-center my-2 hover:bg-black/90">
              Log In
            </button>
            </Link>
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
