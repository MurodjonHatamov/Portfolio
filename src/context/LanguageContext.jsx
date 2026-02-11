import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const getInitialLang = () => {
    const saved = localStorage.getItem("lang");
    return ["uz", "en", "ru"].includes(saved) ? saved : "uz";
  };

  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // ✅ t(key) — statik matnlar uchun
  const t = useMemo(() => {
    return (key) => translations?.[lang]?.[key] || translations?.uz?.[key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
