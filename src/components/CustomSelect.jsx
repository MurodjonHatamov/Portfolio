import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

/**
 * options: [{ value: "uz", label: "UZ" }, ...]
 */
export default function     CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  className = "",       // wrapper qo'shimcha style
  buttonClassName = "", // button qo'shimcha style
  menuClassName = "",   // dropdown qo'shimcha style
  disabled = false,
  widthClass = "w-28",  // w-28, w-40, w-full...
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = useMemo(() => {
    return options.find((o) => o.value === value) || null;
  }, [options, value]);

  // outside click yopish
  useEffect(() => {
    const onDown = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // ESC yopish
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const choose = (val) => {
    if (disabled) return;
    onChange?.(val);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`
          ${widthClass}
          flex items-center justify-between gap-2
          bg-white/45 dark:bg-white/10
          border border-black/10 dark:border-white/10
          rounded-xl px-3 py-2
          backdrop-blur
          text-[14px] font-semibold
          text-[#46494C] dark:text-[#DCDCDD]
          hover:bg-white/60 dark:hover:bg-white/15
          focus:outline-none focus:ring-2 focus:ring-[#1985A1]/60
          transition
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${buttonClassName}
        `}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">
          {current ? current.label : placeholder}
        </span>

        <FaChevronDown
          size={12}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <div
          className={`
            absolute right-0 mt-2 ${widthClass}
            rounded-2xl overflow-hidden
            border border-black/10 dark:border-white/10
            bg-white/95 dark:bg-[#141414]/95
            backdrop-blur
            shadow-2xl
            z-50
            ${menuClassName}
          `}
          role="listbox"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => choose(opt.value)}
                className={`
                  w-full flex items-center justify-between
                  px-4 py-2 text-sm font-semibold
                  transition
                  ${
                    active
                      ? "bg-[#1985A1] text-white"
                      : "text-[#46494C] dark:text-[#DCDCDD] hover:bg-black/5 dark:hover:bg-white/10"
                  }
                `}
                role="option"
                aria-selected={active}
              >
                <span className="truncate">{opt.label}</span>
                {active && <FaCheck size={12} className="opacity-95" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
