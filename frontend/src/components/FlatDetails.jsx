import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FlatDetails() {
    const [flat_det, setFlat_det] = useState([]);

    useEffect(() => {
        const getFlats = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/v1/users/display-flat");
                setFlat_det(response.data.data.flats);
            } catch (error) {
                console.error("Error fetching flats:", error);
            }
        };
        getFlats();
    }, []);

    return (
        <div className='m-5'>
            <table className='w-full text-gray-700 text-center table-auto shadow-lg bg-white divide-y divide-gray-200 rounded-lg overflow-hidden'>
                <thead className='bg-gray-200 text-gray-800 uppercase'>
                    <tr>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Sl No</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Flat Number</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Current Stay</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Position</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold">Grant Permission</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {flat_det.map((ele, index) => (
                        <tr key={index} className={(index % 2 === 0) ? 'bg-gray-100' : 'bg-white'}>
                            <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ele.flatnumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ele.currentstay}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ele.position}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{/* Grant Permission content */}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
