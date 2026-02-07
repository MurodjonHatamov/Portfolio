import React from 'react'
function StatCard({ title, value, icon }) {
    return (
      <div
        className="
          rounded-3xl p-4
          bg-white/70 dark:bg-white/5
          border border-black/10 dark:border-white/10
          backdrop-blur-xl
        "
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#4C5C68] dark:text-white/60">{title}</p>
          <div className="text-[#1985A1]">{icon}</div>
        </div>
        <p className="mt-2 text-2xl font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
          {value}
        </p>
      </div>
    );
  }
export default StatCard