import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
export default function Layout(){
    return (
        <div className="bg-neutral-100">
      <div className="flex h-screen overflow-hidden">
        <Sidebar className=""/>
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header />
          <main>
            <div className="mx-auto p-4 md:p-6 2xl:p-10">
              {<Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
    )
}