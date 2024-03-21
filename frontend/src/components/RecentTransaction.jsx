import React from 'react'
const recenttransdata = [
    {
    id: '1',
    type: 'Maintainence',
    amount: 1700,
    month: 'march 23',
    date: '28-02-2024',
    receipt: 'click'
    },
    {
        id: '1',
        type: 'Maintainence',
        amount: 1700,
        month: 'march 23',
        date: '28-02-2024',
        receipt: 'click'
    },
    {
        id: '1',
        type: 'Maintainence',
        amount: 1700,
        month: 'march 23',
        date: '28-02-2024',
        receipt: 'click'
    },
    {
        id: '1',
        type: 'Maintainence',
        amount: 1700,
        month: 'march 23',
        date: '28-02-2024',
        receipt: 'click'
    }
]
export default function RecentTransaction() {
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
                    <td>Receipt</td>
                </tr>
            </thead>
            <tbody className='border-t border-gray-400'>
                {recenttransdata.map((ele) => (
                    <tr key={ele.id}>
                    <td>{ele.id}</td>
                    <td>{ele.type}</td>
                    <td>{ele.amount}</td>
                    <td>{ele.month}</td>
                    <td>{ele.date}</td>
                    <td>{ele.receipt}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    </div>
  )
}
