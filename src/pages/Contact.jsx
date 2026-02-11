  import React, { useEffect, useState } from "react";
  import {
    FiUser,
    FiMessageSquare,
    FiSend,
    FiPhone,
    FiTag,
    FiCheck,
  } from "react-icons/fi";
  import { FaGithub, FaLinkedinIn, FaInstagram, FaTelegramPlane } from "react-icons/fa";

  import AOS from "aos";
  import "aos/dist/aos.css";
  import { sendContact } from "../api/apis";
  import { useLang } from "../context/LanguageContext";


  function Contact({profile}) {
    const { t } = useLang();

    const [form, setForm] = useState({
      name: "",
      phone_tg: "",
      theme: "",
      text: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [ok, setOk] = useState(false);

    // ✅ Socials (o'zingiznikiga moslab qo'ying)

    const socials = [
      { name: "GitHub", icon: FaGithub, href: `${profile?.github}` },
      { name: "LinkedIn", icon: FaLinkedinIn, href: `${profile?.linkedin}` },
      { name: "Instagram", icon: FaInstagram, href: profile?.instagram || "https://instagram.com" },
      { name: "Telegram", icon: FaTelegramPlane, href: `${profile?.telegram}` },
    ];

    const onChange = (key) => (e) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
    };

    // ✅ error/success 3 sekunddan keyin yo'qoladi
    useEffect(() => {
      if (!error && !ok) return;

      const t = setTimeout(() => {
        setError("");
        setOk(false);
      }, 3000);

      return () => clearTimeout(t);
    }, [error, ok]);

    const onSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setOk(false);

      if (!form.name.trim() || !form.text.trim()) {
        setError(t("contact_required"));

        return;
      }

      try {
        setLoading(true);

        await sendContact({
          name: form.name.trim(),
          phone_tg: form.phone_tg.trim(),
          theme: form.theme.trim(),
          text: form.text.trim(),
        });

        setOk(true);
        setForm({ name: "", phone_tg: "", theme: "", text: "" });
      } catch (err) {
        setError(err?.message || t("error_default"));

      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      AOS.init({
        duration: 800,
        easing: "ease-out-cubic",
        once: true,
        offset: 80,
      });
      AOS.refresh();
    }, []);

    return (
      <section
        id="contact"
        className="pb-[100px] lg:pb-[0]  min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative overflow-hidden
        
        "
      >
        {/* CENTER CARD */}
        <div
          data-aos="zoom-in"
          className="
            w-full max-w-xl
            rounded-3xl p-8 sm:p-10
            bg-white/60 dark:bg-white/5
            backdrop-blur-xl
            border border-black/10 dark:border-white/10
            shadow-xl
          "
        >
          {/* Title */}
          <div className="text-center mb-8" data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#46494C] dark:text-[#DCDCDD]">
            {t("contact_title")}
            </h2>
           

            {/* ✅ Social icons */}
            <div className="mt-5 flex items-center justify-center gap-3" data-aos="fade-up" data-aos-delay="160">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className="
                      w-12 h-12 rounded-2xl
                      border border-black/10 dark:border-white/10
                      bg-white/45 dark:bg-white/5 backdrop-blur
                      flex items-center justify-center
                      text-[#4C5C68] dark:text-white/70
                      hover:text-[#1985A1] hover:border-[#1985A1]/40
                      hover:shadow-lg hover:-translate-y-1
                      active:scale-90
                      transition-all duration-300
                      cursor-pointer
                    "
                  >
                    <Icon className="text-xl" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Alerts (3s auto hide) */}
          {error && (
            <div className="mb-5 rounded-2xl p-4 border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold">
              {error}
            </div>
          )}

          {ok && (
            <div className="mb-5 rounded-2xl p-4 border border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-semibold flex items-center gap-2">
   <FiCheck /> {t("contact_sent")}

            </div>
          )}

          {/* FORM */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Name */}
            <div data-aos="fade-up" data-aos-delay="200" className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4C5C68]" />
              <input
                type="text"
                value={form.name}
                onChange={onChange("name")}
                placeholder={t("contact_name")}
                className="
                  w-full pl-11 pr-4 py-3 rounded-2xl
                  bg-transparent
                  border border-black/10 dark:border-white/10
                  text-[#46494C] dark:text-[#DCDCDD]
                  placeholder:text-[#4C5C68]/70 dark:placeholder:text-white/40
                  outline-none
                  focus:border-[#1985A1]/50
                  transition
                "
              />
            </div>

            {/* Phone / Telegram */}
            <div data-aos="fade-up" data-aos-delay="240" className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4C5C68]" />
              <input
                value={form.phone_tg}
                onChange={onChange("phone_tg")}
                type="text"
                placeholder={t("contact_phone")}
                className="
                  w-full pl-11 pr-4 py-3 rounded-2xl
                  bg-transparent
                  border border-black/10 dark:border-white/10
                  text-[#46494C] dark:text-[#DCDCDD]
                  placeholder:text-[#4C5C68]/70 dark:placeholder:text-white/40
                  outline-none
                  focus:border-[#1985A1]/50
                  transition
                "
              />
            </div>

            {/* Theme */}
            <div data-aos="fade-up" data-aos-delay="280" className="relative">
              <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4C5C68]" />
              <input
                value={form.theme}
                onChange={onChange("theme")}
                type="text"
                placeholder={t("contact_theme")}
                className="
                  w-full pl-11 pr-4 py-3 rounded-2xl
                  bg-transparent
                  border border-black/10 dark:border-white/10
                  text-[#46494C] dark:text-[#DCDCDD]
                  placeholder:text-[#4C5C68]/70 dark:placeholder:text-white/40
                  outline-none
                  focus:border-[#1985A1]/50
                  transition
                "
              />
            </div>

            {/* Message */}
            <div data-aos="fade-up" data-aos-delay="320" className="relative">
              <FiMessageSquare className="absolute left-4 top-4 text-[#4C5C68]" />
              <textarea
                rows="5"
                value={form.text}
                onChange={onChange("text")}
                placeholder={t("contact_message")}
                className="
                  w-full pl-11 pr-4 py-3 rounded-2xl resize-none
                  bg-transparent
                  border border-black/10 dark:border-white/10
                  text-[#46494C] dark:text-[#DCDCDD]
                  placeholder:text-[#4C5C68]/70 dark:placeholder:text-white/40
                  outline-none
                  focus:border-[#1985A1]/50
                  transition
                "
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full mt-2
                flex items-center justify-center gap-2
                px-6 py-3 rounded-2xl
                bg-[#1985A1]
                text-white font-semibold
                hover:opacity-95
                active:scale-95
                transition-all
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
            {loading ? t("contact_sending") : t("contact_send")}

              <FiSend />
            </button>
          </form>
        </div>
      </section>
    );
  }

  export default Contact;
