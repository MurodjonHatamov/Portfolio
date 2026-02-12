import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaTelegramPlane,
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { RiMapPinLine } from "react-icons/ri";
import AOS from "aos";
import "aos/dist/aos.css";
import { getCvBlob, getMainPage } from "../api/mainPage";
import Sk from "../components/Sk";
import { pickLang, getLang } from "../api/mainPage"
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext";


function Home() {
  const [profile, setProfile] = useState(null);
  const [cvUrl, setCvUrl] = useState("");
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();

  const { lang, t } = useLang();
  
  useEffect(() => {
    let urlToClean = "";

    (async () => {
      try {
        setLoading(true);

        // main page -> ARRAY qaytaryapti (sen ko'rsatgandek)
        const main = await getMainPage();
        setProfile(main?.[0] || null);

        // CV (blob) -> URL
        const blob = await getCvBlob();
        urlToClean = URL.createObjectURL(blob);
        setCvUrl(urlToClean);
      } catch (e) {
        console.error("Home load error:", e);
      } finally {
        setLoading(false);
      }
    })();

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

  const socials = useMemo(() => {
    // Agar profile yo'q bo'lsa, defaultlar
    const github = profile?.github || "https://github.com";
    const linkedin = profile?.linkedin || "https://linkedin.com";
    const instagram = profile?.instagram || "https://instagram.com";
    const telegram = profile?.telegram || "https://t.me";

    return [
      { name: "GitHub", icon: FaGithub, href: github },
      { name: "LinkedIn", icon: FaLinkedinIn, href: linkedin },
      { name: "Instagram", icon: FaInstagram, href: instagram },
      { name: "Telegram", icon: FaTelegramPlane, href: telegram },
    ];
  }, [profile]);

  
  const professionAddText = useMemo(
    () => pickLang(profile?.profession_add, lang),
    [profile, lang]
  );
  
  const professionText = useMemo(
    () => pickLang(profile?.profession, lang),
    [profile, lang]
  );



  const clickCount = useRef(0);

  const handleClick = () => {
    clickCount.current += 1;

    if (clickCount.current === 10) {
 navigate("/admin");  
 
      clickCount.current = 0; 
    }
  };

  return (
    <section
      id="home"
      className="pb-[100px] lg:pb-0 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative overflow-hidden"
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
        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-10">
          {/* RIGHT: AVATAR + SOCIALS */}
          <div className="order-1 lg:order-2 flex flex-col items-center">
            <div className="relative">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                <div className="absolute -inset-6 rounded-full blur-3xl opacity-30 bg-[#1985A1] hidden dark:block" />

                <div  onClick={handleClick} className="relative w-full h-full rounded-full overflow-hidden border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur">
                  {loading ? (
                    <Sk className="w-full h-full rounded-full" />
                  ) : profile?.photos?.[0] ? (
                    <img
                      src={profile.photos[0]}
                      alt={profile.full_name || "Profile"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#C5C3C6] dark:bg-[#46494C]">
                      <span className="text-[140px] sm:text-[180px] font-bold leading-none text-[#46494C] dark:text-[#DCDCDD] select-none">
                        {(profile?.full_name?.[0] || "M").toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SOCIALS */}
            <div className="flex items-center gap-3 sm:gap-4 mt-10 flex-wrap justify-center">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <Sk key={i} className="w-12 h-12 rounded-2xl" />
                  ))
                : socials.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.name}
                        title={s.name}
                        className="w-12 h-12 rounded-2xl border border-black/10 dark:border-white/10 bg-white/45 dark:bg-white/5 backdrop-blur flex items-center justify-center text-[#4C5C68] dark:text-white/70 hover:text-[#1985A1] hover:border-[#1985A1]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                      >
                        <Icon className="text-xl" />
                      </a>
                    );
                  })}
            </div>
          </div>

          {/* LEFT: TEXT */}
          <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="space-y-6 w-full">
              {/* NAME */}
              {loading ? (
                <div className="space-y-3">
                  <Sk className="h-12 sm:h-14 lg:h-16 w-72 sm:w-[420px] rounded-2xl mx-auto lg:mx-0" />
                  <Sk className="h-10 sm:h-12 w-56 sm:w-72 rounded-2xl mx-auto lg:mx-0" />
                </div>
              ) : (
                <div data-aos="fade-up" className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#46494C] dark:text-[#DCDCDD]">
                  {t("home_hi")} <span className="text-[#1985A1]">{profile?.full_name || t("home_dev")}</span>
                </h1>
              
                <div className="w-14 h-[3px] rounded-full bg-[#1985A1] opacity-80 mx-auto lg:mx-0" />
              
                <p
                  className="
                    text-[15px] sm:text-[19px]
                    font-semibold
                    text-[#4C5C68] dark:text-white/70
                    leading-relaxed
                    max-w-xl
                    mx-auto lg:mx-0
                  "
                >
                  {professionText}
                </p>
              </div>
              
              )}

              {/* PROFESSION ADD (til bo'yicha) */}
              {loading ? (
                <div className="space-y-3 max-w-xl mx-auto lg:mx-0">
                  <Sk className="h-4 w-full rounded" />
                  <Sk className="h-4 w-11/12 rounded" />
                  <Sk className="h-4 w-9/12 rounded" />
                </div>
              ) : (
                <p
                  data-aos="fade-up"
                  data-aos-delay="120"
                  className="text-[18px] sm:text-[20px] lg:text-[22px] leading-relaxed text-[#4C5C68] dark:text-white/70 max-w-xl"
                >
                  {professionAddText}
                </p>
              )}

              {/* LOCATION */}
              {loading ? (
                <Sk className="h-10 w-64 rounded-full mx-auto lg:mx-0" />
              ) : (
                <div
                  data-aos="fade-up"
                  data-aos-delay="180"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <RiMapPinLine className="text-[20px] text-[#1985A1]" />
                  <span className="text-lg font-medium text-[#46494C] dark:text-[#DCDCDD]">
                    {profile?.address ||  t("home_location")}
                  </span>
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                {loading ? (
                  <>
                    <Sk className="h-12 w-40 rounded-xl" />
                    <Sk className="h-12 w-32 rounded-xl" />
                  </>
                ) : (
                  <>
                    <a
                      href={cvUrl || "#"}
                      onClick={(e) => {
                        if (!cvUrl) e.preventDefault();
                      }}
                      download="CV.pdf"
                      className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white active:scale-95 transition-all duration-300
                        ${cvUrl ? "bg-[#1985A1] hover:shadow-lg hover:shadow-[#1985A1]/30" : "bg-[#4C5C68] cursor-not-allowed opacity-70"}
                      `}
                    >
                      <FiDownload className="text-[20px]" />
                      <span>{t("home_download_cv")}</span>
                    </a>

                    <a
                      href="/projects"
                      className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold dark:bg-[#4C5C68]/40 border border-[#4C5C68]/30 dark:border-[#C5C3C6]/20 text-[#46494C] dark:text-[#DCDCDD] active:scale-95 transition-all duration-300 hover:bg-[#4C5C68]/10"
                    >
                    <span>{t("home_my_projects")}</span>

                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SKILLS + TOOLS */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-20 justify-center items-center">
          {/* Skills */}
          <div className="flex flex-col items-center md:items-end gap-3 text-[#46494C] dark:text-[#DCDCDD]">
            {loading ? (
              <>
                <Sk className="h-6 w-24 rounded" />
                <div className="flex flex-wrap justify-center md:justify-end gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Sk key={i} className="h-4 w-20 rounded" />
                  ))}
                </div>
              </>
            ) : (
              <>
                <span className="text-2xl font-semibold text-[#1985A1] md:mr-2">
                {t("home_skills")}
                </span>
                <div className="flex flex-wrap justify-center md:justify-end items-center gap-2">
                  {(profile?.skills || []).map((item, i, arr) => (
                    <span key={`${item}-${i}`} className="flex items-center text-[16px]">
                      {item}
                      {i !== arr.length - 1 && (
                        <span className="mx-2 text-[#4C5C68] dark:text-[#C5C3C6]">•</span>
                      )}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="w-24 h-[1px] md:w-[1px] md:h-20 bg-[#1985A1] opacity-50" />

          {/* Tools */}
          <div className="flex flex-col items-center md:items-start gap-3 text-[#46494C] dark:text-[#DCDCDD]">
            {loading ? (
              <>
                <Sk className="h-6 w-24 rounded" />
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Sk key={i} className="h-4 w-20 rounded" />
                  ))}
                </div>
              </>
            ) : (
              <>
                <span className="text-2xl font-semibold text-[#1985A1] md:ml-2">
                {t("home_tools")}
                </span>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                  {(profile?.tools || []).map((item, i, arr) => (
                    <span key={`${item}-${i}`} className="flex items-center text-[16px]">
                      {item}
                      {i !== arr.length - 1 && (
                        <span className="mx-2 text-[#4C5C68] dark:text-[#C5C3C6]">•</span>
                      )}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
