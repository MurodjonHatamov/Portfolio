import React from 'react'

function RowSkeleton({ rows = 5, cols = 4 }) {
    return (
      <>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="border-t border-black/5 dark:border-white/10">
            {Array.from({ length: cols }).map((__, j) => (
              <td key={j} className="py-3 px-3">
                <div className="h-3 rounded-full bg-black/10 dark:bg-white/10 animate-pulse" />
              </td>
            ))}
          </tr>
        ))}
      </>
    );
  }
export default RowSkeleton