import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
export default function ForgotPass() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [flatNumber, setFlatNumber] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [otp, setOtp] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };

    const getOtp = async() => {
        await axios.post("/api/v1/users/send-otp", {
            flatnumber: flatNumber,
            oldpassword: oldPassword
        })
        .then(response => {
            console.log(response)
            Swal.fire({
                title: 'OTP SENT',
                text: 'OTP sent to owner mailId. It is valid for 5 minutes only.',
                icon: 'success',
                showConfirmButton: true
            })
        })
        .catch(error => {
            Swal.fire({
                title: 'Something went wrong',
                text: error.message,
                icon: 'error',
                showConfirmButton: true
            })
        })
    }

    const changepass = async() => {
        if(confirmNewPassword!==newPassword){
            Swal.fire({
                title: 'Passwords not match',
                text: 'reconfirm password',
                icon: 'error',
                showConfirmButton: true
            })
            return 
        }
        await axios.post("api/v1/users/change-password", {
            flatnumber: flatNumber,
            newpassword: newPassword,
            otp
        })
        .then(response => {
            const status = response.data.status
            const message = response.data.message
            let icon
            if(status==="Pending") icon="Warning"
            else if(status==="Verified") icon="Success"
            console.log(status)
            console.log(message)
            Swal.fire({
                title: status.toString(),
                text: message.toString(),
                icon: icon,
                showConfirmButton: true
            })
            setTimeout(() => {
                setConfirmNewPassword('')
                setFlatNumber('')
                setNewPassword('')
                setOldPassword('')
                setOtp('')
                setShowPassword('')
                setShowPassword2('')
                window.location.reload()
            }, 1500)
        })
        .catch(error =>{
            Swal.fire({
                title: 'Something went wrong',
                text: error.message,
                icon: 'error',
                showConfirmButton: true
            })
        })
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
                        <h3 className="text-3xl font-semibold mb-4">Change Password</h3>
                        <p className="text-base mb-2">Enter your new password.</p>
                    </div>
                    <input
                        type="text"
                        placeholder="Flat Number"
                        value={flatNumber}
                        onChange={(e) => setFlatNumber(e.target.value)}
                        className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                        />
                        <button
                            className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? "Hide" : "Show"} Password
                        </button>
                    </div>
                    <div className="w-full flex flex-col my-4">
                        <button
                            className="bg-black text-white w-full rounded-md p-4 text-center flex items-center justify-center my-2 hover:bg-black/90"
                            onClick={getOtp}
                        >
                            Get OTP
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword2 ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                        />
                        <button
                            className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
                            onClick={togglePasswordVisibility2}
                        >
                            {showPassword2 ? "Hide" : "Show"} Password
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword2 ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                        />
                        <button
                            className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
                            onClick={togglePasswordVisibility2}
                        >
                            {showPassword2 ? "Hide" : "Show"} Password
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            placeholder="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                        />
                    </div>
                    <div className="w-full flex flex-col my-4">
                        <button
                            className="bg-black text-white w-full rounded-md p-4 text-center flex items-center justify-center my-2 hover:bg-black/90"
                            onClick={changepass}
                        >
                            Change Password
                        </button>
                    </div>
                    <div className="w-full flex items-center justify-between">
                        <Link to="/log">
                            <p className="text-sm cursor-pointer underline underline-offset-2 font-medium whitespace-nowrap">
                                Back To Login
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
