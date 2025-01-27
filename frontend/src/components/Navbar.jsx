import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillMenuButtonWideFill } from "react-icons/bs";

function Navbar() {
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <img
              className="h-8 w-8"
              src="/static/images/favicon-32x32.png"
              alt="Pearl Crest Logo"
            />
            <span className="ml-2 text-2xl font-bold text-gray-900">
              PEARL CREST
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate("/")}
              className="text-gray-700 hover:text-black text-lg font-medium relative group"
            >
              Home
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </button>
            <button
              onClick={() => navigate("/results")}
              className="text-gray-700 hover:text-black text-lg font-medium relative group"
            >
              Results
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </button>
            <button
              onClick={() => navigate("/council")}
              className="text-gray-700 hover:text-black text-lg font-medium relative group"
            >
              Council
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </button>
            <Link
              to="/log"
              className="px-6 py-2 bg-black text-white text-lg font-semibold rounded-full hover:bg-gray-800 transition-colors duration-300"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={handleClick}
              className="text-gray-700 hover:text-black focus:outline-none"
            >
              <BsFillMenuButtonWideFill size={28} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  navigate("/");
                  setOpen(false);
                }}
                className="text-gray-700 hover:text-black text-lg font-medium"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate("/results");
                  setOpen(false);
                }}
                className="text-gray-700 hover:text-black text-lg font-medium"
              >
                Results
              </button>
              <button
                onClick={() => {
                  navigate("/council");
                  setOpen(false);
                }}
                className="text-gray-700 hover:text-black text-lg font-medium"
              >
                Council
              </button>
              <Link
                to="/log"
                className="px-6 py-2 bg-black text-white text-lg font-semibold rounded-full hover:bg-gray-800 transition-colors duration-300 text-center"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;