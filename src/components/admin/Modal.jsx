import React from 'react'
import { FiX } from 'react-icons/fi';


function Modal({ open, title, onClose, children, footer }) {
    if (!open) return null;
    return (
      <>
        <div className="fixed inset-0 bg-black/40 z-40 " onClick={onClose}  />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-11/12 overflow-y-auto rounded-3xl bg-white dark:bg-[#141414] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 dark:border-white/10">
              <div>
                <h3 className="text-lg font-extrabold text-[#46494C] dark:text-[#DCDCDD]">{title}</h3>
                <p className="text-xs text-[#4C5C68] dark:text-white/60 mt-1">0-3 ta rasm, description 3 tilda</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition active:scale-95"
                aria-label="Close"
              >
                <FiX className="text-xl text-[#4C5C68] dark:text-white/70" />
              </button>
            </div>
  
            <div className="p-5">{children}</div>
  
            <div className="px-5 py-4 border-t border-black/10 dark:border-white/10 flex items-center justify-end gap-2">
              {footer}
            </div>
          </div>
        </div>
      </>
    );
  }

export default Modal