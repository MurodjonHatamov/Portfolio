import React from 'react'

function Card({ children, className = "" }) {
    return (
      <div
        className={`
          rounded-3xl p-4
          bg-white/70 dark:bg-white/5
          border border-black/10 dark:border-white/10
          backdrop-blur-xl
          ${className}
        `}
      >
        {children}
      </div>
    );
  }

export default Card