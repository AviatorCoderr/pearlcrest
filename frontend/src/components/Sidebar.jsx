import React from "react";
import { sidebar_det } from "../navi";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { HiOutlineLogout } from "react-icons/hi";
import { motion } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";

const linkclasses = 'flex items-center gap-6 font-light p-2.5 hover:bg-neutral-700 hover:no-underline active:bg-neutral rounded-sm text-base';

function Sidebar() {
    const Sidebar_animation = {
        //System view
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

    return (
        <div>
            <motion.div
                variants={Sidebar_animation}
                animate={isOpen ? "open" : "closed"}
                className=' bg-neutral-900 w-[15rem] p-3 z-[999] h-full overflow-hidden md:relative fixed max-w-[15rem] flex flex-col text-white'
            >
                <div className='flex gap-2 px-1 py-3'>
                    <img className="w-[15%] min-w-max gap-6" src="/static/images/favicon-32x32.png" alt="" />
                    <span className='px-2 text-lg text-neutral-100'>PEARL CREST</span>
                </div>
                <div className='whitespace-pre flex-1 py-[1rem] text-[0.9rem] flex flex-col gap-0.5'>
                    {sidebar_det.map(ele => (
                        <Sidebarlink key={ele.key} ele={ele}/>
                    ))}
                    <div className={classNames('text-red-500 mt-[2rem] cursor-pointer border-t border-neutral-700', linkclasses)}>
                        <span className="text-xl">
                            <HiOutlineLogout />
                        </span>
                        Logout
                    </div>
                </div>
                <motion.div
                    animate={
                        isOpen ? {
                            x:203,
                            y:0,
                            rotate:0,
                        } : {
                            x:27,
                            y:53,
                            rotate:180,
                        }
                    }
                    transition={{
                        duration: 0.5,
                    }}
                    onClick={()=>setIsOpen(!isOpen)}
                    className="absolute text-neutral-100 bg-transparent py-5 hover:opacity-80 w-fit h-fit z-70 cursor-pointer md:block hidden"
                >
                    <IoIosArrowBack size={25} />
                </motion.div>
            </motion.div>
        </div>
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
