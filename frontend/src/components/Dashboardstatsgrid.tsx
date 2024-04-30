import React, { useEffect, useState } from 'react'
import { FaCashRegister } from "react-icons/fa";
import axios from "axios"
export default function Dashboardstatsgrid() {
  const [income, setIncome] = useState(0)
  const [exp, setExp] = useState(0)
  useEffect(() => {
    const getIncome = async() => {
      try {
        const response = await axios.get("https://pearlcrest.onrender.com/api/v1/account/get-total-income")
        setIncome(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    const getExp = async() => {
      try {
        const response = await axios.get("https://pearlcrest.onrender.com/api/v1/account/get-total-exp")
        setExp(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    getIncome()
    getExp()
    console.log(income)
    console.log(exp)
  }, [])
  const incomeoverexp = income[0]+income[1]-exp[0]-exp[1]
  localStorage.setItem("incomeoverexp", incomeoverexp.toString())
  return (
    <div className='flex flex-col md:flex-row gap-4 w-full h-full'>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-500'>
            <FaCashRegister className='text-2xl text-white'/>
          </div>
          <div className='pl-4'>
            <span className='text-sm text-black font-bold'>Total Income</span>
            <div className='flex items-center'>
              <strong className='text-xl text-green-500 font-semibold'>{income[0]+income[1]}</strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-red-400'>
            <FaCashRegister className='text-2xl text-white'/>
          </div>
          <div className='pl-4'>
            <span className='text-sm text-black font-bold'>Total Expenditure</span>
            <div className='flex items-center'>
              <strong className='text-xl text-red-400 font-semibold'>{exp[0]+exp[1]}</strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-black'>
            <FaCashRegister className='text-2xl text-white'/>
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Cash Balance</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>{income[0]-exp[0]}</strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-black'>
            <FaCashRegister className='text-2xl text-white'/>
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Bank Balance</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>{income[1]-exp[1]}</strong>
            </div>
          </div>
        </BoxWrapper>
    </div>
  )
}

function BoxWrapper({children}){
  return <div className='bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center'>{children}</div>
}