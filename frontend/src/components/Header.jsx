import React, { Fragment, useState, useEffect } from 'react';
import { HiOutlineChatAlt, HiOutlineSearch, HiOutlineBell } from 'react-icons/hi';
import { Popover, Transition, Menu } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { sidebar_det } from "../navi";
import { IoMdMenu } from 'react-icons/io';
import { HiOutlineLogout } from "react-icons/hi";
import { useLocation, Link } from 'react-router-dom';
const linkclasses = 'flex items-center gap-6 font-light p-2.5 hover:bg-neutral-700 hover:no-underline active:bg-neutral rounded-sm text-base';

export default function Header() {
  const navigate = useNavigate();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  useEffect(() => {
    const handlePageChange = () => {
      setIsNavbarOpen(false); // Close the navbar popover on page change
    };

    window.addEventListener('beforeunload', handlePageChange);
    return () => window.removeEventListener('beforeunload', handlePageChange);
  }, []);

  const closeNavbar = () => {
    setIsNavbarOpen(false);
  };

  return (
    <div className='sticky top-0 z-40 bg-white h-16 px-4 flex w-full py-2 items-center border-b border-gray-200'>
      <div className='flex'>
        <Popover className="navbar">
          {({ open }) => (
            <>
              <Popover.Button
                onClick={() => setIsNavbarOpen(!isNavbarOpen)}
                className="p-1.5 inline-flex items-center text-gray-700  hover:text-capacity-100 focus:outline-none active:bg-gray-200"
              >
                <IoMdMenu fontsize={32} className='text-3xl visible md:hidden hover:opacity-70 cursor-pointer text-black m-2' />
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
                <Popover.Panel className="absolute left-0 z-10 mt-2.5 w-full opacity-100 bg-black">
                  <div className='whitespace-pre flex-1 py-[1rem] text-[0.9rem] flex flex-col gap-0.5'>
                    {sidebar_det.map(ele => (
                      <Sidebarlink key={ele.key} ele={ele} closeNavbar={closeNavbar} />
                    ))}
                    <div className={classNames('text-red-500 mt-[2rem] cursor-pointer border-t border-neutral-700', linkclasses)} onClick={closeNavbar}>
                      <span className="text-xl">
                        <HiOutlineLogout />
                      </span>
                      Logout
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <div className='flex h-full m-auto border border-gray-300 rounded-sm'>
          <div className='p-2 m-auto'>
          <HiOutlineSearch fontsize={32} className='my-auto text-gray-400' />
          </div>
          <input
            type="text"
            placeholder='Search...'
            className='text-sm px-2 py-2 m-auto focus:outline-none active:outline-none h-full w-[24rem] ' />
        </div>
      </div>
      <div className='pl-6 flex ml-auto items-center gap-2 mr-2'>
        <Popover className="">
          {({ open }) => (
            <>
              <Popover.Button
                className=
                "p-1.5 inline-flex items-center text-gray-700  hover:text-capacity-100 focus:outline-none active:bg-gray-200"
              >
                <HiOutlineChatAlt size={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition duration-200 ease-out"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 w-80">
                  <div className='bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5'>
                    <strong className='text-gray-700 font-medium'>Messages</strong>
                    <div className='mt-2 py-1 text-sm '>
                      this is the panel
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Popover className="">
          {({ open }) => (
            <>
              <Popover.Button
                className=
                "p-1.5 inline-flex items-center text-gray-700  hover:text-capacity-100 focus:outline-none active:bg-gray-200"
              >
                <HiOutlineBell size={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition duration-200 ease-out"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-10 mt-2.5 w-80">
                  <div className='bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5'>
                    <strong className='text-gray-700 font-medium'>Notifications</strong>
                    <div className='mt-2 py-1 text-sm '>
                      this is the panel
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Menu as="div" className="relative">
          <div className='inline-flex'>
            <Menu.Button className="ml-2 inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
              <span className='sr-only'>Open user menu</span>
              <div className="h-10 w-10 rounded-full bg-[url('public/static/images/treasurer.jpg')] bg-cover bg-no-repeat bg-center" style={{ backgroundImage: '' }}>
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
            <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button className={classNames(
                    active && 'bg-gray-100',
                    "text-gray-700 focus:bg-gray-200 cursor-pointer rounded-sm px-4 w-full py-2"
                  )}
                    onClick={() => navigate('/db/profile')}>
                    Your Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button className={classNames(
                    active && 'bg-gray-100',
                    "text-gray-700 focus:bg-gray-200 cursor-pointer rounded-sm px-4 w-full py-2")}
                    onClick={() => navigate('/profile')}>
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}
function Sidebarlink({ ele, closeNavbar }) {
  const { pathname } = useLocation();
  return (
    <Link to={ele.path} className={classNames(pathname === ele.path ? 'text-white' : 'text-neutral-400', linkclasses)} onClick={closeNavbar}>
      <ele.icon size={23} className="min-w-max" />
      {ele.label}
    </Link>
  );
}
