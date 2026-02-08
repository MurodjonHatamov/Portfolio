import React from 'react'

function TechBadges({ items = [] }) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, 4).map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#1985A1]/10 text-[#1985A1] border border-[#1985A1]/15"
          >
            {t}
          </span>
        ))}
        {items.length > 4 && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-black/5 dark:bg-white/10 text-[#4C5C68] dark:text-white/70">
            +{items.length - 4}
          </span>
        )}
      </div>
    );
  }

export default TechBadges