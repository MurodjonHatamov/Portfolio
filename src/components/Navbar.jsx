import React, { useEffect, useMemo, useState } from "react";
import { FaRegSun } from "react-icons/fa";
import { MdOutlineDarkMode } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import Sk from "./Sk";

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

  // ===== LANGUAGE =====
  const getInitialLang = () => {
    const saved = localStorage.getItem("lang");
    if (saved === "uz" || saved === "en" || saved === "ru") return saved;
    return "uz";
  };

  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    // xohlasang html lang ham qo'yamiz
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    const dict = {
      uz: {
        home: "Bosh sahifa",
        projects: "Loyihalar",
        experience: "Tajriba",
        achievements: "Yutuqlar",
        blog: "Blog",
        contact: "Aloqa",
      },
      en: {
        home: "Home",
        projects: "Projects",
        experience: "Experience",
        achievements: "Achievements",
        blog: "Blog",
        contact: "Contact",
      },
      ru: {
        home: "Главная",
        projects: "Проекты",
        experience: "Опыт",
        achievements: "Достижения",
        blog: "Блог",
        contact: "Контакты",
      },
    };
    return dict[lang];
  }, [lang]);

  const menu = useMemo(
    () => [
      { key: "home", to: "/", label: t.home },
      { key: "projects", to: "/projects", label: t.projects },
      { key: "experience", to: "/experience", label: t.experience },
      { key: "achievements", to: "/achievements", label: t.achievements },
      { key: "blog", to: "/blog", label: t.blog },
      { key: "contact", to: "/contact", label: t.contact },
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
            <li key={item.key} className="relative group max-lg:hidden">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `relative text-[18px] transition-colors duration-300
                   ${isActive ? "text-[#1985A1]" : "hover:text-[#1985A1]"}`
                }
              >
                {item.label}

                {/* underline */}
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

          {/* Language selector */}
          <div className="ml-2 flex items-center">
            <div
              className="
                bg-white/45 dark:bg-white/10
                border border-black/10 dark:border-white/10
                rounded-xl px-2 py-1
                backdrop-blur
              "
            >
              <select
                value={lang}
                onChange={(e) => {
                  const newLang = e.target.value;
                  localStorage.setItem("lang", newLang);
              
                  // sahifani yangilaymiz
                  window.location.reload();
                }}
                className="
                  bg-transparent outline-none
                  text-[14px] font-semibold
                  text-[#46494C] dark:text-[#DCDCDD]
                  cursor-pointer
                "
                aria-label="Select language"
              >
                <option value="uz">UZ</option>
                <option value="en">EN</option>
                <option value="ru">RU</option>
              </select>
            </div>
          </div>

          {/* Dark mode toggle */}
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
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
