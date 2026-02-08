import React from 'react'
function Textarea({ label, ...props }) {
    return (
      <label className="block">
        <span className="block text-xs font-bold text-[#4C5C68] dark:text-white/60 mb-2">{label}</span>
        <textarea
          {...props}
          className="
            w-full px-4 py-3 rounded-2xl min-h-[120px]
            bg-white/70 dark:bg-white/5
            border border-black/10 dark:border-white/10
            text-[#46494C] dark:text-[#DCDCDD]
            outline-none resize-y
            focus:border-[#1985A1]/50
          "
        />
      </label>
    );
  }
  
export default Textarea