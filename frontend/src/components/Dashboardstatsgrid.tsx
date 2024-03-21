import React from 'react'
import { FaCashRegister } from "react-icons/fa";
export default function Dashboardstatsgrid() {
  return (
    <div className='flex gap-4 w-full h-full'>
        <BoxWrapper>
          <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-500'>
            <FaCashRegister className='text-2xl text-white'/>
          </div>
          <div className='pl-4'>
            <span className='text-sm text-black font-bold'>Total Income</span>
            <div className='flex items-center'>
              <strong className='text-xl text-green-500 font-semibold'>34525</strong>
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
              <strong className='text-xl text-red-400 font-semibold'>34525</strong>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-black'>
            <FaCashRegister className='text-2xl text-white'/>
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Total Expenditure</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>34525</strong>
              <span className='text-sm text-green-500 pl-2'>+234</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-black'>
            <FaCashRegister className='text-2xl text-white'/>
          </div>
          <div className='pl-4'>
            <span className='text-sm text-gray-500 font-light'>Total Income</span>
            <div className='flex items-center'>
              <strong className='text-xl text-gray-700 font-semibold'>34525</strong>
              <span className='text-sm text-green-500 pl-2'>+234</span>
            </div>
          </div>
        </BoxWrapper>
    </div>
  )
}

function BoxWrapper({children}){
  return <div className='bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center'>{children}</div>
}