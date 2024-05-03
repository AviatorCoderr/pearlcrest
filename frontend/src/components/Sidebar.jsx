import React from "react";
import { sidebar_det } from "../navi";
import { admin_navi } from "../admin_navi";
import { guard_det } from "../guard_det";
import { exe_det } from "../exe_det";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { HiOutlineLogout } from "react-icons/hi";
import { motion } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";

const linkclasses = 'flex items-center gap-6 font-light p-2.5 hover:bg-neutral-700 hover:no-underline active:bg-neutral rounded-sm text-base';

function Sidebar() {
    const user = JSON.parse(localStorage.getItem("user"))
    const Sidebar_animation = {
        open: {
            width: "15rem",
            transition: {
                damping: 40,
            },
        },
        closed: {
            width: "4rem",
            transition: {
                damping: 40,
            },
        },
    };
    const [isOpen, setIsOpen] = useState(true);

    let sidebarData = "";

    if (user.flatnumber === "PCS") {
        sidebarData = admin_navi;
    } else if (user.position === "executive") {
        sidebarData = exe_det;
    } else if (user.flatnumber === "ABC") {
        sidebarData = guard_det;
    }
    else
    sidebarData = sidebar_det
    return (
        <aside>
            <motion.div
                variants={Sidebar_animation}
                animate={isOpen ? "open" : "closed"}
                className='relative left-0 top-0 flex h-screen flex-col overflow-y-scroll overflow-x-hidden lg:overflow-y-scroll z-50 bg-neutral-900 p-3 text-white'
                style={{ scrollbarWidth: "none" }}
            >
                <div className='flex gap-2 px-1 py-3'>
                    <img className="" src="/static/images/favicon-32x32.png" alt="" />
                    <span className='px-2 text-lg text-neutral-100'>PEARL CREST</span>
                </div>
                <div className='whitespace-pre flex-1 py-[1rem] text-[0.9rem] flex flex-col gap-0.5'>
                    {sidebarData.map(ele => (
                        <Sidebarlink key={ele.key} ele={ele}/>
                    ))}
                    <div className={classNames('text-red-500 mt-[2rem] cursor-pointer border-t border-neutral-700', linkclasses)}>
                        <span className="text-xl">
                            <HiOutlineLogout />
                        </span>
                        Logout
                    </div>
                    <div onClick={() => setIsOpen(!isOpen)} className={classNames('text-red-500 cursor-pointer border-t border-neutral-700', linkclasses)}>
                        <span className="text-xl">
                            <IoIosArrowBack />
                        </span>
                        Collapse 
                    </div>
                </div>
            </motion.div>
        </aside> 
    );
}

function Sidebarlink({ele}){
    const {pathname} = useLocation();
    return (
        <Link to={ele.path} className={classNames(pathname === ele.path ? 'text-white' : 'text-neutral-400', linkclasses)}>
            <ele.icon size={23} className="min-w-max" />
            {ele.label}
        </Link>
    );
}

export default Sidebar;
