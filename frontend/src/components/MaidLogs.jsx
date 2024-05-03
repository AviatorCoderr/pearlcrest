import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MaidLog() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
    console.log(user._id)
    const [maid, setmaid] = useState([]);
    useEffect(() => {
        const getMaid = async () => {
            try {
                const response = await axios.post("/api/v1/maid/getmaidbyflat", {_id: user._id},{ withCredentials: true });
                setmaid(response.data.data.response);
            } catch (error) {
                console.log(error);
            }
        };
        getMaid();
        console.log(maid)
    }, []);
    return (
        <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
            <strong>Maid Log</strong>
            <div className='mt-3'>
                <table className='w-full text-gray-700 text-center'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Check In</th>
                        </tr>
                    </thead>
                    <tbody className='border-t border-gray-400'>
                        {maid.map(ele => (
                            <tr key={ele._id}>
                                <td>{ele.name}</td>
                                <td>{ele.mobile}</td>
                                <td>{ele.checkin}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
