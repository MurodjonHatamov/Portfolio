import React, { useEffect, useMemo, useState } from "react";
import { FiPlus, FiRefreshCw, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Card from "../../components/admin/Card";
import Modal from "../../components/admin/Modal";
import DeleteConfirm from "../../components/admin/DeleteConfirm";
import Input from "../../components/Input"; // sendagi yo'l
import Textarea from "../../components/admin/Textarea";
import Sk from "../../components/Sk";

import { getBlogsAdmin, createBlogAdmin, updateBlogAdmin, deleteBlogAdmin } from "../../api/admin";
import { getLang, pickLang } from "../../api/mainPage";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("uz-UZ", { year: "numeric", month: "2-digit", day: "2-digit" });
  } catch {
    return iso;
  }
}

function clampText(s = "", n = 70) {
  const str = String(s || "");
  return str.length > n ? str.slice(0, n) + "…" : str;
}

export default function Blog() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editing, setEditing] = useState(null);

  const [confirmDel, setConfirmDel] = useState(null);

  const lang = useMemo(() => getLang(), []);

  const [form, setForm] = useState({
    title_uz: "",
    title_ru: "",
    title_en: "",
    desc_uz: "",
    desc_ru: "",
    desc_en: "",
    photos: [],
  });

  const resetForm = () => {
    setForm({
      title_uz: "",
      title_ru: "",
      title_en: "",
      desc_uz: "",
      desc_ru: "",
      desc_en: "",
      photos: [],
    });
  };

  const openCreate = () => {
    setMode("create");
    setEditing(null);
    resetForm();
    setOpenForm(true);
  };

  const openEdit = (p) => {
    setMode("edit");
    setEditing(p);

    // title/description ba'zida string bo'lib qolgan datalar bor (senda GET/blog ichida bor)
    const t = p?.title;
    const d = p?.description;

    const title_uz = typeof t === "object" ? (t?.uz || "") : String(t || "");
    const title_ru = typeof t === "object" ? (t?.ru || "") : "";
    const title_en = typeof t === "object" ? (t?.en || "") : "";

    const desc_uz = typeof d === "object" ? (d?.uz || "") : String(d || "");
    const desc_ru = typeof d === "object" ? (d?.ru || "") : "";
    const desc_en = typeof d === "object" ? (d?.en || "") : "";

    setForm({
      title_uz,
      title_ru,
      title_en,
      desc_uz,
      desc_ru,
      desc_en,
      photos: [],
    });

    setOpenForm(true);
  };

  const fetchAll = async () => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const data = await getBlogsAdmin(token);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((p) => {
      const title = pickLang(p?.title, lang);
      const desc = pickLang(p?.description, lang);
      const hay = `${title} ${desc}`.toLowerCase();
      return hay.includes(query);
    });
  }, [rows, q, lang]);

  const submit = async () => {
    if (!token) return navigate("/admin/login");

    // ✅ validation
    if (!form.title_uz.trim() && !form.title_en.trim() && !form.title_ru.trim())
      return setErr("Title (kamida bitta til) kerak");
    if (!form.desc_uz.trim() && !form.desc_en.trim() && !form.desc_ru.trim())
      return setErr("Description (kamida bitta til) kerak");

    if (form.photos?.length > 2) return setErr("Photos 0-2 tagacha bo‘lishi kerak");

    setErr("");

    const fd = new FormData();

    // photos (0-2)
    Array.from(form.photos || []).forEach((file) => fd.append("photos", file));

    const titleObj = { uz: form.title_uz || "", ru: form.title_ru || "", en: form.title_en || "" };
    const descObj = { uz: form.desc_uz || "", ru: form.desc_ru || "", en: form.desc_en || "" };

    // Swagger’da JSON string bo'lib ketayapti
    fd.append("title", JSON.stringify(titleObj));
    fd.append("description", JSON.stringify(descObj));

    try {
      if (mode === "create") {
        await createBlogAdmin(token, fd);
      } else {
        await updateBlogAdmin(token, editing?._id, fd);
      }
      setOpenForm(false);
      resetForm();
      await fetchAll();
    } catch (e) {
      setErr(e?.message || "Saqlashda xatolik");
    }
  };

  const doDelete = async () => {
    if (!confirmDel?._id) return;
    try {
      await deleteBlogAdmin(token, confirmDel._id);
      setConfirmDel(null);
      await fetchAll();
    } catch (e) {
      setErr(e?.message || "O‘chirishda xatolik");
    }
  };

  return (
    <div className="min-h-screen bg-[#DCDCDD]/30 dark:bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-28 md:pb-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
              Blog Posts
            </h1>
        
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchAll}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                bg-white/70 dark:bg-white/5
                border border-black/10 dark:border-white/10
                text-[#46494C] dark:text-[#DCDCDD]
                hover:bg-white/90 dark:hover:bg-white/10
                transition active:scale-95
              "
            >
              <FiRefreshCw />
              Refresh
            </button>

            <button
              onClick={openCreate}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                bg-[#1985A1] text-white
                shadow-lg shadow-[#1985A1]/20
                hover:opacity-95 transition active:scale-95
              "
            >
              <FiPlus />
              Add Post
            </button>
          </div>
        </div>

        {/* Error */}
        {err && (
          <div className="mt-6 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400">
            {err}
          </div>
        )}

        {/* Search */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex-1 px-4 py-3 rounded-2xl bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title / description..."
              className="w-full bg-transparent outline-none text-[#46494C] dark:text-[#DCDCDD]"
            />
          </div>
        </div>

        {/* Table */}
        <Card className="mt-6 p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#4C5C68] dark:text-white/60 bg-black/[0.02] dark:bg-white/[0.03]">
                  <th className="py-3 px-4 w-16">Img</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 w-24">Views</th>
                  <th className="py-3 px-4 w-32">Created</th>
                  <th className="py-3 px-4 w-28">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-t border-black/5 dark:border-white/10">
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-2xl bg-black/10 dark:bg-white/10 animate-pulse" />
                      </td>
                      <td className="py-3 px-4">
                        <Sk className="h-4 w-52 rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <Sk className="h-4 w-80 rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <Sk className="h-4 w-10 rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <Sk className="h-4 w-24 rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <Sk className="h-8 w-20 rounded-2xl" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#4C5C68] dark:text-white/60">
                      Hech narsa topilmadi.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const cover = p?.photos?.[0];
                    const titleText = pickLang(p?.title, lang);
                    const descText = pickLang(p?.description, lang);

                    return (
                      <tr key={p._id} className="border-t border-black/5 dark:border-white/10">
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5">
                            {cover ? (
                              <img src={cover} alt="cover" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
                                {String(titleText || "B")[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
                            {clampText(titleText, 60)}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                          {clampText(descText, 90)}
                        </td>

                        <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                          {p?.views ?? 0}
                        </td>

                        <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                          {formatDate(p?.createdAt)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              className="p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition active:scale-95"
                              title="Edit"
                            >
                              <FiEdit2 className="text-[#4C5C68] dark:text-white/70" />
                            </button>
                            <button
                              onClick={() => setConfirmDel(p)}
                              className="p-2 rounded-2xl hover:bg-red-500/10 transition active:scale-95"
                              title="Delete"
                            >
                              <FiTrash2 className="text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          open={openForm}
          title={mode === "create" ? "Add Blog Post" : "Edit Blog Post"}
          onClose={() => setOpenForm(false)}
          footer={
            <>
              <button
                onClick={() => setOpenForm(false)}
                className="
                  px-4 py-2 rounded-2xl
                  bg-white/70 dark:bg-white/5
                  border border-black/10 dark:border-white/10
                  text-[#46494C] dark:text-[#DCDCDD]
                  hover:bg-white/90 dark:hover:bg-white/10
                  transition active:scale-95
                "
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="
                  px-4 py-2 rounded-2xl
                  bg-[#1985A1] text-white
                  shadow-lg shadow-[#1985A1]/20
                  hover:opacity-95 transition active:scale-95
                "
              >
                Save
              </button>
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title UZ *"
              value={form.title_uz}
              onChange={(e) => setForm((s) => ({ ...s, title_uz: e.target.value }))}
              placeholder="Blog sarlavhasi..."
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
              placeholder="Blog title..."
            />

            <Textarea
              label="Description UZ *"
              value={form.desc_uz}
              onChange={(e) => setForm((s) => ({ ...s, desc_uz: e.target.value }))}
              placeholder="Blog matni..."
            />
            <Textarea
              label="Description RU"
              value={form.desc_ru}
              onChange={(e) => setForm((s) => ({ ...s, desc_ru: e.target.value }))}
              placeholder="Содержание..."
            />
            <Textarea
              label="Description EN"
              value={form.desc_en}
              onChange={(e) => setForm((s) => ({ ...s, desc_en: e.target.value }))}
              placeholder="Blog content..."
            />

            <div className="md:col-span-2">
              <label className="block">
                <span className="block text-xs font-bold text-[#4C5C68] dark:text-white/60 mb-2">
                  Photos (0-2)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setForm((s) => ({ ...s, photos: e.target.files }))}
                  className="
                    w-full px-4 py-3 rounded-2xl
                    bg-white/70 dark:bg-white/5
                    border border-black/10 dark:border-white/10
                    text-[#46494C] dark:text-[#DCDCDD]
                  "
                />
                <p className="mt-2 text-xs text-[#4C5C68] dark:text-white/60">
                  {form.photos?.length ? `${form.photos.length} ta tanlandi` : "Hozircha rasm tanlanmadi"}
                </p>
              </label>

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
        </Modal>

        {/* Delete confirm */}
        <DeleteConfirm
          open={!!confirmDel}
          title="Delete blog post?"
          onClose={() => setConfirmDel(null)}
          footer={
            <>
              <button
                onClick={() => setConfirmDel(null)}
                className="
                  px-4 py-2 rounded-2xl
                  bg-white/70 dark:bg-white/5
                  border border-black/10 dark:border-white/10
                  text-[#46494C] dark:text-[#DCDCDD]
                  hover:bg-white/90 dark:hover:bg-white/10
                  transition active:scale-95
                "
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="
                  px-4 py-2 rounded-2xl
                  bg-red-500 text-white
                  shadow-lg shadow-red-500/20
                  hover:opacity-95 transition active:scale-95
                "
              >
                Delete
              </button>
            </>
          }
        >
          <p className="text-sm text-[#4C5C68] dark:text-white/70">
            <span className="font-bold text-[#46494C] dark:text-[#DCDCDD]">
              {clampText(pickLang(confirmDel?.title, lang), 60)}
            </span>{" "}
            postni o‘chirmoqchimisiz? Bu amal qaytarilmaydi.
          </p>
        </DeleteConfirm>
      </div>
    </div>
  );
}
