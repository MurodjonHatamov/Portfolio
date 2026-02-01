import React, { useEffect, useState } from "react";
import { FaGithub, FaExternalLinkAlt, FaTimes, FaLayerGroup, FaCalendarAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import ModalProject from "../components/ModalProject";

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

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

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "Full Stack",
      // Backenddan keladigan rasmlar arrayi (max 3 ta)
      images: [
        "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1632&auto=format&fit=crop", // Asosiy
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1470&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1472851294608-415105015b99?q=80&w=1470&auto=format&fit=crop",
      ],
      description:
        "Zamonaviy onlayn do'kon. To'lov tizimlari, admin panel va real vaqt rejimidagi statistika. Foydalanuvchi tajribasini oshirish uchun to'liq moslashuvchan dizayn.",
      tech: ["React", "Node.js", "MongoDB", "Tailwind"],
      live: "https://example.com",
      github: "https://github.com",
      date: "12.11.2026",
    },
    {
      id: 2,
      title: "Task Management App",
      category: "Productivity",
      images: [
        "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?q=80&w=1632&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1472&auto=format&fit=crop",
      ],
      description:
        "Jamoalar uchun vazifalarni boshqarish tizimi. Drag & Drop funksiyasi va qulay dashboard.",
      tech: ["Next.js", "TypeScript", "Prisma"],
      live: "#",
      github: "#",
      date: "10.09.2026",
    },
    {
      id: 3,
      title: "AI Chat Interface",
      category: "AI & UI/UX",
      images: [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
      ],
      description:
        "Sun'iy intellekt bilan suhbatlashish uchun futuristik interfeys. Ovozli buyruqlar va tarix.",
      tech: ["React", "OpenAI API", "Framer Motion"],
      live: "#",
      github: "#",
      date: "05.08.2026",
    },
    {
      id: 4,
      title: "Travel Booking",
      category: "Travel",
      images: [
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1621&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1470&auto=format&fit=crop"
      ],
      description:
        "Sayohatlarni rejalashtirish va mehmonxonalarni bron qilish uchun qulay platforma.",
      tech: ["Vue.js", "Firebase", "Sass"],
      live: "#",
      github: "#",
      date: "22.07.2026",
    },
    {
      id: 5,
      title: "Health & Fitness Tracker",
      category: "Health",
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop"
      ],
      description:
        "Sport mashqlari va ovqatlanishni kuzatish ilovasi. AI yordamida shaxsiy tavsiyalar.",
      tech: ["React Native", "Redux", "GraphQL"],
      live: "#",
      github: "#",
      date: "14.06.2026",
    },
    {
      id: 6,
      title: "Cryptocurrency Dashboard",
      category: "Finance",
      images: [
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1632&auto=format&fit=crop"
      ],
      description:
        "Real vaqt rejimidagi kriptovalyuta kurslari. Portfel boshqaruvi va analitika.",
      tech: ["Next.js", "TypeScript", "Chart.js", "CoinGecko API"],
      live: "#",
      github: "#",
      date: "30.05.2026",
    },
  ];

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
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3 rounded-full border border-[#1985A1] text-[#1985A1] font-semibold max-sm:text-[12px] hover:bg-[#1985A1] hover:text-white transition-all duration-300"
            >
              View All Archives
            </a>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              onClick={() => setSelectedProject(project)}
              className="group relative h-[350px] w-full rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-white dark:bg-[#2a2a2a] border border-transparent hover:border-[#1985A1]/30 transition-all duration-300"
            >
              {/* Asosiy Rasm (0-indeks) */}
              <img
                src={project.images[0]}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

              {/* Text Content (Preview) */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <span className="text-[#1985A1] font-bold text-xs uppercase tracking-wider mb-2 block">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#1985A1] transition-colors">
                    {project.title}
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
<ModalProject setSelectedProject={setSelectedProject} selectedProject={selectedProject}/>
      )}
    </section>
  );
}

export default Projects;