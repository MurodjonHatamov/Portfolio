import React from 'react'

function Sk({ className = "" }) {
  return (
    <div className={`bg-black/10 dark:bg-white/10 animate-pulse ${className}`} />
  )
}

export default Sk