import React, { useEffect, useState } from "react";
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaTelegramPlane,
  FaEnvelope,
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { RiMapPinLine } from "react-icons/ri";
import AOS from "aos";
import "aos/dist/aos.css";
import { BASE_URL,   getCvBlob,  getMainPage } from "../api/mainPage";

function Home() {
  const [currentRole, setCurrentRole] = useState(0);
  const [profile, setProfile] = useState(null);
  const [cvUrl, setCvUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const roles = [
    "Frontend Developer",
    "React Specialist",
    "UI/UX Enthusiast",
    "JavaScript Expert",
    "Web Developer",
  ];


  const socials = [
    { name: "GitHub", icon: FaGithub, href: `${profile?.github}` },
    { name: "LinkedIn", icon: FaLinkedinIn, href: `${profile?.linkedin}` },
    { name: "Telegram", icon: FaTelegramPlane, href: `${profile?.telegram}` },
  ];

  const frontendSkills = ["HTML", "CSS", "JavaScript", "React", "Tailwind"];
  const backendSkills = ["Node.js", "Express", "REST API", "MongoDB"];


  useEffect(() => {
    let urlToClean = "";
  
    (async () => {
      try {
        setLoading(true);
  
        const main = await getMainPage();
        setProfile(main?.[0] || null);
  
        // ✅ CV pdf blob
        const blob = await getCvBlob();
  
        // ✅ Blob -> URL
        urlToClean = URL.createObjectURL(blob);
        setCvUrl(urlToClean);
        console.log("urlToClean:", urlToClean);
        
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  
    // ✅ cleanup (memory leak bo‘lmasin)
    return () => {
      if (urlToClean) URL.revokeObjectURL(urlToClean);
    };
  }, []);





  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section
      id="home"
      className="pb-[100px] lg:pb-[0]  min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative overflow-hidden"
    >
      
      {/* Background Accents */}
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
        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-10">
          
          {/* --- O'NG TOMON: AVATAR + SOCIALS --- */}
          <div className="order-1 lg:order-2 flex flex-col items-center">
            {/* Avatar Wrapper */}
            <div
              data-aos="zoom-in"
              data-aos-delay="120"
              className="relative flex justify-center items-center"
            >
              <div className="relative w-50 h-50  sm:w-80 sm:h-80 flex items-center justify-center">
                {/* Glow */}
                <div className="absolute -inset-6 rounded-full blur-3xl opacity-30 bg-[#1985A1] hidden dark:block" />

                {/* Avatar body */}
                <div className="relative w-full h-full rounded-full bg-[#C5C3C6] dark:bg-[#46494C] border border-[#4C5C68]/30 dark:border-[#C5C3C6]/20 flex items-center justify-center backdrop-blur">
                  <div className="w-[90%] h-[90%] rounded-full bg-[#DCDCDD] dark:bg-[#4C5C68]/60 flex items-center justify-center">
                    <span className="text-[140px] sm:text-[200px] font-bold leading-none text-[#46494C] dark:text-[#DCDCDD] select-none">
                      M
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Icons - Endi rasmning tagida */}
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="flex items-center gap-4 mt-10"
            >
              {socials.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-12 h-12 rounded-2xl border border-black/10 dark:border-white/10 bg-white/45 dark:bg-white/5 backdrop-blur flex items-center justify-center text-[#4C5C68] dark:text-white/70 hover:text-[#1985A1] hover:border-[#1985A1]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <Icon className="text-xl" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* --- CHAP TOMON: TEXT INFO --- */}
          <div className="lg:pl-2 order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="space-y-6">
              {/* Name */}
              <h1
                data-aos="fade-up"
                data-aos-delay="160"
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#46494C] dark:text-[#DCDCDD]"
              >
                Hi, I&apos;m <span className="text-[#1985A1]">{profile?.full_name}</span>
                
              </h1>

              {/* Animated Role */}
              <div
                data-aos="fade-up"
                data-aos-delay="240"
                className="h-16 overflow-hidden flex justify-center lg:justify-start"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <RiMapPinLine className="text-[20px] text-[#1985A1]" />
                <span className="text-lg font-medium text-[#46494C] dark:text-[#DCDCDD]">
                  {profile?.address}
                </span>
              </a>

              {/* Buttons */}
              <div
                data-aos="fade-up"
                data-aos-delay="500"
                className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start"
              >
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noreferrer"
                   
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#1985A1] text-white active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-[#1985A1]/30"
                >
                  <FiDownload className="text-[20px]" />
                  <span>Download CV</span>
                </a>

                <a
                  href="#about"
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold dark:bg-[#4C5C68]/40 border border-[#4C5C68]/30 dark:border-[#C5C3C6]/20 text-[#46494C] dark:text-[#DCDCDD] active:scale-95 transition-all duration-300 hover:bg-[#4C5C68]/10"
                >
                  <span>Read Blog</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SKILLS SECTION (Pastda alohida) */}
        <div
          data-aos="fade-up"
          data-aos-delay="220"
          className="flex flex-col md:flex-row gap-8 md:gap-20 justify-center items-center"
        >
          {/* Frontend */}
          <div className="flex flex-col items-center md:items-end gap-3 text-[#46494C] dark:text-[#DCDCDD]">
            <span className="text-2xl font-semibold text-[#1985A1] md:mr-2">
              Frontend
            </span>
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-2">
              {frontendSkills.map((item, i) => (
                <span key={item} className="flex items-center text-[16px]">
                  {item}
                  {i !== frontendSkills.length - 1 && (
                    <span className="mx-2 text-[#4C5C68] dark:text-[#C5C3C6]">
                      •
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-24 h-[1px] md:w-[1px] md:h-20 bg-[#1985A1] opacity-50"></div>

          {/* Backend */}
          <div className="flex flex-col items-center md:items-start gap-3 text-[#46494C] dark:text-[#DCDCDD]">
            <span className="text-2xl font-semibold text-[#1985A1] md:ml-2">
              Backend
            </span>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
              {backendSkills.map((item, i) => (
                <span key={item} className="flex items-center text-[16px]">
                  {item}
                  {i !== backendSkills.length - 1 && (
                    <span className="mx-2 text-[#4C5C68] dark:text-[#C5C3C6]">
                      •
                    </span>
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