import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaExternalLinkAlt, FaCalendarAlt } from "react-icons/fa";
import { getAchievements } from "../api/apis";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop";

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
  });
}

function Achievements() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await getAchievements();
        if (!cancelled) setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => (cancelled = true);
  }, []);

  return (
    <section
      id="achievements"
      className="min-h-screen px-4 sm:px-6 lg:px-8 pt-24 pb-24"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-4xl md:text-5xl font-bold text-[#46494C] dark:text-[#DCDCDD]">
            Achievements & <span className="text-[#1985A1]">Certificates</span>
          </h2>
          <p className="mt-3 text-[#4C5C68] dark:text-white/60">
            O‘rganilgan bilimlar va rasmiy sertifikatlar
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SKELETON */}
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[360px] md:h-[420px] rounded-3xl bg-black/10 dark:bg-white/10 animate-pulse"
              />
            ))}

          {/* DATA */}
          {!loading &&
            data.map((item, index) => (
              <a
                key={item._id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="
                  group relative
                  h-[360px] md:h-[420px]
                  rounded-3xl overflow-hidden
                  shadow-xl
                  border border-black/10 dark:border-white/10
                  cursor-pointer
                "
              >
                {/* IMAGE */}
                <img
                  src={item.photos || FALLBACK_IMG}
                  alt={item.name || "Certificate"}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />

                {/* CONTENT */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  {/* DATE */}
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 mb-2">
                    <FaCalendarAlt className="text-[#1985A1]" />
                    {formatDate(item.date)}
                  </div>

                  {/* TITLE */}
                  {item.name && (
                    <h3 className="text-2xl font-bold text-white leading-snug mb-2">
                      {item.name}
                    </h3>
                  )}

                  {/* DESCRIPTION */}
                  {item.description && (
                    <p className="text-base text-white/80 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* LINK */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#1985A1] opacity-0 group-hover:opacity-100 transition">
                    View certificate <FaExternalLinkAlt />
                  </div>
                </div>
              </a>
            ))}
        </div>
      </div>
    </section>
  );
}

export default Achievements;
