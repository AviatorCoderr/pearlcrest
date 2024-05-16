import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import axios from 'axios';
import Swal from 'sweetalert2'
export default function Layout() {
    const navigate = useNavigate()
    useEffect(() => {
        axios.get("/api/v1/users/get-current-user")
        .catch(error => {
          Swal.fire({
            icon: 'warning',
            title: 'You have been logged out'
          })
          localStorage.removeItem("user")
          navigate("/log")
        })
      }, [])
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        function handleResize() {
            setIsSmallScreen(window.innerWidth < 768);
        }
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="bg-neutral-100">
            <div className="flex h-screen overflow-hidden">
                {!isSmallScreen && <Sidebar />} 
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    <Header />
                    <main>
                        <div className="mx-auto p-4 md:p-6 2xl:p-10">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
