import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import Card from "../../components/admin/Card";
import Input from "../../components/Input";
import DeleteConfirm from "../../components/admin/DeleteConfirm";
import QuillEditor from "../../components/admin/QuillEditor"; // sen yozgan file
import { getLang, pickLang } from "../../api/mainPage";
import { createBlogAdmin, updateBlogAdmin } from "../../api/admin";
import { safeText } from "../../api/admin";

export default function AddBlog() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const lang = useMemo(() => getLang(), []);

  const { state } = useLocation();
  const editing = state?.edit || null; // Blog.jsx dan keladi

  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title_uz: "",
    title_ru: "",
    title_en: "",
    desc_uz: "",
    desc_ru: "",
    desc_en: "",
    photos: [],
  });

  useEffect(() => {
    if (!editing) return;

    const t = editing?.title;
    const d = editing?.description;

    setForm({
      title_uz: typeof t === "object" ? (t?.uz || "") : safeText(t),
      title_ru: typeof t === "object" ? (t?.ru || "") : "",
      title_en: typeof t === "object" ? (t?.en || "") : "",
      desc_uz: typeof d === "object" ? (d?.uz || "") : safeText(d),
      desc_ru: typeof d === "object" ? (d?.ru || "") : "",
      desc_en: typeof d === "object" ? (d?.en || "") : "",
      photos: [],
    });
  }, [editing]);

  const submit = async () => {
    if (!token) return navigate("/admin/login");

    // validation
    if (!form.title_uz.trim() && !form.title_en.trim() && !form.title_ru.trim()) {
      return setErr("Title (kamida bitta til) kerak");
    }
    if (!form.desc_uz.trim() && !form.desc_en.trim() && !form.desc_ru.trim()) {
      return setErr("Description (kamida bitta til) kerak");
    }
    if (form.photos?.length > 2) return setErr("Photos 0-2 tagacha bo‘lishi kerak");

    setErr("");
    setSaving(true);

    const fd = new FormData();
    Array.from(form.photos || []).forEach((f) => fd.append("photos", f));

    const titleObj = { uz: form.title_uz || "", ru: form.title_ru || "", en: form.title_en || "" };
    const descObj = { uz: form.desc_uz || "", ru: form.desc_ru || "", en: form.desc_en || "" };

    fd.append("title", JSON.stringify(titleObj));
    fd.append("description", JSON.stringify(descObj));

    try {
      if (editing?._id) {
        await updateBlogAdmin(token, editing._id, fd);
      } else {
        await createBlogAdmin(token, fd);
      }
      navigate("/admin/blog");
    } catch (e) {
      setErr(e?.message || "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DCDCDD]/30 dark:bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-28 md:pb-10">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl
              bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10
              text-[#46494C] dark:text-[#DCDCDD] hover:bg-white/90 dark:hover:bg-white/10 transition active:scale-95"
          >
            <FiArrowLeft />
            Back
          </button>

          <button
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl
              bg-[#1985A1] text-white shadow-lg shadow-[#1985A1]/20
              hover:opacity-95 transition active:scale-95 disabled:opacity-60"
          >
            <FiSave />
            {saving ? "Saving..." : editing ? "Update" : "Create"}
          </button>
        </div>

        {err && (
          <div className="mt-6 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400">
            {err}
          </div>
        )}

        <Card className="mt-6">
          <h1 className="text-2xl font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
            {editing ? "Edit Blog" : "Add Blog"}
          </h1>
        

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Title UZ"
              value={form.title_uz}
              onChange={(e) => setForm((s) => ({ ...s, title_uz: e.target.value }))}
              placeholder="Sarlavha..."
            />
            <Input
              label="Title RU"
              value={form.title_ru}
              onChange={(e) => setForm((s) => ({ ...s, title_ru: e.target.value }))}
              placeholder="Заголовок..."
            />
            <Input
              label="Title EN"
              value={form.title_en}
              onChange={(e) => setForm((s) => ({ ...s, title_en: e.target.value }))}
              placeholder="Title..."
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6">
            <div>
              <p className="text-xs font-bold text-[#4C5C68] dark:text-white/60 mb-2">Description UZ</p>
              <QuillEditor value={form.desc_uz} onChange={(v) => setForm((s) => ({ ...s, desc_uz: v }))} />
            </div>

            <div>
              <p className="text-xs font-bold text-[#4C5C68] dark:text-white/60 mb-2">Description RU</p>
              <QuillEditor value={form.desc_ru} onChange={(v) => setForm((s) => ({ ...s, desc_ru: v }))} />
            </div>

            <div>
              <p className="text-xs font-bold text-[#4C5C68] dark:text-white/60 mb-2">Description EN</p>
              <QuillEditor value={form.desc_en} onChange={(v) => setForm((s) => ({ ...s, desc_en: v }))} />
            </div>

            <div>
              <p className="text-xs font-bold text-[#4C5C68] dark:text-white/60 mb-2">Photos (0-2)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setForm((s) => ({ ...s, photos: e.target.files }))}
                className="w-full px-4 py-3 rounded-2xl
                  bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10
                  text-[#46494C] dark:text-[#DCDCDD]"
              />
              <p className="mt-2 text-xs text-[#4C5C68] dark:text-white/60">
                {form.photos?.length ? `${form.photos.length} ta tanlandi` : "Hozircha rasm tanlanmadi"}
              </p>

              {editing?.photos?.length ? (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {editing.photos.slice(0, 2).map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt="old"
                      className="w-16 h-16 rounded-2xl object-cover border border-black/10 dark:border-white/10"
                      loading="lazy"
                    />
                  ))}
                  <p className="text-xs text-[#4C5C68] dark:text-white/60 self-center">
                    (Edit’da eski rasmlar qoladi, yangi tanlasang yangilanadi)
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
