import React, { useEffect, useState } from 'react'
import { FaCashRegister } from "react-icons/fa";
import axios from "axios"
export default function Dashboardstatsgrid() {
  const [income, setIncome] = useState("")
  const [exp, setExp] = useState("")
  useEffect(() => {
    const getIncome = async() => {
      try {
        const response = await axios.get("/api/v1/account/get-total-income")
        setIncome(response.data.data.totalIncome)
      } catch (error) {
        console.log(error)
      }
    }
    const getExp = async() => {
      try {
        const response = await axios.get("/api/v1/account/get-total-exp")
        setExp(response.data.data.totalExpenditure)
      } catch (error) {
        console.log(error)
      }
    }
    getIncome()
    getExp()
    console.log(income)
    console.log(exp)
  }, [])
  return (
    <div className='flex gap-4 w-full h-full'>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-500'>
            <FaCashRegister className='text-2xl text-white'/>
          </div>
          <div className='pl-4'>
            <span className='text-sm text-black font-bold'>Total Income</span>
            <div className='flex items-center'>
              <strong className='text-xl text-green-500 font-semibold'>{income}</strong>
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
              <strong className='text-xl text-red-400 font-semibold'>{exp}</strong>
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
              <strong className='text-xl text-gray-700 font-semibold'></strong>
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
              <strong className='text-xl text-gray-700 font-semibold'></strong>
            </div>
          </div>
        </BoxWrapper>
    </div>
  )
}

function BoxWrapper({children}){
  return <div className='bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center'>{children}</div>
}