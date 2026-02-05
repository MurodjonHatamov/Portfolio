import { PiUserCheckDuotone } from "react-icons/pi";

export const BASE_URL = "http://localhost:7700";



// Bu api lohalr uchun mo'ljallangan bo'lib, loyihalar ro'yxatini olish uchun ishlatiladi.
export async function getProjects() {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: "GET",
    headers: { accept: "*/*" },
  });

  if (!res.ok) throw new Error("Projects olishda xatolik");
  return res.json(); // array
}


// Bu api tajriba (experience) bo'limi uchun mo'ljallangan bo'lib, tajribalar ro'yxatini olish uchun ishlatiladi.
export async function getExperience() {
  const res = await fetch(`${BASE_URL}/experience`, {
    method: "GET",
    headers: { accept: "*/*" },
  });

  if (!res.ok) throw new Error("Experience olishda xatolik");
  return res.json(); // array
}



// Bu api aloqa (contact) bo'limi uchun mo'ljallangan bo'lib, foydalanuvchidan olingan xabarni serverga yuborish uchun ishlatiladi.
export async function sendContact(payload) {
  const res = await fetch(`${BASE_URL}/contact/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
    },
    body: JSON.stringify(payload),
  });

  // server json qaytaradi
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message || "Xabar yuborishda xatolik";
    throw new Error(msg);
  }

  return data; // {name, phone_tg, theme, text, _id...}
}




// Bu api blog bo'limi uchun mo'ljallangan bo'lib, blog postlarini olish uchun ishlatiladi.

export async function getBlogs() {
  const res = await fetch(`${BASE_URL}/blog`, {
    method: "GET",
    headers: { accept: "*/*" },
  });
  if (!res.ok) throw new Error("Bloglarni olishda xatolik");
  return res.json(); // array
}

export async function getBlogById(id) {
  const res = await fetch(`${BASE_URL}/blog/${id}`, {
    method: "GET",
    headers: { accept: "*/*" },
  });
  if (!res.ok) throw new Error("Blogni olishda xatolik");
  return res.json(); // object
}

// Bu api yutuqlar (achievements) bo'limi uchun mo'ljallangan bo'lib, yutuqlar ro'yxatini olish uchun ishlatiladi.
export async function getAchievements() {
  const res = await fetch(`${BASE_URL}/achievements`, {
    method: "GET",
    headers: { accept: "*/*" },
  });
  if (!res.ok) throw new Error("Achievements olishda xatolik");
  return res.json();
}