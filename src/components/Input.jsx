import React from 'react'

function Input({ label, ...props }) {
    return (
      <label className="block">
        <span className="block text-xs font-bold text-[#4C5C68] dark:text-white/60 mb-2">{label}</span>
        <input
          {...props}
          className="
            w-full px-4 py-3 rounded-2xl
            bg-white/70 dark:bg-white/5
            border border-black/10 dark:border-white/10
            text-[#46494C] dark:text-[#DCDCDD]
            outline-none
            focus:border-[#1985A1]/50
          "
        />
      </label>
    );
  }
  

export default Input