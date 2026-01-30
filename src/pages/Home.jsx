import React, { useEffect, useState } from "react";
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaTelegramPlane,
  FaUser,
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { RiMapPinLine } from "react-icons/ri";
import { SiReact, SiJavascript, SiTailwindcss, SiFigma, SiNextdotjs } from "react-icons/si";

import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  const [currentRole, setCurrentRole] = useState(0);

  const roles = [
    "Frontend Developer",
    "React Specialist",
    "UI/UX Enthusiast",
    "JavaScript Expert",
    "Web Developer",
  ];

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
    // ba'zan layout renderingdan keyin animatsiyalar uchun kerak bo'ladi
    AOS.refresh();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [roles.length]);

  const socials = [
    { name: "GitHub", icon: FaGithub, href: "https://github.com" },
    { name: "LinkedIn", icon: FaLinkedinIn, href: "https://linkedin.com" },
    { name: "Instagram", icon: FaInstagram, href: "https://instagram.com" },
    { name: "Telegram", icon: FaTelegramPlane, href: "https://t.me" },
  ];

  const skills = [
    { icon: <SiReact className="text-4xl" />, name: "React" },
    { icon: <SiJavascript className="text-4xl" />, name: "JavaScript" },
    { icon: <SiNextdotjs className="text-4xl" />, name: "Next.js" },
    { icon: <SiTailwindcss className="text-4xl" />, name: "Tailwind" },
    { icon: <SiFigma className="text-4xl" />, name: "Figma" },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative overflow-hidden"
    >
      {/* background accents (faqat palette) */}
      <div className="absolute inset-0 -z-10 overflow-hidden hidden dark:flex">
        <div
          data-aos="fade-right"
          data-aos-delay="100"
          className="absolute top-20 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-5 bg-[#1986a164]"
        />
        <div
          data-aos="fade-left"
          data-aos-delay="180"
          className="absolute -bottom-28 -right-24 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-5 bg-[#1986a13d]"
        />
      </div>

      <div className="container mx-auto max-w-7xl relative">
        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 lg:mb-24">
          {/* AVATAR (mobil uchun tepada chiqadi) */}
          <div
            data-aos="zoom-in"
            data-aos-delay="120"
            className="relative flex justify-center lg:justify-start order-1 lg:order-2"
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Glow */}
              <div className="absolute -inset-6 rounded-full blur-3xl opacity-30 bg-[#1985A1]" />

              {/* Avatar body */}
              <div
                className="relative w-full h-full rounded-full
                           bg-[#C5C3C6] dark:bg-[#46494C]
                           border border-[#4C5C68]/30 dark:border-[#C5C3C6]/20
                           flex items-center justify-center
                           backdrop-blur"
              >
                {/* Inner circle */}
                <div
                  className="w-[90%] h-[90%] rounded-full
                             bg-[#DCDCDD] dark:bg-[#4C5C68]/60
                             flex items-center justify-center"
                >
                  {/* Letter */}
                  <span
                    className="text-[180px] sm:text-[200px] font-bold leading-none
                               text-[#46494C] dark:text-[#DCDCDD]
                               select-none"
                  >
                    M
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TEXT (mobil uchun pastga tushadi) */}
          <div className="lg:pl-2 order-2 lg:order-1">
            <div className="space-y-6">
              {/* Name */}
              <h1
                data-aos="fade-up"
                data-aos-delay="160"
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#46494C] dark:text-[#DCDCDD]"
              >
                Hi, I&apos;m <span className="text-[#1985A1]">Murodjon</span>
              </h1>

              {/* Animated role (slider) */}
              <div
                data-aos="fade-up"
                data-aos-delay="240"
                className="h-16 overflow-hidden"
              >
                <div
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateY(-${currentRole * 64}px)` }}
                >
                  {roles.map((role, index) => (
                    <div key={index} className="h-16 flex items-center">
                      <span className="text-3xl sm:text-4xl font-semibold text-[#4C5C68] dark:text-white/75">
                        {role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <a
                data-aos="fade-down"
                data-aos-delay="320"
                href="https://maps.app.goo.gl/FMvBVQZQFJHAKpoLA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              >
                <RiMapPinLine className="text-[20px] text-[#1985A1]" />
                <span className="text-lg font-medium hover:text-[#1985A1] text-[#46494C] dark:text-[#DCDCDD]">
                  Fergana region, Uzbekistan
                </span>
              </a>

              {/* Social (4 icons, no text) */}
              <div
                data-aos="fade-up"
                data-aos-delay="420"
                className="flex items-center gap-3 pt-2"
              >
                {socials.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      data-aos="zoom-in"
                      data-aos-delay={520 + idx * 90}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      
                      aria-label={s.name}
                      title={s.name}
                      className="w-12 h-12 rounded-2xl
                                 border border-black/10 dark:border-white/10
                                 bg-white/45 dark:bg-white/5 backdrop-blur
                                 flex items-center justify-center
                                 text-[#4C5C68] dark:text-white/70
                                 hover:text-[#1985A1] hover:border-[#1985A1]/40
                                 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                    >
                      <Icon className="text-xl" />
                    </a>
                  );
                })}
              </div>

              {/* Buttons */}
              <div
                data-aos="fade-up"
                data-aos-delay="620"
                className="flex flex-wrap gap-4 pt-4"
              >
                {/* Download CV */}
                <a
                  href="/cv/Murodjon_CV.pdf"
                  download
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl
                             font-semibold
                             bg-[#1985A1] text-[#DCDCDD]
                             active:scale-95
                             transition-all duration-300"
                >
                  <FiDownload className="text-[20px]" />
                  <span>Download CV</span>
                </a>

                {/* About Me */}
                <a
                  href="#about"
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl
                             font-semibold
                             dark:bg-[#4C5C68]/40
                             border border-[#4C5C68]/30 dark:border-[#C5C3C6]/20
                             text-[#46494C] dark:text-[#DCDCDD]
                             active:scale-95
                             transition-all duration-300"
                >
                  <FaUser className="text-[18px]" />
                  <span>About Me</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SKILLS (AOS + mobil wrap) */}
        <div
          data-aos="fade-up"
          data-aos-delay="220"
          className="mt-8 flex max-sm:flex-col gap-20 justify-center"
        >
          {/* Frontend */}
          <div className="flex flex-col gap-3 text-[#46494C] dark:text-[#DCDCDD]">
            <span className="text-2xl font-semibold text-[#1985A1] mr-2">
              Frontend
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {["HTML", "CSS", "JavaScript", "React", "Tailwind"].map((item, i, arr) => (
                <span key={item} className="flex items-center text-[16px]">
                  {item}
                  {i !== arr.length - 1 && (
                    <span className="mx-2 text-[#4C5C68] dark:text-[#C5C3C6]">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="h-20 bg-[#1985A1] w-1 max-md:hidden"></div>

          {/* Backend */}
          <div className="flex flex-col gap-3 text-[#46494C] dark:text-[#DCDCDD]">
            <span className="text-2xl font-semibold text-[#1985A1] mr-2">
              Backend
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {["Node.js", "Express", "REST API", "MongoDB"].map((item, i, arr) => (
                <span key={item} className="flex items-center text-[16px]">
                  {item}
                  {i !== arr.length - 1 && (
                    <span className="mx-2 text-[#4C5C68] dark:text-[#C5C3C6]">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

       
      </div>
    </section>
  );
}

export default Home;
