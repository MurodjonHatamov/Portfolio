import React, { useEffect, useMemo, useState } from "react";
import { FaRegSun } from "react-icons/fa";
import { MdOutlineDarkMode } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import Sk from "./Sk";
import CustomSelect from "./CustomSelect";
import { useLang } from "../context/LanguageContext";

function Navbar({ profile }) {
  // ===== THEME =====
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

  // ✅ LANGUAGE (Context'dan olamiz)
  const { lang, setLang, t } = useLang();

  const menu = useMemo(
    () => [
      { to: "/", label: t("nav_home") },
      { to: "/projects", label: t("nav_projects") },
      { to: "/experience", label: t("nav_experience") },
      { to: "/achievements", label: t("nav_achievements") },
      { to: "/blog", label: t("nav_blog") },
      { to: "/contact", label: t("nav_contact") },
    ],
    [t]
  );

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
        {profile ? (
          <Link
            to={"/"}
            className="text-xl md:text-3xl font-semibold tracking-wide
                     text-[#46494C] dark:text-[#DCDCDD]"
          >
            &lt;{profile?.full_name}/&gt;
          </Link>
        ) : (
          <Sk className="w-40 h-6" />
        )}

        {/* Menu */}
        <ul
          className="md:flex items-center gap-10 text-sm font-medium
                     text-[#46494C] dark:text-[#DCDCDD]"
        >
          {menu.map((item) => (
            <li key={item.to} className="relative group max-lg:hidden">
              <NavLink
                to={item.to}
                aria-label={item.label}
                title={item.label}
                className={({ isActive }) =>
                  `relative text-[18px] transition-colors duration-300
                   ${isActive ? "text-[#1985A1]" : "hover:text-[#1985A1]"}`
                }
              >
                {item.label}
                <span
                  className="
                    absolute left-0 -bottom-1 h-[2px] bg-[#1985A1]
                    transition-all duration-300
                    w-0 group-hover:w-full
                  "
                />
              </NavLink>
            </li>
          ))}

          {/* Language + DarkMode */}
          <div className="ml-2 flex items-center">
            <CustomSelect
              value={lang}
              onChange={setLang}   // ✅ reload yo'q
              options={[
                { value: "uz", label: "UZ" },
                { value: "en", label: "EN" },
                { value: "ru", label: "RU" },
              ]}
              widthClass="w-24"
            />

            <button
              onClick={() => setTheme(dark ? "light" : "dark")}
              className="
                ml-3 cursor-pointer
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
          </div>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
