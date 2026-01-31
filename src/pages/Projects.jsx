import React, { useEffect, useMemo, useState } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

function Projects() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic", offset: 60 });
    AOS.refresh();
  }, []);

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "Full Stack",
      image:
        "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1632&auto=format&fit=crop",
      description:
        "Zamonaviy onlayn do'kon. To'lov tizimlari, admin panel va real vaqt rejimidagi statistika.",
      tech: ["React", "Node.js", "MongoDB", "Tailwind"],
      live: "#",
      github: "#",
    },
    {
      id: 2,
      title: "Task Management App",
      category: "Productivity",
      image:
        "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?q=80&w=1632&auto=format&fit=crop",
      description:
        "Jamoalar uchun vazifalarni boshqarish tizimi. Drag & Drop funksiyasi va qulay dashboard.",
      tech: ["Next.js", "TypeScript", "Prisma"],
      live: "#",
      github: "#",
    },
    {
      id: 3,
      title: "AI Chat Interface",
      category: "AI & UI/UX",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1632&auto=format&fit=crop",
      description:
        "Sun'iy intellekt bilan suhbatlashish uchun futuristik interfeys. Ovozli buyruqlar va tarix.",
      tech: ["React", "OpenAI API", "Framer Motion"],
      live: "#",
      github: "#",
    },
    {
      id: 4,
      title: "Travel Booking",
      category: "Travel",
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1621&auto=format&fit=crop",
      description:
        "Sayohatlarni rejalashtirish va mehmonxonalarni bron qilish uchun qulay platforma.",
      tech: ["Vue.js", "Firebase", "Sass"],
      live: "#",
      github: "#",
    },
  ];

  // --- Filter setup (premium segmented) ---
  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category)));
    return ["All", ...unique];
  }, [projects]);

  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((p) => p.category === active);
  }, [projects, active]);

  const countBy = useMemo(() => {
    const map = { All: projects.length };
    projects.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [projects]);

  return (
    <section
      id="projects"
      className="min-h-screen py-20 relative overflow-hidden  "
    >
  

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          className=" mb-10  flex items-center justify-between mt-16 px-10"
          data-aos="fade-down"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#46494C] dark:text-[#DCDCDD] mb-4">
            My <span className="text-[#1985A1]">Projects</span>
          </h2>
          <div className="flex justify-center " data-aos="fade-up">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3 rounded-full border border-[#1985A1] text-[#1985A1] font-semibold hover:bg-[#1985A1] hover:text-white transition-all duration-300"
          >
            View All Archives
          </a>
        </div>
        </div>

    
    
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filtered.map((project, index) => (
            <div
              key={project.id}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              className="group relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
            >
              {/* Project Image */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 translate-y-[40%] group-hover:translate-y-0 transition-transform duration-500 ease-out">
                {/* Title & Category */}
                <div className="mb-4">
                  <span className="text-[#1985A1] font-semibold tracking-wider text-sm uppercase mb-2 block">
                    {project.category}
                  </span>
                  <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-[#1985A1] transition-colors">
                    {project.title}
                  </h3>
                </div>

                {/* Description & Tech */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <p className="text-gray-300 mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-medium text-white bg-white/10 backdrop-blur-md rounded-full border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white hover:text-[#1985A1] transition-colors font-medium"
                    >
                      <FaGithub className="text-xl" /> Code
                    </a>

                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2 bg-[#1985A1] text-white rounded-full font-semibold hover:bg-[#156f85] transition-all shadow-lg hover:shadow-[#1985A1]/40"
                    >
                      Live Demo <FaExternalLinkAlt className="text-sm" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Projects Button */}

      </div>

    </section>
  );
}

export default Projects;
