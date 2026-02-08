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