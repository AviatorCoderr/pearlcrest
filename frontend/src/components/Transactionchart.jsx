import React from 'react'
import {ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar, Legend, Tooltip} from 'recharts'
const data = [
    {
        name: 'Jan',
        expense: 3490,
        income: 4300
    },
    {
        name: 'Feb',
        expense: 3490,
        income: 4300
    },
    {
        name: 'Mar',
        expense: 3490,
        income: 4300
    },
    {
        name: 'April',
        expense: 3490,
        income: 4300
    }
]
export default function Transactionchart() {
  return (
    <div className='h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1'>
        <strong>Maintainence Tracking</strong>
    <div className='w-full mt-3 flex-1 text-xs'>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart width={500}
                    height={300}
                    data={data}
                    margin={{
                        top:10,
                        right:10,
                        left:-10,
                        bottom:0
                    }}>
                    <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#0ea5e9" />
            </BarChart>
        </ResponsiveContainer>
    </div>
    </div>
  )
}
