/**
 * admin.js
 * Portfolio admin panel API helperlari (fetch orqali).
 * ✅ Koding o‘zgarmadi: faqat tartib/bo‘limlar/izohlar chiroyli qilindi.
 */

const BASE_URL = "http://localhost:7700";

/* =========================================================
   AUTH (LOGIN)
========================================================= */

// Bu api admin paneli uchun mo'ljallangan bo'lib, admin foydalanuvchisi login va parolni yuborib,
// token olish uchun ishlatiladi. Agar login yoki parol noto'g'ri bo'lsa, xatolik xabarini qaytaradi.
export async function loginAdmin({ login, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
    },
    body: JSON.stringify({
      login,
      password,
    }),
  });

  // ❗ agar login xato bo‘lsa backend 400 qaytaradi
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login yoki parol noto‘g‘ri");
  }

  // 🔴 ENG MUHIM JOY
  // backend JSON emas — STRING TOKEN qaytaradi
  const token = await res.text();

  return token;
}

/* =========================================================
   VIEWERS
========================================================= */

// Bu api admin panelidagi viewerlar ro'yxatini olish uchun mo'ljallangan bo'lib,
// token orqali autentifikatsiya qilinadi va serverdan viewerlar ma'lumotlarini JSON formatida qaytaradi.
export async function getViewersAdmin(token) {
  const res = await fetch(`${BASE_URL}/viewers`, {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Viewers olishda xatolik");
  return res.json(); // array
}

/* =========================================================
   CONTACT (MESSAGES)
========================================================= */

// Bu api admin panelidagi contact bo'limi uchun mo'ljallangan bo'lib,
// token orqali autentifikatsiya qilinadi va serverdan contact ma'lumotlarini JSON formatida qaytaradi.
export async function getMessagesAdmin(token) {
  const res = await fetch(`${BASE_URL}/contact`, {
    method: "GET",
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Messages olishda xatolik");
  return res.json(); // array
}

/* =========================================================
   PROJECTS
========================================================= */

// Bu barcha api lar
function makeAuthHeaders(token) {
  const h = { accept: "*/*" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

// Projectlarni olish (GET /projects)
export async function getProjectsAdmin(token) {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: "GET",
    headers: makeAuthHeaders(token),
  });

  if (!res.ok) throw new Error("Projects olishda xatolik");
  return res.json();
}

// Project qo‘shish (POST /projects) — FormData bilan
export async function createProjectAdmin(token, formData) {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: makeAuthHeaders(token), // ⚠️ Content-Type qo‘ymaymiz (FormData o‘zi qo‘yadi)
    body: formData,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Project qo‘shishda xatolik");
  return data;
}

// Project tahrirlash (PATCH /projects/:id) — FormData bilan
export async function updateProjectAdmin(token, id, formData) {
  const res = await fetch(`${BASE_URL}/projects/${id}`, {
    method: "PATCH",
    headers: makeAuthHeaders(token),
    body: formData,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Project tahrirlashda xatolik");
  return data;
}

// Project o‘chirish (DELETE /projects/:id)
export async function deleteProjectAdmin(token, id) {
  const res = await fetch(`${BASE_URL}/projects/${id}`, {
    method: "DELETE",
    headers: makeAuthHeaders(token),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Project o‘chirishda xatolik");
  return data;
}

/* =========================================================
   UNIVERSAL REQUEST (JSON + FormData + Token)
========================================================= */

// ✅ Universal request: JSON ham, FormData ham, token ham
async function request(pathOrUrl, { method = "GET", token, body } = {}) {
  // path kelsa: "/blog" -> BASE_URL + path
  const url = String(pathOrUrl).startsWith("http")
    ? pathOrUrl
    : `${BASE_URL}${pathOrUrl}`;

  const headers = { accept: "*/*" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const isFormData = body instanceof FormData;

  // JSON bo'lsa Content-Type qo'yamiz, FormData bo'lsa qo'ymaymiz
  if (body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    body:
      body === undefined
        ? undefined
        : isFormData
        ? body
        : JSON.stringify(body),
  });

  const text = await res.text();

  // JSON bo'lsa parse qiladi, bo'lmasa text qaytaradi
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

/* =========================================================
   EXPERIENCE
========================================================= */

// ✅ Experience admin API
export const getExperienceAdmin = (token) => request("/experience", { token });

export const createExperienceAdmin = (token, payload) =>
  request("/experience", { method: "POST", token, body: payload });

export const updateExperienceAdmin = (token, id, payload) =>
  request(`/experience/${id}`, { method: "PATCH", token, body: payload });

export const deleteExperienceAdmin = (token, id) =>
  request(`/experience/${id}`, { method: "DELETE", token });

/* =========================================================
   BLOG
========================================================= */

// BLOG
export const getBlogsAdmin = (token) => request("/blog", { token });

export const getBlogByIdAdmin = (token, id) =>
  request(`/blog/${id}`, { token });

export const createBlogAdmin = (token, formData) =>
  request("/blog", { method: "POST", token, body: formData });

export const updateBlogAdmin = (token, id, formData) =>
  request(`/blog/${id}`, { method: "PATCH", token, body: formData });

export const deleteBlogAdmin = (token, id) =>
  request(`/blog/${id}`, { method: "DELETE", token });

// Textni xavfsiz stringga aylantirib beradi
export function safeText(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  // object bo'lsa (uz/ru/en) — fallback qilib qiymatlarni qo'shib yuboramiz
  if (typeof v === "object") return String(v.uz || v.en || v.ru || "");
  return String(v);
}

// Textni so‘z bo‘yicha kesib beradi (limit = 6 default)
export function truncateWords(text, limit = 6) {
  const s = safeText(text);
  const words = s.trim().split(/\s+/).filter(Boolean);
  if (words.length <= limit) return s;
  return words.slice(0, limit).join(" ") + "…";
}

/* =========================================================
   CONTACT (GET + DELETE)
========================================================= */

// ✅ CONTACT
export function getContactsAdmin(token) {
  return request(`${BASE_URL}/contact`, { token });
}

export function deleteContactAdmin(token, id) {
  return request(`${BASE_URL}/contact/${id}`, { method: "DELETE", token });
}

/* =========================================================
   ACHIEVEMENTS
========================================================= */

// Achievements ro‘yxatini olish (GET /achievements)
export async function getAchievementsAdmin() {
  const res = await fetch(`${BASE_URL}/achievements`, {
    headers: { accept: "*/*" },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : [];
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

// Achievement qo‘shish (POST /achievements) — FormData bilan
export async function createAchievementAdmin(token, formData) {
  const res = await fetch(`${BASE_URL}/achievements`, {
    method: "POST",
    headers: { accept: "*/*", Authorization: `Bearer ${token}` },
    body: formData,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

// Achievement update (PATCH /achievements/:id) — FormData bilan
export async function updateAchievementAdmin(token, id, formData) {
  const res = await fetch(`${BASE_URL}/achievements/${id}`, {
    method: "PATCH",
    headers: { accept: "*/*", Authorization: `Bearer ${token}` },
    body: formData,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

// Achievement delete (DELETE /achievements/:id)
export async function deleteAchievementAdmin(token, id) {
  const res = await fetch(`${BASE_URL}/achievements/${id}`, {
    method: "DELETE",
    headers: { accept: "*/*", Authorization: `Bearer ${token}` },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

/* =========================================================
   MAINPAGE (PROFILE)
========================================================= */

// Main page ma’lumotlarini olish (GET /mainpage)
export async function getMainpage() {
  const res = await fetch(`${BASE_URL}/mainpage`, {
    headers: { accept: "*/*" },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : [];
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

// Main page update qilish (PATCH /mainpage/:id) — FormData bilan
export async function updateMainpage(token, id, formData) {
  const res = await fetch(`${BASE_URL}/mainpage/${id}`, {
    method: "PATCH",
    headers: { accept: "*/*", Authorization: `Bearer ${token}` },
    body: formData,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

// (ixtiyoriy) CV linkini olish uchun
export function getMainpageCvUrl() {
  return `${BASE_URL}/mainpage/cv`;
}
