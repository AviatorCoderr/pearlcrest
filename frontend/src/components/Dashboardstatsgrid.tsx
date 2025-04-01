import React, { useEffect, useState } from 'react';
import { FaCashRegister, FaWallet, FaPiggyBank, FaChartLine } from "react-icons/fa";
import axios from "axios";
import { RingLoader } from "react-spinners";

export default function Dashboardstatsgrid() {
  const [income, setIncome] = useState([0, 0]);
  const [exp, setExp] = useState([0, 0]);
  const [loadingIncome, setLoadingIncome] = useState(true);
  const [loadingExp, setLoadingExp] = useState(true);

  useEffect(() => {
    const getIncome = async () => {
      try {
        const response = await axios.get("/api/v1/account/get-total-income");
        setIncome(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingIncome(false);
      }
    };

    const getExp = async () => {
      try {
        const response = await axios.get("/api/v1/account/get-total-exp");
        setExp(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingExp(false);
      }
    };

    getIncome();
    getExp();
  }, []);

  const incomeoverexp = income[0] + income[1] - exp[0] - exp[1];
  localStorage.setItem("incomeoverexp", incomeoverexp.toString());

  return (
    <div className='flex flex-col md:flex-row gap-4 w-full h-full'>
      {/* Total Income Card */}
      <BoxWrapper loading={loadingIncome} color="green">
        {loadingIncome ? (
          <RingLoader className="m-auto" color="#10B981" size={50} />
        ) : (
          <>
            <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-100'>
              <FaChartLine className='text-2xl text-green-600'/>
            </div>
            <div className='pl-4'>
              <span className='text-sm text-gray-500 font-medium'>Total Income</span>
              <div className='flex items-center'>
                <strong className='text-2xl text-gray-800 font-bold'>${parseFloat(income[0] + income[1]).toFixed(2)}</strong>
                <span className='text-xs text-green-500 ml-2 bg-green-50 px-2 py-1 rounded-full'>+{(income[0] + income[1]) > 0 ? '100%' : '0%'}</span>
              </div>
              <p className='text-xs text-gray-400 mt-1'>All income sources</p>
            </div>
          </>
        )}
      </BoxWrapper>

      {/* Total Expenditure Card */}
      <BoxWrapper loading={loadingExp} color="red">
        {loadingExp ? (
          <RingLoader className="m-auto" color="#EF4444" size={50} />
        ) : (
          <>
            <div className='rounded-full h-12 w-12 flex items-center justify-center bg-red-100'>
              <FaCashRegister className='text-2xl text-red-600'/>
            </div>
            <div className='pl-4'>
              <span className='text-sm text-gray-500 font-medium'>Total Expenses</span>
              <div className='flex items-center'>
                <strong className='text-2xl text-gray-800 font-bold'>${parseFloat(exp[0] + exp[1]).toFixed(2)}</strong>
                <span className='text-xs text-red-500 ml-2 bg-red-50 px-2 py-1 rounded-full'>-{(exp[0] + exp[1]) > 0 ? '100%' : '0%'}</span>
              </div>
              <p className='text-xs text-gray-400 mt-1'>All expenses</p>
            </div>
          </>
        )}
      </BoxWrapper>

      {/* Cash Balance Card */}
      <BoxWrapper loading={loadingIncome || loadingExp} color="blue">
        {(loadingIncome || loadingExp) ? (
          <RingLoader className="m-auto" color="#3B82F6" size={50} />
        ) : (
          <>
            <div className='rounded-full h-12 w-12 flex items-center justify-center bg-blue-100'>
              <FaWallet className='text-2xl text-blue-600'/>
            </div>
            <div className='pl-4'>
              <span className='text-sm text-gray-500 font-medium'>Cash Balance</span>
              <div className='flex items-center'>
                <strong className='text-2xl text-gray-800 font-bold'>${(income[0] - exp[0]).toFixed(2)}</strong>
                <span className={`text-xs ml-2 px-2 py-1 rounded-full ${
                  (income[0] - exp[0]) >= 0 
                    ? 'text-green-500 bg-green-50' 
                    : 'text-red-500 bg-red-50'
                }`}>
                  {(income[0] - exp[0]) >= 0 ? '+' : ''}{((income[0] - exp[0]) / income[0] * 100).toFixed(0)}%
                </span>
              </div>
              <p className='text-xs text-gray-400 mt-1'>Physical cash available</p>
            </div>
          </>
        )}
      </BoxWrapper>

      {/* Bank Balance Card */}
      <BoxWrapper loading={loadingIncome || loadingExp} color="purple">
        {(loadingIncome || loadingExp) ? (
          <RingLoader className="m-auto" color="#8B5CF6" size={50} />
        ) : (
          <>
            <div className='rounded-full h-12 w-12 flex items-center justify-center bg-purple-100'>
              <FaPiggyBank className='text-2xl text-purple-600'/>
            </div>
            <div className='pl-4'>
              <span className='text-sm text-gray-500 font-medium'>Bank Balance</span>
              <div className='flex items-center'>
                <strong className='text-2xl text-gray-800 font-bold'>${(income[1] - exp[1]).toFixed(2)}</strong>
                <span className={`text-xs ml-2 px-2 py-1 rounded-full ${
                  (income[1] - exp[1]) >= 0 
                    ? 'text-green-500 bg-green-50' 
                    : 'text-red-500 bg-red-50'
                }`}>
                  {(income[1] - exp[1]) >= 0 ? '+' : ''}{((income[1] - exp[1]) / income[1] * 100).toFixed(0)}%
                </span>
              </div>
              <p className='text-xs text-gray-400 mt-1'>Available in accounts</p>
            </div>
          </>
        )}
      </BoxWrapper>
    </div>
  );
}

function BoxWrapper({ children, loading, color = "gray" }) {
  const colorClasses = {
    green: 'border-l-green-500',
    red: 'border-l-red-500',
    blue: 'border-l-blue-500',
    purple: 'border-l-purple-500',
    gray: 'border-l-gray-500'
  };
  
  return (
    <div className={`bg-white rounded-lg p-4 flex-1 border border-gray-200 flex items-center shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden ${colorClasses[color]}`}
         style={{ borderLeftWidth: '4px' }}>
      <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 rounded-full opacity-10 bg-gray-300"></div>
      {children}
    </div>
  );
}