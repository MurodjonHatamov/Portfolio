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
