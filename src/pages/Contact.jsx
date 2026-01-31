import React, { useEffect } from "react";
import { FiUser, FiMail, FiMessageSquare, FiSend } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";

function Contact() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
    });
  }, []);

  return (
    <section
      id="contact"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
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
        <div
          className="text-center mb-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#46494C] dark:text-[#DCDCDD]">
            Contact
          </h2>
          <p className="mt-2 text-[#4C5C68] dark:text-white/60">
            Xabar qoldiring — tez orada javob beraman
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-5">
          {/* Name */}
          <div data-aos="fade-up" data-aos-delay="200" className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4C5C68]" />
            <input
              type="text"
              placeholder="Your name"
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

          {/* Email */}
          <div data-aos="fade-up" data-aos-delay="260" className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4C5C68]" />
            <input
              type="email"
              placeholder="Email address"
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
              placeholder="Your message..."
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
            className="
              w-full mt-2
              flex items-center justify-center gap-2
              px-6 py-3 rounded-2xl
              bg-[#1985A1]
              text-white font-semibold
              hover:opacity-95
              active:scale-95
              transition-all
            "
          >
            Send message
            <FiSend />
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
