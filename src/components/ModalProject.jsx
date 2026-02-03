import React, { useEffect, useMemo, useState } from "react";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaTimes,
  FaLayerGroup,
  FaCalendarAlt,
  FaImage,
} from "react-icons/fa";

function ModalProject({ selectedProject, setSelectedProject, FALLBACK_IMG }) {
  // ✅ photos safe (max 3)
  const photos = useMemo(() => {
    const arr = Array.isArray(selectedProject?.photos) ? selectedProject.photos : [];
    const sliced = arr.filter(Boolean).slice(0, 3);
    return sliced.length ? sliced : [FALLBACK_IMG];
  }, [selectedProject, FALLBACK_IMG]);

  const [activeImage, setActiveImage] = useState("");

  // Modal ochilganda yoki loyiha o'zgarganda birinchi rasm
  useEffect(() => {
    setActiveImage(photos[0]);
  }, [selectedProject?._id, photos]);

  // ESC bilan yopish
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSelectedProject]);

  if (!selectedProject) return null;

  const dateText = selectedProject?.deployed_date
    ? new Date(selectedProject.deployed_date).toLocaleDateString("uz-UZ")
    : "—";

  const hasLive = Boolean(selectedProject?.project_url);
  const hasGithub = Boolean(selectedProject?.github_url);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={() => setSelectedProject(null)}
    >
      <div
        className="
          relative w-full max-w-5xl
          rounded-3xl overflow-hidden
          shadow-2xl
          border border-white/10
          bg-white dark:bg-[#1e1e1e]
          flex flex-col md:flex-row
          h-[88vh] md:h-[82vh] max-h-[860px]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => setSelectedProject(null)}
          className="
            absolute top-4 right-4 z-30
            w-11 h-11 rounded-2xl
            bg-black/60 hover:bg-[#1985A1]
            text-white
            backdrop-blur-sm
            transition-all duration-300
            shadow-lg
            active:scale-95
            flex items-center justify-center
          "
          aria-label="Close"
          title="Close"
        >
          <FaTimes size={18} />
        </button>

        {/* LEFT: Gallery */}
        <div className="w-full md:w-[55%] flex flex-col bg-black/5 dark:bg-black">
          {/* Main image (16:9) */}
          <div className="relative w-full bg-gray-100 dark:bg-[#121212]">
            <div className="relative w-full aspect-video overflow-hidden">
              <img
                key={activeImage}
                src={activeImage}
                alt={selectedProject?.project_name || "Project"}
                className="
                  absolute inset-0 w-full h-full
                  object-cover
                  animate-[fadeIn_0.35s_ease-out]
                "
                loading="eager"
              />
              {/* gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="p-4 bg-white dark:bg-[#252525] border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-white/50 mb-2 font-medium uppercase tracking-wide flex items-center gap-2">
                <FaImage /> Gallery ({photos.length})
              </p>

              <div className="flex gap-3 overflow-x-auto p-1">
                {photos.map((img, idx) => {
                  const active = img === activeImage;
                  return (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => setActiveImage(img)}
                      className={`
                        relative w-20 h-14 md:w-28 md:h-16 flex-shrink-0
                        rounded-xl overflow-hidden transition-all duration-300
                        ${active
                          ? "ring-2 ring-[#1985A1] opacity-100 scale-[1.02]"
                          : "opacity-70 hover:opacity-100 hover:scale-[1.02] ring-1 ring-transparent hover:ring-white/30"}
                      `}
                      aria-label={`Select image ${idx + 1}`}
                      title={`Image ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Details (scrollable) */}
        <div className="w-full md:w-[45%] flex flex-col bg-white dark:bg-[#1e1e1e]">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {/* Date */}
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#1985A1]/10 text-[#1985A1]">
                <FaCalendarAlt className="mr-2" /> {dateText}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#46494C] dark:text-white mb-4 leading-tight">
              {selectedProject?.project_name || "Untitled Project"}
            </h2>

            {/* Description */}
            <p className="text-[#4C5C68] dark:text-white/70 text-base leading-relaxed">
              {selectedProject?.description || "Description mavjud emas."}
            </p>

            {/* Tech */}
            <div className="mt-8">
              <h4 className="text-sm font-bold text-[#46494C] dark:text-white uppercase mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                <FaLayerGroup className="text-[#1985A1]" /> Technologies
              </h4>

              {Array.isArray(selectedProject?.technologies) &&
              selectedProject.technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, i) => (
                    <span
                      key={`${tech}-${i}`}
                      className="
                        px-3 py-1.5
                        bg-gray-50 dark:bg-[#2d2d2d]
                        text-[#4C5C68] dark:text-white/80
                        text-sm rounded-full
                        border border-gray-200 dark:border-gray-600
                      "
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#4C5C68] dark:text-white/45">
                  (Tech stack kiritilmagan)
                </p>
              )}
            </div>
          </div>

          {/* Footer fixed */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a]">
            <div className="flex gap-4">
              <a
                href={hasLive ? selectedProject.project_url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!hasLive}
                className={`
                  flex-1 flex items-center justify-center gap-2
                  px-6 py-3 rounded-2xl font-semibold
                  transition-all shadow-lg hover:shadow-xl
                  active:scale-95
                  ${hasLive
                    ? "bg-[#1985A1] text-white hover:bg-[#156f85] shadow-[#1985A1]/20"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"}
                `}
              >
                Live Demo <FaExternalLinkAlt size={14} />
              </a>

              <a
                href={hasGithub ? selectedProject.github_url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!hasGithub}
                className={`
                  flex-1 flex items-center justify-center gap-2
                  px-6 py-3 rounded-2xl font-semibold
                  border transition-all shadow-sm
                  active:scale-95
                  ${hasGithub
                    ? "border-gray-300 dark:border-gray-600 text-[#46494C] dark:text-white/80 hover:bg-gray-100 dark:hover:bg-gray-700"
                    : "border-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"}
                `}
              >
                <FaGithub size={18} /> Code
              </a>
            </div>

            <p className="mt-3 text-xs text-[#4C5C68] dark:text-white/35 text-center">
              ESC bosib ham yopishingiz mumkin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalProject;
