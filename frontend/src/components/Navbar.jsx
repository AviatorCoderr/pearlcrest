import React from "react";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <div className="flex z-20 my-2">
      <div className="p-2 ml-10 text-3xl flex">
        <p className="m-2 py-2 invisible md:visible flex">
          <img className="px-2" src="/static/images/favicon-32x32.png" alt="" />
          PEARL CREST
        </p>
      </div>
      <div className="ml-auto">
        <ul className="flex">
          <li className="p-3 text-lg mx-5 group">
            <button className="relative overflow-hidden py-2 px-4">
              Home
              <span className="absolute inset-x-0 bottom-0 w-1/2 h-1 group-hover:w-full bg-black"></span>
            </button>
          </li>
          <li className="p-3 text-lg mx-5 group">
            <button className="relative overflow-hidden py-2 px-4">
              Gallery
              <span className="absolute hover:visible inset-x-0 bottom-0 w-1/2 group-hover:w-full h-1 bg-black"></span>
            </button>
          </li>
          <li className="p-3 text-lg mx-5 group">
            <button className="relative overflow-hidden py-2 px-4">
              Council
              <span className="absolute hover:visible inset-x-0 bottom-0 w-1/2 group-hover:w-full h-1 bg-black"></span>
            </button>
          </li>
          <li className="p-3 text-lg px-10 mx-5 hover:bg-black hover:text-white border-black border-2 m-2 rounded-l-3xl rounded-r-3xl">
            <Link to="/log">
              <button>Login</button>
            </Link>
          </li>
          <li className="p-3 text-lg hover:opacity-90 text-white bg-black px-10 mx-5 mr-8 m-2 border-black border-2 rounded-l-3xl rounded-r-3xl">
            <button>Sign Up</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
