import React, { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ModalProject from "../components/ModalProject";
import { getProjects } from "../api/apis";
import Sk from "../components/Sk";
import { getLang, pickLang } from "../api/mainPage";

function Projects({ profile }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const lang = useMemo(() => getLang(), []);
  
const descriptionText = useMemo(() => pickLang(selectedProject?.description, lang), [lang, selectedProject]);
console.log(descriptionText);





  const FALLBACK_IMG =
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop";

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic", offset: 60 });
    AOS.refresh();
  }, []);

  // Modal ochilganda body scroll stop
  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [selectedProject]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getProjects();
        if (cancelled) return;
        setProjects(Array.isArray(data) ? data : []);
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Xatolik yuz berdi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ Skeleton cards soni (xohlasang 4/6/8)
  const skeletonCards = useMemo(() => Array.from({ length: 2 }), []);

  return (
    <section id="projects" className="min-h-screen py-20 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between mt-16 px-2 sm:px-10 flex-wrap gap-4">
          <h2
            data-aos="fade-down"
            className="text-4xl max-sm:text-[25px] md:text-5xl font-bold text-[#46494C] dark:text-[#DCDCDD]"
          >
            My <span className="text-[#1985A1]">Projects</span>
          </h2>

          <div data-aos="fade-up">
            <a
              href={profile?.github || "https://github.com"}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3 rounded-full border border-[#1985A1] text-[#1985A1] font-semibold max-sm:text-[12px] hover:bg-[#1985A1] hover:text-white transition-all duration-300"
            >
              View All Archives
            </a>
          </div>
        </div>

        {/* Error */}
        {!loading && error && (
          <div className="mb-6 rounded-2xl p-4 border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold">
            {error}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ✅ LOADING SKELETON */}
          {loading &&
            skeletonCards.map((_, i) => (
              <div
                key={i}
                className="relative h-[350px] w-full rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur"
              >
                {/* Image skeleton */}
                <Sk className="absolute inset-0" />

                {/* Overlay gradient like real card */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                {/* Text skeleton */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 space-y-3">
                  <Sk className="h-3 w-28 rounded" />
                  <Sk className="h-7 w-56 rounded-xl" />
                  <Sk className="h-4 w-40 rounded" />
                </div>
              </div>
            ))}

          {/* ✅ REAL DATA */}
          {!loading &&
            !error &&
            projects.map((project, index) => (
              <div
                key={project?._id || index}
                data-aos="fade-up"
                data-aos-delay={index * 80}
                onClick={() => setSelectedProject(project)}
                className="group relative h-[350px] w-full rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-white dark:bg-[#2a2a2a]   transition-all duration-300"
              >
                {/* Image */}
                <img
                  src={project?.photos?.[0] ? project.photos[0] : FALLBACK_IMG}
                  alt={project?.project_name || "Project"}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Preview */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <span className="text-[#1985A1] font-bold text-xs uppercase tracking-wider mb-2 block">
                      {project?.deployed_date
                        ? new Date(project.deployed_date).toLocaleDateString("uz-UZ")
                        : "—"}
                    </span>

                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#1985A1] transition-colors">
                      {project?.project_name || "Untitled"}
                    </h3>

                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <span className="text-white/80 text-sm font-medium border-b border-[#1985A1]">
                        Click to view details
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedProject && (
        <ModalProject
          FALLBACK_IMG={FALLBACK_IMG}
          setSelectedProject={setSelectedProject}
          selectedProject={selectedProject}
          descriptionText={descriptionText}
        />
      )}
    </section>
  );
}

export default Projects;
