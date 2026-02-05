import React, { useEffect, useMemo, useState } from "react";
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
import { getCvBlob, getMainPage } from "../api/mainPage";
import Sk from "../components/Sk";

function Home() {
  const [profile, setProfile] = useState(null);
  const [cvUrl, setCvUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let urlToClean = "";

    (async () => {
      try {
        setLoading(true);

        const main = await getMainPage();
        setProfile(main?.[0] || null);

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

    return [
      { name: "GitHub", icon: FaGithub, href: profile?.github || "https://github.com" },
      { name: "LinkedIn", icon: FaLinkedinIn, href: profile?.linkedin || "https://linkedin.com" },
      { name: "Instagram", icon: FaInstagram, href: profile?.instagram || "https://instagram.com" },
      { name: "Telegram", icon: FaTelegramPlane, href: profile?.telegram || "https://t.me" },

    ];
  }, [profile]);



  return (
    <section
  
      id="home"
      className="pb-[100px] lg:pb-[0] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative overflow-hidden"
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

                <div
           
                 className="relative w-full h-full rounded-full overflow-hidden border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur">
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
                        target={s.name === "Email" ? "_self" : "_blank"}
                        rel={s.name === "Email" ? undefined : "noopener noreferrer"}
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
                <h1
                  data-aos="fade-up"
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#46494C] dark:text-[#DCDCDD]"
                >
                  Hi, I&apos;m{" "}
                  <span className="text-[#1985A1]">{profile?.full_name || "Murodjon"}</span>
                </h1>
              )}

              {/* PROFESSION ADD */}
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
                  className="text-[18px] sm:text-[20px] lg:text-[22px] leading-relaxed text-[#4C5C68] dark:text-white/70 max-w-xl "
                >
                  {profile?.profession_add || "—"}
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
                    {profile?.address || "Uzbekistan"}
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
                      href={cvUrl}
                      download="CV.pdf"
                      className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#1985A1] text-white active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-[#1985A1]/30"
                    >
                      <FiDownload className="text-[20px]" />
                      <span>Download CV</span>
                    </a>

                    <a
                      href="/blog"
                      className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold dark:bg-[#4C5C68]/40 border border-[#4C5C68]/30 dark:border-[#C5C3C6]/20 text-[#46494C] dark:text-[#DCDCDD] active:scale-95 transition-all duration-300 hover:bg-[#4C5C68]/10"
                    >
                      <span>Read Blog</span>
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
                  Skills
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
          <div className="w-24 h-[1px] md:w-[1px] md:h-20 bg-[#1985A1] opacity-50"></div>

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
                  Tools
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






// import React, { useEffect, useState } from "react";
// import {
//   FaGithub,
//   FaLinkedinIn,
//   FaInstagram,
//   FaTelegramPlane,
//   FaEnvelope,
// } from "react-icons/fa";
// import { FiDownload } from "react-icons/fi";
// import { RiMapPinLine } from "react-icons/ri";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { BASE_URL, getCvBlob, getMainPage } from "../api/mainPage";

// function Home() {
//   const [currentRole, setCurrentRole] = useState(0);
//   const [profile, setProfile] = useState(null);
//   const [cvUrl, setCvUrl] = useState("");
//   const [loading, setLoading] = useState(true);
//   const roles = [
//     "Frontend Developer",
//     "React Specialist",
//     "UI/UX Enthusiast",
//     "JavaScript Expert",
//     "Web Developer",
//   ];

//   const socials = [
//     { name: "GitHub", icon: FaGithub, href: `${profile?.github}` },
//     { name: "LinkedIn", icon: FaLinkedinIn, href: `${profile?.linkedin}` },
//     { name: "Instagram", icon: FaInstagram, href: profile?.instagram || "https://instagram.com" },
//     { name: "Telegram", icon: FaTelegramPlane, href: `${profile?.telegram}` },
//   ];

//   useEffect(() => {
//     let urlToClean = "";

//     (async () => {
//       try {
//         setLoading(true);

//         const main = await getMainPage();
//         setProfile(main?.[0] || null);
//         console.log("main:", main);

//         // ✅ CV pdf blob
//         const blob = await getCvBlob();

//         // ✅ Blob -> URL
//         urlToClean = URL.createObjectURL(blob);
//         setCvUrl(urlToClean);
//         console.log("urlToClean:", urlToClean);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     })();

//     // ✅ cleanup (memory leak bo‘lmasin)
//     return () => {
//       if (urlToClean) URL.revokeObjectURL(urlToClean);
//     };
//   }, []);

//   useEffect(() => {
//     AOS.init({
//       duration: 800,
//       easing: "ease-out-cubic",
//       once: true,
//       offset: 80,
//     });
//     AOS.refresh();
//   }, []);

//   // useEffect(() => {
//   //   const interval = setInterval(() => {
//   //     setCurrentRole((prev) => (prev + 1) % roles.length);
//   //   }, 2600);
//   //   return () => clearInterval(interval);
//   // }, [roles.length]);
//   {
//     /* <div
//                   className="transition-transform duration-500 ease-in-out"
//                   style={{ transform: `translateY(-${currentRole * 64}px)` }}
//                 >
//                   {roles.map((role, index) => (
//                     <div key={index} className="h-16 flex items-center">
//                       <span className="text-3xl sm:text-4xl font-semibold text-[#4C5C68] dark:text-white/75">
//                         {role}
                        
//                       </span>
//                     </div>
//                   ))}
//                 </div> */
//   }

//   return (
//     <section
//       id="home"
//       className="pb-[100px] lg:pb-[0]  min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative overflow-hidden"
//     >
//       {/* Background Accents */}
//       <div className="absolute inset-0 -z-10 overflow-hidden hidden dark:flex">
//         <div
//           data-aos="fade-right"
//           data-aos-delay="100"
//           className="absolute top-20 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-5 bg-[#1986a164]"
//         />
//         <div
//           data-aos="fade-left"
//           data-aos-delay="180"
//           className="absolute -bottom-28 -right-24 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-5 bg-[#1986a13d]"
//         />
//       </div>

//       <div className="container mx-auto max-w-7xl relative">
//         {/* MAIN CONTENT */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-10">
//           {/* --- O'NG TOMON: AVATAR + SOCIALS --- */}
//           <div className="order-1 lg:order-2 flex flex-col items-center">
//             {/* Avatar Wrapper */}
//             <div
//               data-aos="zoom-in"
//               data-aos-delay="120"
//               className="relative flex justify-center items-center"
//             >
//               <div className="relative w-50 h-50  sm:w-80 sm:h-80 flex items-center justify-center">
//                 {/* Glow */}
//                 <div className="absolute -inset-6 rounded-full blur-3xl opacity-30 bg-[#1985A1] hidden dark:block" />

//                 <div className="relative w-full h-full rounded-full overflow-hidden ...">
//   {profile?.photos?.[0] ? (
//     <img
//       src={profile.photos[0]}
//       alt={profile.full_name}
//       className="w-full h-full object-cover"
//     />
//   ) : (
//        <div className="relative w-full h-full rounded-full bg-[#C5C3C6] dark:bg-[#46494C] border border-[#4C5C68]/30 dark:border-[#C5C3C6]/20 flex items-center justify-center backdrop-blur">
//        <div className="w-[90%] h-[90%] rounded-full bg-[#DCDCDD] dark:bg-[#4C5C68]/60 flex items-center justify-center">
//          <span className="text-[140px] sm:text-[200px] font-bold leading-none text-[#46494C] dark:text-[#DCDCDD] select-none">
//            M
//          </span>
//        </div>
//      </div>
//   )}
// </div>

//               </div>
//             </div>

//             {/* Social Icons - Endi rasmning tagida */}
//             <div
//               data-aos="fade-up"
//               data-aos-delay="400"
//               className="flex items-center gap-4 mt-10"
//             >
//               {socials.map((s, idx) => {
//                 const Icon = s.icon;
//                 return (
//                   <a
//                     key={s.name}
//                     href={s.href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     aria-label={s.name}
//                     className="w-12 h-12 rounded-2xl border border-black/10 dark:border-white/10 bg-white/45 dark:bg-white/5 backdrop-blur flex items-center justify-center text-[#4C5C68] dark:text-white/70 hover:text-[#1985A1] hover:border-[#1985A1]/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
//                   >
//                     <Icon className="text-xl" />
//                   </a>
//                 );
//               })}
//             </div>
//           </div>

//           {/* --- CHAP TOMON: TEXT INFO --- */}
//           <div className="lg:pl-2 order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
//             <div className="space-y-6">
//               {/* Name */}
//               <h1
//                 data-aos="fade-up"
//                 data-aos-delay="160"
//                 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#46494C] dark:text-[#DCDCDD]"
//               >
//                 Hi, I&apos;m{" "}
//                 <span className="text-[#1985A1]">{profile?.full_name}</span>
//               </h1>

//               {/* Animated Role */}
//               <p
//   data-aos="fade-down"
//   data-aos-delay="320"
//   className="
//     mt-2
//     text-[18px] sm:text-[20px] lg:text-[22px]
//     leading-relaxed
//     text-[#4C5C68] dark:text-white/70
//     max-w-xl
//     lg:text-left text-center
//     line-clamp-3
//   "
// >
//   {profile?.profession_add}
// </p>

//               {/* Location */}
//               <div
//                 data-aos="fade-down"
//                 data-aos-delay="320"
//                 // href="#"
//                 // href="https://maps.app.goo.gl/FMvBVQZQFJHAKpoLA"
//                 // target="_blank"
//                 // rel="noopener noreferrer"
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
//               >
//                 <RiMapPinLine className="text-[20px] text-[#1985A1]" />
//                 <span className="text-lg font-medium text-[#46494C] dark:text-[#DCDCDD]">
//                   {profile?.address}
//                 </span>
//               </div>

//               {/* Buttons */}
//               <div
//                 data-aos="fade-up"
//                 data-aos-delay="500"
//                 className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start"
//               >
//                 <a
//                   href={cvUrl}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#1985A1] text-white active:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-[#1985A1]/30"
//                 >
//                   <FiDownload className="text-[20px]" />
//                   <span>Download CV</span>
//                 </a>

//                 <a
//                   href="#about"
//                   className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold dark:bg-[#4C5C68]/40 border border-[#4C5C68]/30 dark:border-[#C5C3C6]/20 text-[#46494C] dark:text-[#DCDCDD] active:scale-95 transition-all duration-300 hover:bg-[#4C5C68]/10"
//                 >
//                   <span>Read Blog</span>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* SKILLS SECTION (Pastda alohida) */}
//         <div
//           data-aos="fade-up"
//           data-aos-delay="220"
//           className="flex flex-col md:flex-row gap-8 md:gap-20 justify-center items-center"
//         >
//           {/* Frontend */}
//           <div className="flex flex-col items-center md:items-end gap-3 text-[#46494C] dark:text-[#DCDCDD]">
//             <span className="text-2xl font-semibold text-[#1985A1] md:mr-2">
//               Skills
//             </span>
//             <div className="flex flex-wrap justify-center md:justify-end items-center gap-2">
//               {profile?.skills?.map((item, i) => (
//                 <span
//                   key={`${item}-${i}`}
//                   className="flex items-center text-[16px]"
//                 >
//                   {item}
//                   {i !== profile?.skills?.length - 1 && (
//                     <span className="mx-2 text-[#4C5C68] dark:text-[#C5C3C6]">
//                       •
//                     </span>
//                   )}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="w-24 h-[1px] md:w-[1px] md:h-20 bg-[#1985A1] opacity-50"></div>

//           {/* Backend */}
//           <div className="flex flex-col items-center md:items-start gap-3 text-[#46494C] dark:text-[#DCDCDD]">
//             <span className="text-2xl font-semibold text-[#1985A1] md:ml-2">
//               Tools
//             </span>
//             <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
//               {profile?.tools.map((item, i) => (
//                 <span
//                   key={`${item}-${i}`}
//                   className="flex items-center text-[16px]"
//                 >
//                   {item}
//                   {i !== profile?.tools.length - 1 && (
//                     <span className="mx-2 text-[#4C5C68] dark:text-[#C5C3C6]">
//                       •
//                     </span>
//                   )}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Home;
