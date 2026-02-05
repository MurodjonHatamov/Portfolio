import React from "react";
import { NavLink } from "react-router-dom";
import {
  BiHomeAlt2,
  BiUser,
  BiCodeAlt,
  BiBriefcase,
  BiMessageSquareDetail,
} from "react-icons/bi";
import { TbCertificate } from "react-icons/tb";

function Sidebar() {

  const navItems = [
    { to: "/", icon: BiHomeAlt2, label: "Home" },
    { to: "/experience", icon: BiUser, label: "Experience" },
    {to: "/achievements", icon: TbCertificate, label: "Achievements"},
    { to: "/blog", icon: BiCodeAlt, label: "Blog" },
    { to: "/projects", icon: BiBriefcase, label: "Projects" },
    { to: "/contact", icon: BiMessageSquareDetail, label: "Contact" },
  ];

  return (
    <nav className="fixed z-50 w-full lg:w-auto lg:h-screen flex items-center justify-center lg:hidden bottom-6 lg:bottom-0 pointer-events-none ">
      <div
        className="
          pointer-events-auto
          flex lg:flex-col items-center gap-1 sm:gap-2
          p-2 lg:py-8 lg:px-4
          bg-white/80 dark:bg-[#2d2e32]/80 backdrop-blur-xl
          border border-white/20 dark:border-white/5
          rounded-full shadow-2xl shadow-black/10
          transition-all duration-500 ease-in-out
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                group relative flex items-center justify-center
                rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                cursor-pointer h-12 px-3
                ${
                  isActive
                    ? "bg-[#1985A1] text-white"
                    : "bg-transparent text-[#4C5C68] dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-white/5"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`text-xl transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span
                    className={`
                      overflow-hidden whitespace-nowrap text-sm font-semibold
                      transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                      lg:hidden
                      ${isActive ? "max-w-[100px] opacity-100 ml-2" : "max-w-0 opacity-0"}
                    `}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default Sidebar;
