import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
export default function Layout(){
    return (
        <div className="relative flex flex-col bg-neutral-100 h-full min-w-fit">
            <div className='relative'>
                <Sidebar className=""/>
            </div>
            <div className="">
                <div className='w-full'>
                    <Header className=""/>
                </div>
                <div className='w-full'>
                    {<Outlet className=""/>}
                </div>
            </div>
        </div>
    )
}