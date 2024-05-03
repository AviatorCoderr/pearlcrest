import React, { useState, useEffect } from 'react'
import axios from 'axios';
export default function RecentTransaction() {
  const [transaction, setTransaction] = useState([])
  useEffect(() => {
    const getTrans = async() => {
        try {
            const response = await axios.get("/api/v1/account/get-trans-5", {withCredentials: true})
            setTransaction(response.data.data)
        } catch (error) {
            console.log(error.message)
        }
    }
    getTrans()
    console.log(transaction)
  }, []);   
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};
  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
        <strong>Recent Transactions</strong>
        <div className='mt-3'>
        <table className='w-full text-gray-700 text-center'>
            <thead className='bg-gray-100'>
                <tr>
                    <td>ID</td>
                    <td>Type</td>
                    <td>Amount</td>
                    <td>Month</td>
                    <td>Date</td>
                </tr>
            </thead>
            <tbody className='border-t border-gray-400'>
                {transaction?.map((ele, index) => (
                    <tr key={index}>
                        <td>{ele._id}</td>
                        <td>{ele.purpose}</td>
                        <td>{ele.amount}</td>
                        <td>{ele.months.join(", ")}</td>
                        <td>{formatDate(ele.createdAt)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    </div>
  )
}
