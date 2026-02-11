import React, { useEffect, useMemo, useState } from "react";
import { FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { getExperience } from "../api/apis";
import { useLang } from "../context/LanguageContext";
import { pickLang } from "../api/mainPage";
import Sk from "../components/Sk";


function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { lang, t } = useLang();

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic", offset: 60 });
    AOS.refresh();
  }, []);

  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getExperience();
        if (cancelled) return;
        setExperiences(Array.isArray(data) ? data : []);
    
        
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Experience olishda xatolik");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);





  // ✅ skeleton helper

  // ✅ skeleton cards soni
  const skeletonItems = useMemo(() => Array.from({ length: 4 }), []);

  return (
    <section id="experience" className="min-h-screen py-20 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#1985A1]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#4C5C68]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-4xl md:text-5xl font-bold text-[#46494C] dark:text-[#DCDCDD] mb-4">
           {t("title_my")} <span className="text-[#1985A1]">{t("exp_title_journey")}</span>
          </h2>

          {/* loading subtitle skeleton (xohlasang) */}
          {loading ? (
            <div className="flex justify-center">
              <Sk className="h-4 w-56 rounded" />
            </div>
          ) : null}
        </div>

        {/* Error */}
        {!loading && error && (
          <div className="max-w-3xl mx-auto mb-10 rounded-2xl p-4 border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold">
            {error}
          </div>
        )}

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Middle line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 h-full w-1 bg-gray-200 dark:bg-white/10 rounded-full" />

          {/* ✅ LOADING SKELETON */}
          {loading &&
            skeletonItems.map((_, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex items-center justify-between mb-12 md:mb-24 ${
                    isEven ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  <div className="hidden md:block w-5/12" />

                  {/* marker */}
                  <div className="absolute left-[-5px] md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-[#1985A1]/40 border-4 border-white dark:border-[#2d2e32] z-20" />

                  {/* card */}
                  <div className="w-full md:w-5/12 pl-8 md:pl-0">
                    <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur shadow-xl">
                      {/* badge */}
                      <Sk className="h-7 w-40 rounded-full mb-5" />

                      {/* role */}
                      <Sk className="h-7 w-56 rounded-xl mb-3" />

                      {/* company row */}
                      <div className="flex items-center gap-2 mb-5">
                        <Sk className="h-4 w-4 rounded" />
                        <Sk className="h-4 w-48 rounded" />
                      </div>

                      {/* description lines */}
                      <div className="space-y-3">
                        <Sk className="h-4 w-full rounded" />
                        <Sk className="h-4 w-11/12 rounded" />
                        <Sk className="h-4 w-9/12 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* ✅ REAL DATA */}
          {!loading &&
            !error &&
            experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              
              const descriptionText = pickLang(exp?.description, lang);
              const roleText = pickLang(exp?.role, lang);
  // const companyText = pickLang(exp?.company, lang);

              return (
                <div
                  key={exp?._id || index}
                  className={`relative flex items-center justify-between mb-12 md:mb-24 ${
                    isEven ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  <div className="hidden md:block w-5/12" />

                  {/* marker */}
                  <div className="absolute left-[-5px] md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-[#1985A1] border-4 border-white dark:border-[#2d2e32] z-20 shadow-[0_0_15px_rgba(25,133,161,0.5)]" />

                  {/* card */}
                  <div
                    className="w-full md:w-5/12 pl-8 md:pl-0"
                    data-aos={isEven ? "fade-left" : "fade-right"}
                  >
                    <div
                      className="
                        p-6 rounded-2xl
                        bg-white dark:bg-white/5
                        border border-gray-100 dark:border-white/10
                        shadow-xl hover:shadow-2xl hover:shadow-[#1985A1]/10
                        transition-all duration-300 group
                      "
                    >
                      {/* Date Badge */}
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                          exp?.to
                            ? "bg-[#1985A1]/10 text-[#1985A1]"
                            : "bg-green-500/10 text-green-600"
                        }`}
                      >
                        <FaCalendarAlt className="text-xs" />
                        {formatDate(exp?.from)} – {exp?.to ? formatDate(exp?.to) : "Present"}
                      </div>

                      {/* Role */}
                      <h3 className="text-2xl font-bold text-[#46494C] dark:text-white mb-1 group-hover:text-[#1985A1] transition-colors">
                        {roleText || "—"}
                      </h3>

                      {/* Company */}
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">
                        <FaBriefcase />
                        {exp?.company || "—"}
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {descriptionText|| "—"}
                      </p>
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
