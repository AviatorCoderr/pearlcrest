import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
export default function Layout(){
    return (
        <div className="flex bg-neutral-100 flex-row h-full min-w-fit">
            <Sidebar  className=""/>
            <div className="flex-1">
                <Header className=""/>
                <div>{<Outlet />}</div>
            </div>
        </div>
    )
}