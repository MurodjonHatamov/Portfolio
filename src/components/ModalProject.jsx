import React from 'react'
import { FaGithub, FaExternalLinkAlt, FaTimes, FaLayerGroup, FaCalendarAlt } from "react-icons/fa";
function ModalProject({ selectedProject, setSelectedProject }) {
  return (
    <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-in-out]"
    onClick={() => setSelectedProject(null)}
  >
    <div
      className="bg-white dark:bg-[#1f1f1f] w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
      data-aos="zoom-in"
      data-aos-duration="300"
    >
      {/* Close Button */}
      <button
        onClick={() => setSelectedProject(null)}
        className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-[#1985A1] text-white rounded-full transition-colors"
      >
        <FaTimes size={18} />
      </button>

      {/* Left Side: Images Gallery */}
      <div className="w-full md:w-1/2 bg-black flex flex-col overflow-y-auto custom-scrollbar h-[40vh] md:h-auto border-r border-gray-800">
        {/* Har doim 1-rasm katta bo'lib turadi */}
        <div className="w-full h-full min-h-[300px]">
           <img
            src={selectedProject.images[0]}
            alt="Main Project"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Agar 1 tadan ko'p rasm bo'lsa, pastda qolganlari chiqadi */}
        {selectedProject.images.length > 1 && (
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#121212]">
            {selectedProject.images.slice(1).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Gallery ${idx}`}
                className="w-full h-32 object-cover hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </div>
        )}
      </div>

      {/* Right Side: Details */}
      <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
             <span className="text-[#1985A1] font-bold tracking-wider text-sm uppercase">
              {selectedProject.category}
            </span>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <FaCalendarAlt className="mr-2"/> {selectedProject.date}
            </div>
          </div>
         
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {selectedProject.title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
            {selectedProject.description}
          </p>
        </div>

        {/* Technologies */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase mb-3 flex items-center gap-2">
             <FaLayerGroup className="text-[#1985A1]" /> Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedProject.tech.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg border border-gray-200 dark:border-gray-600"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons (Footer) */}
        <div className="mt-auto flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <a
            href={selectedProject.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1985A1] text-white rounded-xl font-semibold hover:bg-[#146b82] transition-all shadow-lg hover:shadow-[#1985A1]/30"
          >
            Live Demo <FaExternalLinkAlt size={14} />
          </a>
          <a
            href={selectedProject.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <FaGithub size={18} /> Code
          </a>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ModalProject