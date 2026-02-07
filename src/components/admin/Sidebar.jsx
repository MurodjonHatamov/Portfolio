import React, { useMemo, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiBriefcase,
  FiFileText,
  FiAward,
  FiMail,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { BiHomeAlt2 } from "react-icons/bi";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: BiHomeAlt2 },
  { to: "/admin/projects", label: "Projects", icon: FiBriefcase },
  { to: "/admin/experience", label: "Experience", icon: FiUser },
  { to: "/admin/blog", label: "Blog", icon: FiFileText },
  { to: "/admin/achievements", label: "Awards", icon: FiAward },
  { to: "/admin/messages", label: "Messages", icon: FiMail },
  {to:"/admin/profile" , label: "Profile", icon: FiUser}
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  // Mobile’da ko’rinadiganlar (2 chap, 2 o’ng) — qolganlari Menu ichiga tushadi
  const visibleRoutes = useMemo(
    () => ["/admin", "/admin/projects", "/admin/messages","/admin/blog" ],
    []
  );

  const visibleItems = navItems.filter((x) => visibleRoutes.includes(x.to));
  const moreItems = navItems.filter((x) => !visibleRoutes.includes(x.to));
  const isMenuActive = moreItems.some((x) => location.pathname === x.to);

  // Capsule icon button (sen bergan dizayn)
  const CapsuleLink = ({ to, label, Icon, onClick }) => {
    const active = location.pathname === to;

    return (
      <NavLink
        to={to}
        onClick={onClick}
        className="group relative flex items-center justify-center p-3 rounded-full transition-all duration-300"
      >
        {/* Glow background */}
        <span
          className={`absolute inset-0 rounded-full transition-all duration-300 opacity-20
            ${active ? "bg-[#1985A1] scale-100" : "scale-0 group-hover:scale-100 group-hover:bg-gray-400"}
          `}
        />

        {/* Icon */}
        <Icon
          className={`relative z-10 text-xl transition-colors duration-300
            ${
              active
                ? "text-[#1985A1]"
                : "text-[#4C5C68] dark:text-gray-400 group-hover:text-[#1985A1]"
            }
          `}
        />

        {/* Tooltip (faqat desktop hover) */}
        <span
          className="
            absolute left-14 px-3 py-1 rounded-md
            bg-[#1985A1] text-white text-xs font-semibold tracking-wide
            opacity-0 -translate-x-3 pointer-events-none
            transition-all duration-300
            md:group-hover:opacity-100 md:group-hover:translate-x-0
            hidden md:block whitespace-nowrap shadow-lg
          "
        >
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1985A1] rotate-45" />
          {label}
        </span>
      </NavLink>
    );
  };

  return (
    <>
      {/* ===== Backdrop (mobile menu) ===== */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ================= Desktop Capsule Sidebar ================= */}
      <nav className="hidden md:flex fixed z-50 left-8 top-0 h-screen items-center">
        <div
          className="
            flex flex-col items-center gap-6
            px-4 py-8
            bg-white/50 dark:bg-black/20 backdrop-blur-md
            border border-white/20 dark:border-white/10
            rounded-full shadow-lg shadow-black/5
          "
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <CapsuleLink
                key={item.to}
                to={item.to}
                label={item.label}
                Icon={Icon}
              />
            );
          })}

          {/* Logout (desktop capsule style) */}
          <button
            onClick={logout}
            className="group relative flex items-center justify-center p-3 rounded-full transition-all duration-300"
            type="button"
          >
            <span className="absolute inset-0 rounded-full transition-all duration-300 opacity-20 scale-0 group-hover:scale-100 group-hover:bg-red-500" />
            <FiLogOut className="relative z-10 text-xl text-[#4C5C68] dark:text-gray-400 group-hover:text-red-500 transition-colors" />

            <span
              className="
                absolute left-14 px-3 py-1 rounded-md
                bg-red-500 text-white text-xs font-semibold tracking-wide
                opacity-0 -translate-x-3 pointer-events-none
                transition-all duration-300
                md:group-hover:opacity-100 md:group-hover:translate-x-0
                hidden md:block whitespace-nowrap shadow-lg
              "
            >
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rotate-45" />
              Logout
            </span>
          </button>
        </div>
      </nav>

      {/* ================= Mobile Capsule Tabbar ================= */}
      <nav className="md:hidden fixed z-50 left-0 right-0 bottom-4 flex justify-center px-4">
        <div
          className="
            flex items-center gap-2 sm:gap-6
            px-6 py-3
            bg-white/50 dark:bg-black/20 backdrop-blur-md
            border border-white/20 dark:border-white/10
            rounded-full shadow-lg shadow-black/5
          "
        >
          {/* Left 2 */}
          {visibleItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            return (
              <CapsuleLink
                key={item.to}
                to={item.to}
                label={item.label}
                Icon={Icon}
                onClick={() => setMenuOpen(false)}
              />
            );
          })}

          {/* Center Menu */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="group relative flex items-center justify-center p-3 rounded-full transition-all duration-300"
            type="button"
            aria-label="Menu"
          >
            <span
              className={`absolute inset-0 rounded-full transition-all duration-300 opacity-20
                ${(menuOpen || isMenuActive)
                  ? "bg-[#1985A1] scale-100"
                  : "scale-0 group-hover:scale-100 group-hover:bg-gray-400"}
              `}
            />
            <FiGrid
              className={`relative z-10 text-xl transition-colors duration-300
                ${(menuOpen || isMenuActive)
                  ? "text-[#1985A1]"
                  : "text-[#4C5C68] dark:text-gray-400 group-hover:text-[#1985A1]"}
              `}
            />
          </button>

          {/* Right 2 */}
          {visibleItems.slice(2, 4).map((item) => {
            const Icon = item.icon;
            return (
              <CapsuleLink
                key={item.to}
                to={item.to}
                label={item.label}
                Icon={Icon}
                onClick={() => setMenuOpen(false)}
              />
            );
          })}
        </div>
      </nav>

      {/* ============ Mobile "More" Sheet (sig’maganlar) ============ */}
      {menuOpen && (
        <div className="fixed left-0 right-0 bottom-0 z-50 md:hidden px-4 pb-6">
          <div
            className="
              rounded-3xl
              bg-white/85 dark:bg-[#1e1e1e]/95
              backdrop-blur-xl
              border border-black/10 dark:border-white/10
              shadow-2xl shadow-black/20
              overflow-hidden
            "
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10">
              <p className="text-sm font-bold text-[#46494C] dark:text-[#DCDCDD]">
                Menu
              </p>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
                type="button"
              >
                <FiX className="text-lg text-[#4C5C68] dark:text-white/70" />
              </button>
            </div>

            <div className="p-3 grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-2xl
                      border border-black/10 dark:border-white/10
                      transition active:scale-[0.98]
                      ${
                        active
                          ? "bg-[#1985A1]/10 border-[#1985A1]/30"
                          : "bg-white/50 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10"
                      }
                    `}
                  >
                    <Icon className={`${active ? "text-[#1985A1]" : "text-[#4C5C68] dark:text-white/70"} text-xl`} />
                    <span className={`${active ? "text-[#1985A1]" : "text-[#46494C] dark:text-[#DCDCDD]"} text-sm font-semibold`}>
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}

              {/* Logout */}
              <button
                onClick={logout}
                className="
                  flex items-center gap-3 px-4 py-3 rounded-2xl
                  border border-red-500/20
                  bg-red-500/10
                  text-red-600 dark:text-red-400
                  font-semibold
                  active:scale-[0.98]
                "
                type="button"
              >
                <FiLogOut className="text-xl" />
                Logout
              </button>
        
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
