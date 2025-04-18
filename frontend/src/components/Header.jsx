import React, { Fragment, useState, useEffect } from 'react';
import { Popover, Transition, Menu } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { sidebar_det } from "../navi";
import { admin_navi } from "../admin_navi";
import { guard_det } from "../guard_det";
import { exe_det } from "../exe_det";
import { IoMdMenu } from 'react-icons/io';
import { HiOutlineLogout } from "react-icons/hi";
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { MdAccountCircle } from 'react-icons/md';

const linkClasses = 'flex items-center gap-4 font-medium p-3 hover:bg-white/10 rounded-lg transition-all duration-300 ease-in-out text-neutral-100 hover:text-white';

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const dayOfWeek = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  const time = currentTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' });
  const date = currentTime.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' });

  const handleLogout = () => {
    axios.get("/api/v1/users/logout-user", {
      withCredentials: true
    })
      .then(response => {
        console.log("Logout success:", response.data);
        localStorage.removeItem("user");
        navigate("/");
      })
      .catch(error => {
        console.error("Logout error:", error.message);
      });
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false);
  };

  let sidebarData = "";

  if (user?.flatnumber === "PCS") {
    sidebarData = admin_navi;
  } else if (user?.position === "executive") {
    sidebarData = exe_det;
  } else if (user?.flatnumber === "GUARD") {
    sidebarData = guard_det;
  } else {
    sidebarData = sidebar_det;
  }

  return (
    <div className='sticky top-0 z-40 bg-white/80 backdrop-blur-md h-16 px-4 flex w-full py-2 items-center border-b border-gray-200 shadow-sm'>
      <div className='flex items-center'>
        <Popover className="navbar">
          {({ open }) => (
            <>
              <Popover.Button
                onClick={() => setIsNavbarOpen(!isNavbarOpen)}
                className="p-1.5 inline-flex items-center text-gray-700 hover:text-gray-900 focus:outline-none active:bg-gray-200 rounded-lg"
              >
                <IoMdMenu fontSize={32} className='text-3xl visible md:hidden hover:opacity-70 cursor-pointer text-black' />
              </Popover.Button>
              <Transition
                show={isNavbarOpen}
                as={Fragment}
                enter="transition duration-200 ease-out"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute left-0 z-10 mt-2.5 w-full opacity-100 bg-black/95 h-screen overflow-y-auto">
                  <div className='whitespace-pre flex-1 py-[1rem] text-[0.9rem] flex flex-col gap-0.5'>
                    {sidebarData.map(ele => (
                      <Sidebarlink key={ele.key} ele={ele} closeNavbar={closeNavbar} />
                    ))}
                    <div className={classNames('text-red-400 mt-[2rem] cursor-pointer border-t border-neutral-700', linkClasses)} onClick={handleLogout}>
                      <span className="text-xl">
                        <HiOutlineLogout />
                      </span>
                      Logout
                    </div>
                    <div className={classNames('text-red-400 cursor-pointer border-t border-neutral-700', linkClasses)} onClick={closeNavbar}>
                      <span className="text-xl">
                        <HiOutlineLogout />
                      </span>
                      Collapse
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <div className='flex h-full m-auto rounded-sm text-gray-700 font-semibold ml-2'>
          Welcome, {user?.flatnumber}
        </div>
      </div>
      <div className='ml-auto flex items-center gap-4 mr-2'>
        <div className="text-gray-700">
          <div className="font-semibold">{dayOfWeek}, {date}</div>
          <div className="text-sm">{time}</div>
        </div>
        <Menu as="div" className="relative">
          <div className='inline-flex'>
            <Menu.Button className="ml-2 inline-flex rounded-full focus:outline-none">
              <span className='sr-only'>Open user menu</span>
              <div className="h-10 w-10 rounded-full bg-full bg-center">
                <MdAccountCircle className="h-full w-full text-gray-700 hover:text-gray-900" />
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-lg shadow-md p-1 bg-white/95 backdrop-blur-md ring-1 ring-black/5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link to="/db/profile">
                    <button className={classNames(
                      active && 'bg-gray-100',
                      "text-gray-700 focus:bg-gray-200 cursor-pointer rounded-lg px-4 w-full py-2"
                    )}>
                      Your Profile
                    </button>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button className={classNames(
                    active && 'bg-gray-100',
                    "text-gray-700 focus:bg-gray-200 cursor-pointer rounded-lg px-4 w-full py-2"
                  )} onClick={handleLogout}>
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}

function Sidebarlink({ ele, closeNavbar }) {
  const { pathname } = useLocation();
  return (
    <Link to={ele.path} className={classNames(pathname === ele.path ? 'text-white' : 'text-neutral-400', linkClasses)} onClick={closeNavbar}>
      <ele.icon size={23} className="min-w-max" />
      {ele.label}
    </Link>
  );
}