const BASE_URL = "http://localhost:7700";


// Bu api admin paneli uchun mo'ljallangan bo'lib, admin foydalanuvchisi login va parolni yuborib, token olish uchun ishlatiladi. Agar login yoki parol noto'g'ri bo'lsa, xatolik xabarini qaytaradi. 
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



// Bu api admin panelidagi viewerlar ro'yxatini olish uchun mo'ljallangan bo'lib, token orqali autentifikatsiya qilinadi va serverdan viewerlar ma'lumotlarini JSON formatida qaytaradi.
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
  
//   Bu api admin panelidagi contact bo'limi uchun mo'ljallangan bo'lib, token orqali autentifikatsiya qilinadi va serverdan contact ma'lumotlarini JSON formatida qaytaradi.
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
  




// Bu barcha api lar
  function makeAuthHeaders(token) {
    const h = { accept: "*/*" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }
  
  export async function getProjectsAdmin(token) {
    const res = await fetch(`${BASE_URL}/projects`, {
      method: "GET",
      headers: makeAuthHeaders(token),
    });
    if (!res.ok) throw new Error("Projects olishda xatolik");
    return res.json();
  }
  
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
  
  export async function deleteProjectAdmin(token, id) {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: makeAuthHeaders(token),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || "Project o‘chirishda xatolik");
    return data;
  }



  // Experience

async function request(url, { method = "GET", token, body } = {}) {
  const headers = { accept: "*/*" };

  if (token) headers.Authorization = `Bearer ${token}`;

  // JSON yuborayotgan bo'lsang:
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Xatolik bo'lsa ham json/text ni olib ko'ramiz
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(msg);
  }

  return data;
}

// ✅ Experience admin API
export function getExperienceAdmin(token) {
  return request(`${BASE_URL}/experience`, { token });
}

export function createExperienceAdmin(token, payload) {
  return request(`${BASE_URL}/experience`, { method: "POST", token, body: payload });
}

export function updateExperienceAdmin(token, id, payload) {
  return request(`${BASE_URL}/experience/${id}`, { method: "PATCH", token, body: payload });
}

export function deleteExperienceAdmin(token, id) {
  return request(`${BASE_URL}/experience/${id}`, { method: "DELETE", token });
}



//Blog sahifasi uchun


// ✅ BLOG ADMIN API (multipart/form-data)
export function getBlogsAdmin(token) {
  return request(`${BASE_URL}/blog`, { token }); // GET public ham ishlaydi, token bo'lsa ham zarar yo'q
}

export function createBlogAdmin(token, formData) {
  return request(`${BASE_URL}/blog`, { method: "POST", token, body: formData });
}

export function updateBlogAdmin(token, id, formData) {
  return request(`${BASE_URL}/blog/${id}`, { method: "PATCH", token, body: formData });
}

export function deleteBlogAdmin(token, id) {
  return request(`${BASE_URL}/blog/${id}`, { method: "DELETE", token });
}



// Contact uchun


// Agar sendagi admin.js ichida request() allaqachon bor bo'lsa,
// shu blokni qo'shma. Faqat contact funksiyalarini qo'sh.


// ✅ CONTACT
export function getContactsAdmin(token) {
  return request(`${BASE_URL}/contact`, { token });
}

export function deleteContactAdmin(token, id) {
  return request(`${BASE_URL}/contact/${id}`, { method: "DELETE", token });
}




// Achievements uchun


export async function getAchievementsAdmin() {
  const res = await fetch(`${BASE_URL}/achievements`, { headers: { accept: "*/*" } });
  const text = await res.text();
  const data = text ? JSON.parse(text) : [];
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

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




// Main page uchun yani profiel uchun 


// ✅ MAINPAGE (PROFILE)
export async function getMainpage() {
  const res = await fetch(`${BASE_URL}/mainpage`, { headers: { accept: "*/*" } });
  const text = await res.text();
  const data = text ? JSON.parse(text) : [];
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data;
}

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
