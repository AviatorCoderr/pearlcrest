import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
function Navbar() {
  const [isOpen, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!isOpen);
  };

  return (
    <div className="md:flex z-20 my-2">
      <div className="p-2 md:ml-10 text-3xl flex">
        <p className="m-2 py-2 md:visible flex">
          <img className="px-2" src="/static/images/favicon-32x32.png" alt="" />
          PEARL CREST
        </p>
        <button onClick={handleClick} className="ml-auto mr-3 md:hidden">
        <BsFillMenuButtonWideFill size={38}/>
        </button>
      </div>
      <div className="hidden md:block ml-auto">
        <ul className="md:flex">
          <li className="p-3 text-lg mx-5 group">
            <button className="relative overflow-hidden py-2 px-4">
              Home
              <span className="absolute hover:visible duration-200 inset-x-0 bottom-0 w-1/3 group-hover:w-full h-1 bg-black"></span>
            </button>
          </li>
          <li className="p-3 text-lg mx-5 group">
            <button className="relative overflow-hidden py-2 px-4">
              Gallery
              <span className="absolute hover:visible duration-200 inset-x-0 bottom-0 w-1/3 group-hover:w-full h-1 bg-black"></span>
            </button>
          </li>
          <li className="p-3 text-lg mx-5 group">
            <button className="relative overflow-hidden py-2 px-4">
              Council
              <span className="absolute hover:visible duration-200 inset-x-0 bottom-0 w-1/3 group-hover:w-full h-1 bg-black"></span>
            </button>
          </li>
          <Link to="/log">
            <li className="p-3 text-lg px-10 mx-5 bg-black hover:opacity-85 text-white border-black border-2 m-2 rounded-l-3xl rounded-r-3xl">
              <button>Login</button>
            </li>
          </Link>
        </ul>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <ul className="md:flex">
            <li className="p-3 text-lg mx-5 group">
              <button className="relative overflow-hidden py-2 px-4 w-full">
                Home
                <span className="absolute hover:visible duration-200 inset-x-0 bottom-0 w-1/6 group-hover:w-full h-1 bg-black"></span>
              </button>
            </li>
            <li className="p-3 text-lg mx-5 group">
              <button className="relative overflow-hidden py-2 px-4 w-full">
                Gallery
                <span className="absolute hover:visible duration-200 inset-x-0 bottom-0 w-1/6 group-hover:w-full h-1 bg-black"></span>
              </button>
            </li>
            <li className="p-3 text-lg mx-5 group">
              <button className="relative overflow-hidden py-2 px-4 w-full">
                Council
                <span className="absolute hover:visible duration-200 inset-x-0 bottom-0 w-1/6 group-hover:w-full h-1 bg-black"></span>
              </button>
            </li>
            <Link to="/log">
              <li className="p-3 text-lg px-10 mx-5 bg-black hover:opacity-85 text-white border-black border-2 m-2 rounded-l-3xl rounded-r-3xl">
                <button>Login</button>
              </li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
