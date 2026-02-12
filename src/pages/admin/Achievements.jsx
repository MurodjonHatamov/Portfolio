import React, { useEffect, useMemo, useState } from "react";
import { FiPlus, FiRefreshCw, FiEdit2, FiTrash2, FiExternalLink } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Card from "../../components/admin/Card";
import DeleteConfirm from "../../components/admin/DeleteConfirm";
import Modal from "../../components/admin/Modal";
import Input from "../../components/Input";
import Textarea from "../../components/admin/Textarea";
import Sk from "../../components/Sk";

import { getLang, pickLang } from "../../api/mainPage";
import {
  getAchievementsAdmin,
  createAchievementAdmin,
  updateAchievementAdmin,
  deleteAchievementAdmin,
} from "../../api/admin";

const FALLBACK_IMG = "https://via.placeholder.com/200x140?text=No+Image";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("uz-UZ", { year: "numeric", month: "2-digit", day: "2-digit" });
  } catch {
    return String(iso);
  }
}

function clampText(s = "", n = 80) {
  const str = String(s || "");
  return str.length > n ? str.slice(0, n) + "…" : str;
}

export default function Achievements() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const lang = useMemo(() => getLang(), []);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editing, setEditing] = useState(null);

  const [confirmDel, setConfirmDel] = useState(null);

  const [form, setForm] = useState({
    name_uz: "",
    name_ru: "",
    name_en: "",
    desc_uz: "",
    desc_ru: "",
    desc_en: "",
    url: "",
    date: "",
    photo: null, // single file
  });

  const resetForm = () => {
    setForm({
      name_uz: "",
      name_ru: "",
      name_en: "",
      desc_uz: "",
      desc_ru: "",
      desc_en: "",
      url: "",
      date: "",
      photo: null,
    });
  };

  const openCreate = () => {
    setMode("create");
    setEditing(null);
    resetForm();
    setOpenForm(true);
  };

  const openEdit = (a) => {
    setMode("edit");
    setEditing(a);

    const n = a?.name;
    const d = a?.description;

    setForm({
      name_uz: typeof n === "object" ? (n?.uz || "") : String(n || ""),
      name_ru: typeof n === "object" ? (n?.ru || "") : "",
      name_en: typeof n === "object" ? (n?.en || "") : "",

      desc_uz: typeof d === "object" ? (d?.uz || "") : String(d || ""),
      desc_ru: typeof d === "object" ? (d?.ru || "") : "",
      desc_en: typeof d === "object" ? (d?.en || "") : "",

      url: a?.url || "",
      date: (a?.date || "").slice(0, 10),
      photo: null, // yangi tanlasa yangilanadi
    });

    setOpenForm(true);
  };

  const fetchAll = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await getAchievementsAdmin();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Achievements olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((a) => {
      const nameText = pickLang(a?.name, lang);
      const descText = pickLang(a?.description, lang);
      const hay = `${nameText} ${descText} ${a?.url || ""} ${a?.date || ""}`.toLowerCase();
      return hay.includes(query);
    });
  }, [rows, q, lang]);

  const submit = async () => {
    if (!token) return navigate("/admin/login");

    // minimal validation
    if (!form.name_uz.trim() && !form.name_en.trim() && !form.name_ru.trim()) {
      return setErr("name (kamida bitta til) majburiy");
    }
    if (!form.desc_uz.trim() && !form.desc_en.trim() && !form.desc_ru.trim()) {
      return setErr("description (kamida bitta til) majburiy");
    }
    if (!form.date.trim()) return setErr("date majburiy");

    setErr("");

    const fd = new FormData();

    // swagger: name va description JSON string bo‘lib ketadi
    fd.append(
      "name",
      JSON.stringify({
        uz: form.name_uz || "",
        ru: form.name_ru || "",
        en: form.name_en || "",
      })
    );

    fd.append(
      "description",
      JSON.stringify({
        uz: form.desc_uz || "",
        ru: form.desc_ru || "",
        en: form.desc_en || "",
      })
    );

    if (form.photo) {
      // swagger: photos (single file) — field nomi "photos"
      fd.append("photos", form.photo);
    }

    if (form.url?.trim()) fd.append("url", form.url.trim());
    fd.append("date", form.date); // "2025-10-15"

    try {
      if (mode === "create") {
        await createAchievementAdmin(token, fd);
      } else {
        await updateAchievementAdmin(token, editing?._id, fd);
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
      await deleteAchievementAdmin(token, confirmDel._id);
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
              Achievements
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
              Add
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
          <div
            className="
              flex-1 px-4 py-3 rounded-2xl
              bg-white/70 dark:bg-white/5
              border border-black/10 dark:border-white/10
            "
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name / description / url..."
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
                  <th className="py-3 px-4 w-20">Img</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Url</th>
                  <th className="py-3 px-4 w-28">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-black/5 dark:border-white/10">
                      <td className="py-3 px-4"><Sk className="w-14 h-10 rounded-2xl" /></td>
                      <td className="py-3 px-4"><Sk className="h-4 w-48 rounded" /></td>
                      <td className="py-3 px-4"><Sk className="h-4 w-80 rounded" /></td>
                      <td className="py-3 px-4"><Sk className="h-4 w-24 rounded" /></td>
                      <td className="py-3 px-4"><Sk className="h-4 w-28 rounded" /></td>
                      <td className="py-3 px-4"><Sk className="h-8 w-20 rounded-2xl" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#4C5C68] dark:text-white/60">
                      Hech narsa topilmadi.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => {
                    const img = a?.photos || FALLBACK_IMG;
                    const nameText = pickLang(a?.name, lang);
                    const descText = pickLang(a?.description, lang);

                    return (
                      <tr key={a._id} className="border-t border-black/5 dark:border-white/10">
                        <td className="py-3 px-4">
                          <div className="w-14 h-10 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5">
                            <img src={img} alt="cert" className="w-full h-full object-cover" />
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
                            {nameText || "—"}
                          </div>
                        
                        </td>

                        <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                          {clampText(descText, 95)}
                        </td>

                        <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                          {formatDate(a?.date)}
                        </td>

                        <td className="py-3 px-4">
                          {a?.url ? (
                            <a
                              href={a.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-[#1985A1] hover:underline"
                              title="Open url"
                            >
                              <FiExternalLink />
                              <span className="text-xs font-semibold">Open</span>
                            </a>
                          ) : (
                            <span className="text-[#4C5C68] dark:text-white/60">—</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(a)}
                              className="p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition active:scale-95"
                              title="Edit"
                            >
                              <FiEdit2 className="text-[#4C5C68] dark:text-white/70" />
                            </button>
                            <button
                              onClick={() => setConfirmDel(a)}
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
          title={mode === "create" ? "Add Achievement" : "Edit Achievement"}
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
              label="Name UZ *"
              value={form.name_uz}
              onChange={(e) => setForm((s) => ({ ...s, name_uz: e.target.value }))}
              placeholder="Najot Ta'lim bitiruv sertifikati"
            />
            <Input
              label="Date *"
              type="date"
              value={form.date}
              onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
            />

            <Input
              label="Name RU"
              value={form.name_ru}
              onChange={(e) => setForm((s) => ({ ...s, name_ru: e.target.value }))}
              placeholder="Выпускной сертификат..."
            />
            <Input
              label="Name EN"
              value={form.name_en}
              onChange={(e) => setForm((s) => ({ ...s, name_en: e.target.value }))}
              placeholder="Graduation certificate..."
            />

            <div className="md:col-span-2">
              <Input
                label="Url"
                value={form.url}
                onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <Textarea
              label="Description UZ *"
              value={form.desc_uz}
              onChange={(e) => setForm((s) => ({ ...s, desc_uz: e.target.value }))}
              placeholder="Uzbekcha ta’rif..."
            />
            <Textarea
              label="Description RU"
              value={form.desc_ru}
              onChange={(e) => setForm((s) => ({ ...s, desc_ru: e.target.value }))}
              placeholder="Русское описание..."
            />
            <Textarea
              label="Description EN"
              value={form.desc_en}
              onChange={(e) => setForm((s) => ({ ...s, desc_en: e.target.value }))}
              placeholder="English description..."
            />

            <div className="md:col-span-2">
              <label className="block">
                <span className="block text-xs font-bold text-[#4C5C68] dark:text-white/60 mb-2">
                  Photo (1 ta) {mode === "create" ? "*" : "(ixtiyoriy)"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm((s) => ({ ...s, photo: e.target.files?.[0] || null }))}
                  className="
                    w-full px-4 py-3 rounded-2xl
                    bg-white/70 dark:bg-white/5
                    border border-black/10 dark:border-white/10
                    text-[#46494C] dark:text-[#DCDCDD]
                  "
                />
                <p className="mt-2 text-xs text-[#4C5C68] dark:text-white/60">
                  {form.photo ? `Tanlandi: ${form.photo.name}` : "Hozircha rasm tanlanmadi"}
                </p>
              </label>

              {mode === "edit" && editing?.photos ? (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={editing.photos || FALLBACK_IMG}
                    alt="old"
                    className="w-24 h-16 rounded-2xl object-cover border border-black/10 dark:border-white/10"
                    loading="lazy"
                  />
                  <p className="text-xs text-[#4C5C68] dark:text-white/60">
                    (Edit’da eski rasm qoladi, yangi tanlasang yangilanadi)
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </Modal>

        {/* Delete confirm */}
        <DeleteConfirm
          open={!!confirmDel}
          title="Delete achievement?"
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
              {pickLang(confirmDel?.name, lang) || "Achievement"}
            </span>{" "}
            ni o‘chirmoqchimisiz? Bu amal qaytarilmaydi.
          </p>
        </DeleteConfirm>
      </div>
    </div>
  );
}
