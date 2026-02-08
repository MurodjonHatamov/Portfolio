export const BASE_URL = "http://localhost:7700";

export async function request(rest) {
  const res = await fetch(`${BASE_URL}${rest}`, {
    method: "GET",
    headers: { accept: "*/*" },
  });

  if (!res.ok) throw new Error(`Request failed: ${rest}`);

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/pdf")) {
    return await res.blob(); // ✅ Blob
  }

  return await res.json(); // ✅ JSON
}

export const getMainPage = () => request("/mainpage");
export const getCvBlob = () => request("/mainpage/cv");


// Bu asosan tilni tanlash uchun mo'ljallangan yordamchi funksiya bo'lib, u berilgan obyektdan (uz, en, ru) tilga mos keladigan qiymatni qaytaradi. Agar obyekt string bo'lsa, uni to'g'ridan-to'g'ri qaytaradi. Agar obyektda tilga mos keladigan qiymat topilmasa, u uz, en, ru tillaridan birini tekshiradi va topilmagan taqdirda "—" belgisi bilan almashtiradi.
export function pickLang(obj, lang) {
  if (!obj) return "—";
  if (typeof obj === "string") return obj;
  return obj?.[lang] || obj?.uz || obj?.en || obj?.ru || "—";
}

export function getLang() {
  const saved = localStorage.getItem("lang");
  if (saved === "uz" || saved === "en" || saved === "ru") return saved;
  return "uz";
}