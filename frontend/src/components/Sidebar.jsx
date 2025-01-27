import React, { useState } from "react";
import { sidebar_det } from "../navi";
import { admin_navi } from "../admin_navi";
import { guard_det } from "../guard_det";
import { exe_det } from "../exe_det";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { HiOutlineLogout } from "react-icons/hi";
import { motion } from "framer-motion";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";

const linkClasses =
  "flex items-center gap-4 font-medium p-3 hover:bg-white/10 rounded-lg transition-all duration-300 ease-in-out text-neutral-100 hover:text-white";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const sidebarAnimation = {
    open: {
      width: "16rem",
      transition: {
        damping: 30,
      },
    },
    closed: {
      width: "5rem",
      transition: {
        damping: 30,
      },
    },
  };

  let sidebarData = "";

  if (user?.flatnumber === "PCS") {
    sidebarData = admin_navi;
  } else if (user?.position === "executive") {
    sidebarData = exe_det;
  } else if (user?.flatnumber === "GUARD") {
    sidebarData = guard_det;
  } else {
    sidebarData = sidebar_det;
  }

  const handleLogout = () => {
    axios
      .get("/api/v1/users/logout-user", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Logout success:", response.data);
        localStorage.removeItem("user");
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error.message);
      });
  };

  return (
    <aside>
      <motion.div
        variants={sidebarAnimation}
        animate={isOpen ? "open" : "closed"}
        className="relative left-0 top-0 flex h-screen flex-col overflow-y-auto overflow-x-hidden bg-gradient-to-b from-neutral-800 to-neutral-900 p-4 text-white shadow-2xl"
        style={{ backdropFilter: "blur(10px)", scrollbarWidth: "none" }}
      >
        {/* Logo and Title */}
        <div className="flex items-center gap-3 px-2 py-4">
          <img
            src="/static/images/favicon-32x32.png"
            alt="Logo"
            className="h-8 w-8"
          />
          {isOpen && (
            <span className="text-xl font-semibold text-neutral-100">
              PEARL CREST
            </span>
          )}
        </div>

        {/* Sidebar Links */}
        <div className="flex-1 py-4">
          {sidebarData.map((ele) => (
            <SidebarLink key={ele.key} ele={ele} isOpen={isOpen} />
          ))}
        </div>

        {/* Logout and Collapse Buttons */}
        <div className="border-t border-neutral-700 pt-4">
          <div
            onClick={handleLogout}
            className={classNames(
              "flex cursor-pointer items-center gap-4 rounded-lg p-3 text-red-400 hover:bg-white/10 hover:text-red-300",
              linkClasses
            )}
          >
            <HiOutlineLogout size={23} />
            {isOpen && "Logout"}
          </div>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={classNames(
              "mt-2 flex cursor-pointer items-center gap-4 rounded-lg p-3 text-neutral-400 hover:bg-white/10 hover:text-white",
              linkClasses
            )}
          >
            {isOpen ? (
              <>
                <IoIosArrowBack size={23} />
                Collapse
              </>
            ) : (
              <IoIosArrowForward size={23} />
            )}
          </div>
        </div>
      </motion.div>
    </aside>
  );
}

function SidebarLink({ ele, isOpen }) {
  const { pathname } = useLocation();
  return (
    <Link
      to={ele.path}
      className={classNames(
        pathname === ele.path
          ? "bg-white/10 text-white"
          : "text-neutral-400 hover:bg-white/10",
        linkClasses
      )}
    >
      <ele.icon size={23} className="min-w-max" />
      {isOpen && ele.label}
    </Link>
  );
}

export default Sidebar;