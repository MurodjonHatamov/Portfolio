import React, { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt, FaTimes, FaLayerGroup, FaCalendarAlt, FaImage } from "react-icons/fa";

function ModalProject({ selectedProject, setSelectedProject, FALLBACK_IMG }) {
  
  // Hozirgi tanlangan katta rasm uchun state
  const [activeImage, setActiveImage] = useState("");

  // Modal ochilganda yoki loyiha o'zgarganda birinchi rasmni tanlash
  useEffect(() => {
    if (selectedProject?.photos && selectedProject.photos.length > 0) {
      setActiveImage(selectedProject.photos[0]);
    } else {
      setActiveImage(FALLBACK_IMG);
    }
  }, [selectedProject, FALLBACK_IMG]);

  if (!selectedProject) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.3s_ease-in-out] "
      onClick={() => setSelectedProject(null)}
    >
      <div
        className="bg-white dark:bg-[#1e1e1e] w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-[85vh] md:h-[80vh] max-h-[800px]   overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
        data-aos="zoom-in"
      >
        
        {/* Close Button (Sticky & Visible) */}
        <button
          onClick={() => setSelectedProject(null)}
          className="absolute top-4 right-4 z-30 p-2 bg-black/60 hover:bg-[#1985A1] text-white rounded-full transition-all duration-300 backdrop-blur-sm shadow-lg"
        >
          <FaTimes size={20} />
        </button>

        {/* --- LEFT SIDE: IMAGE GALLERY --- */}
        <div className="w-full md:w-[55%] bg-black/5 dark:bg-black flex flex-col relative">
          
          {/* Main Active Image Area */}
          <div className="flex-1 relative w-full overflow-hidden bg-gray-100 dark:bg-[#121212]">
  <div className="relative w-full aspect-video">
    <img
      key={activeImage}
      src={activeImage}
      alt={selectedProject?.project_name}
      className="absolute inset-0 w-full h-full object-contain animate-[fadeIn_0.35s_ease-out]"
    />
  </div>
</div>


          {/* Thumbnails (Kichik rasmlar) */}
          {selectedProject.photos && selectedProject.photos.length > 1 && (
            <div className="p-4 bg-white dark:bg-[#252525] border-t border-gray-200 dark:border-gray-800">
               <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide flex items-center gap-1">
                 <FaImage/> Gallery ({selectedProject.photos.length})
               </p>
               <div className="flex gap-3 overflow-x-auto p-1 custom-scrollbar">
                {selectedProject.photos.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`
                      relative w-20 h-14 md:w-24 md:h-16 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all duration-300  
                      ${activeImage === img 
                        ? "ring-2 ring-[#1985A1] opacity-100 scale-105" 
                        : "opacity-60 hover:opacity-100 hover:scale-105 hover:ring-1 hover:ring-gray-900"}
                    `}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE: DETAILS --- */}
        <div className=" w-full md:w-[45%] flex flex-col h-full bg-white dark:bg-[#1e1e1e]">
          
          {/* Scrollable Content */}
          <div className="flex-1  p-6 md:p-8">
            
            {/* Header: Date & Category (agar bo'lsa) */}
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#1985A1]/10 text-[#1985A1]">
                <FaCalendarAlt className="mr-2"/> 
                {new Date(selectedProject.deployed_date).toLocaleDateString("uz-UZ")}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white mb-4 leading-tight">
              {selectedProject?.project_name}
            </h2>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {selectedProject?.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="mt-8">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                 <FaLayerGroup className="text-[#1985A1]" /> Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies?.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-[#2d2d2d] text-gray-700 dark:text-gray-200 text-sm rounded-md border border-gray-200 dark:border-gray-600 hover:border-[#1985A1] transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer: Action Buttons (Fixed at bottom) */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a]">
            <div className="flex gap-4">
              <a
                href={selectedProject?.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5
                  ${selectedProject?.project_url 
                    ? "bg-[#1985A1] text-white hover:bg-[#156f85] shadow-[#1985A1]/20" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                `}
              >
                Live Demo <FaExternalLinkAlt size={14} />
              </a>
              <a
                href={selectedProject?.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 border rounded-xl font-semibold transition-all hover:-translate-y-0.5
                  ${selectedProject?.github_url
                    ? "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    : "border-gray-200 text-gray-400 cursor-not-allowed"}
                `}
              >
                <FaGithub size={18} /> Code
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ModalProject;