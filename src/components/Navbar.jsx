import React, { useEffect, useState } from "react";
import { FaRegSun } from "react-icons/fa";
import { MdOutlineDarkMode } from "react-icons/md";
import { NavLink } from "react-router-dom";

function Navbar({profile}) {

  
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const dark = theme === "dark";

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50
        bg-white/55 dark:bg-[#0b0f13]/35
        backdrop-blur-[3px]
     
   
      "
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-18 md:h-20">
        {/* Logo */}
        <div
          className="text-xl md:text-3xl font-semibold tracking-wide
                     text-[#46494C] dark:text-[#DCDCDD]"
        >
          &lt;{profile?.full_name}/&gt;
          
        </div>

        {/* Menu */}
        <ul
          className="md:flex items-center gap-10 text-sm font-medium
                     text-[#46494C] dark:text-[#DCDCDD]"
        >
          {[
            { name: "Home", to: "/" },
            { name: "Projects", to: "/projects" },
            { name: "Experience", to: "/experience" },
            { name: "Blog", to: "/blog" },
            { name: "Contact", to: "/contact" },
          ].map((item) => (
            <li key={item.name} className="relative group max-lg:hidden">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `relative text-[18px] transition-colors duration-300
                   ${isActive ? "text-[#1985A1]" : "hover:text-[#1985A1]"}`
                }
              >
                {item.name}

                {/* underline */}
                <span
                  className={`
                    absolute left-0 -bottom-1 h-[2px] bg-[#1985A1]
                    transition-all duration-300
                    w-0 group-hover:w-full
                  `}
                />
              </NavLink>
            </li>
          ))}

          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(dark ? "light" : "dark")}
            className="
              ml-4 cursor-pointer
              bg-white/45 dark:bg-white/10
              border border-black/10 dark:border-white/10
              p-2 rounded-xl
              backdrop-blur
              hover:scale-105 transition
              active:scale-90
            "
            aria-label="Toggle theme"
          >
            {dark ? (
              <FaRegSun className="text-[22px] text-[#1985A1]" />
            ) : (
              <MdOutlineDarkMode className="text-[22px] text-[#46494C] dark:text-[#DCDCDD]" />
            )}
          </button>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
