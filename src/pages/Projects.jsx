import React, { useEffect, useState } from "react";
import { FaGithub, FaExternalLinkAlt, FaTimes, FaLayerGroup, FaCalendarAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import ModalProject from "../components/ModalProject";
import { getProjects } from "../api/apis";

function Projects({profile}) {
  const [selectedProject, setSelectedProject] = useState(null);
const [projects, setProjects] = useState([]); 
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop";

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic", offset: 60 });
    AOS.refresh();
  }, []);

  // Modal ochilganda body scrollni to'xtatish
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedProject]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);

        const data = await getProjects(); // 👈 API chaqirildi
        if (cancelled) return;

        setProjects(data); // array
  
        
      } catch (e) {
        setError(e.message || "Xatolik yuz berdi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);


  return (
    <section
      id="projects"
      className="min-h-screen py-20 relative overflow-hidden bg-gray-50 dark:bg-[#1a1a1a]"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          className="mb-10 flex items-center justify-between mt-16 px-10 flex-wrap"
          data-aos="fade-down"
        >
          <h2 className="text-4xl max-sm:text-[25px] md:text-5xl font-bold text-[#46494C] dark:text-[#DCDCDD] mb-4">
            My <span className="text-[#1985A1]">Projects</span>
          </h2>
          <div className="flex justify-center" data-aos="fade-up">
            <a
              href={profile?.github}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3 rounded-full border border-[#1985A1] text-[#1985A1] font-semibold max-sm:text-[12px] hover:bg-[#1985A1] hover:text-white transition-all duration-300"
            >
              View All Archives
            </a>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onClick={() => setSelectedProject(project)}
              className="group relative h-[350px] w-full rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-white dark:bg-[#2a2a2a] border border-transparent hover:border-[#1985A1]/30 transition-all duration-300"
            >
              {/* Asosiy Rasm (0-indeks) */}
              <img
                src={project?.photos[0] ?project?.photos[0]  : FALLBACK_IMG}
                alt={project?.project_name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Text Content (Preview) */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="text-[#1985A1] font-bold text-xs uppercase tracking-wider mb-2 block">
                  {new Date(project.deployed_date).toLocaleDateString("uz-UZ")}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#1985A1] transition-colors">
                    {project?.project_name}
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

      {/* --- MODAL (POPUP) --- */}
      {selectedProject && (
<ModalProject FALLBACK_IMG={FALLBACK_IMG} setSelectedProject={setSelectedProject} selectedProject={selectedProject}/>
      )}
    </section>
  );
}

export default Projects;