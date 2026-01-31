import React, { useEffect } from "react";
import { FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

function Experience() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const experiences = [
    {
      id: 1,
      role: "Senior Frontend Developer",
      company: "Tech Solutions Inc.",
      date: "2023 - Present",
      description:
        "Katta masshtabdagi web-ilovalarni yaratish va optimallashtirish. Junior dasturchilarga mentorlik qilish va Code Review jarayonlarini boshqarish.",
      skills: ["React", "Next.js", "TypeScript", "Redux"],
    },
    {
      id: 2,
      role: "Middle Web Developer",
      company: "Digital Creative Agency",
      date: "2021 - 2023",
      description:
        "Mijozlar uchun zamonaviy va interaktiv landing pagelar yaratish. UI/UX dizaynerlar bilan hamkorlikda animatsiyaga boy loyihalarni ishlab chiqish.",
      skills: ["Vue.js", "GSAP", "Tailwind", "Firebase"],
    },
    {
      id: 3,
      role: "Junior Developer",
      company: "StartUp Hub",
      date: "2020 - 2021",
      description:
        "Backend API integratsiyasi va admin panellarini yaratish. Mavjud loyihalardagi buglarni tuzatish va yangi funksiyalar qo'shish.",
      skills: ["JavaScript", "React", "Sass", "Git"],
    },
    {
      id: 4,
      role: "Internship",
      company: "IT Academy",
      date: "2019 - 2020",
      description:
        "Web dasturlash asoslarini o'rganish va real loyihalarda qatnashish. Jamoaviy ishlash ko'nikmalarini shakllantirish.",
      skills: ["HTML", "CSS", "Basic JS"],
    },
  ];

  return (
    <section
      id="experience"
      className="min-h-screen py-20 relative  overflow-hidden"
    >
      {/* Orqa fon effektlari (Umumiy stil) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#1985A1]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#4C5C68]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-4xl md:text-5xl font-bold text-[#46494C] dark:text-[#DCDCDD] mb-4">
            My <span className="text-[#1985A1]">Journey</span>
          </h2>
        
        </div>

        {/* TIMELINE CONTAINER */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* O'rta chiziq (Vertical Line) */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 h-full w-1 bg-gray-200 dark:bg-white/10 rounded-full"></div>

          {experiences.map((exp, index) => {
            // Juft yoki Toqligini aniqlash (Zigzag uchun)
            const isEven = index % 2 === 0;

            return (
              <div
                key={exp.id}
                className={`relative flex items-center justify-between mb-12 md:mb-24 ${
                  isEven ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                {/* 1. BO'SH JOY (Balans uchun) */}
                <div className="hidden md:block w-5/12" />

                {/* 2. MARKER (O'rtadagi dumaloq) */}
                <div className="absolute left-[-5px] md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-[#1985A1] border-4 border-white dark:border-[#2d2e32] z-20 shadow-[0_0_15px_rgba(25,133,161,0.5)]"></div>

                {/* 3. EXPERIENCE CARD */}
                <div
                  className="w-full md:w-5/12 pl-8 md:pl-0"
                  data-aos={isEven ? "fade-left" : "fade-right"} // Chapdagilar o'ngdan, O'ngdagilar chapdan chiqadi
                >
                  <div className="
                    p-6 rounded-2xl 
                    bg-white dark:bg-white/5 
                    border border-gray-100 dark:border-white/10
                    shadow-xl hover:shadow-2xl hover:shadow-[#1985A1]/10
                    transition-all duration-300 group
                  ">
                    
                    {/* Date Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1985A1]/10 text-[#1985A1] text-sm font-semibold mb-4">
                      <FaCalendarAlt className="text-xs" />
                      {exp.date}
                    </div>

                    {/* Role & Company */}
                    <h3 className="text-2xl font-bold text-[#46494C] dark:text-white mb-1 group-hover:text-[#1985A1] transition-colors">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">
                      <FaBriefcase />
                      {exp.company}
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Experience;