import React, { useEffect, useMemo, useState } from "react";
import { FiPlus, FiRefreshCw, FiEdit2, FiTrash2, FiExternalLink, FiGithub, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getProjectsAdmin, createProjectAdmin, updateProjectAdmin, deleteProjectAdmin } from "../../api/admin";
import { getLang, pickLang } from "../../api/mainPage";
import TechBadges from "../../components/TechBadges";
import Card from "../../components/admin/Card";
import DeleteConfirm from "../../components/admin/DeleteConfirm";
import Modal from "../../components/admin/Modal";
import Input from "../../components/Input";
import Textarea from "../../components/admin/Textarea";

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








export default function Projects() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editing, setEditing] = useState(null);

  const [confirmDel, setConfirmDel] = useState(null); // project object

  // Til: admin panelda ko‘rsatishda UZ ishlatsang ham bo‘ladi
  const lang = useMemo(() => getLang(), []);

  // Form state
  const [form, setForm] = useState({
    project_name: "",
    project_url: "",
    github_url: "",
    deployed_date: "",
    technologies: "",
    desc_uz: "",
    desc_ru: "",
    desc_en: "",
    photos: [],
  });

  const resetForm = () => {
    setForm({
      project_name: "",
      project_url: "",
      github_url: "",
      deployed_date: "",
      technologies: "",
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

    // description ba’zan string bo‘ladi — shuni ham ajratib olamiz
    const d = p?.description;
    const desc_uz = typeof d === "object" ? (d?.uz || "") : (String(d || "") || "");
    const desc_ru = typeof d === "object" ? (d?.ru || "") : "";
    const desc_en = typeof d === "object" ? (d?.en || "") : "";

    setForm({
      project_name: p?.project_name || "",
      project_url: p?.project_url || "",
      github_url: p?.github_url || "",
      deployed_date: (p?.deployed_date || "").slice(0, 10),
      technologies: Array.isArray(p?.technologies) ? p.technologies.join(",") : "",
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
      const data = await getProjectsAdmin(token);
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
      const d = pickLang(p?.description, lang);
      const hay = `${p?.project_name || ""} ${d} ${(p?.technologies || []).join(" ")}`.toLowerCase();
      return hay.includes(query);
    });
  }, [rows, q, lang]);

  const submit = async () => {
    if (!token) return navigate("/admin/login");

    // minimal validation
    if (!form.project_name.trim()) return setErr("project_name majburiy");
    if (!form.project_url.trim()) return setErr("project_url majburiy");
    if (!form.github_url.trim()) return setErr("github_url majburiy");
    if (!form.deployed_date.trim()) return setErr("deployed_date majburiy");
    if (!form.desc_uz.trim() && !form.desc_en.trim() && !form.desc_ru.trim())
      return setErr("description (kamida bitta til) kerak");

    if (form.photos.length > 3) return setErr("Photos 0-3 tagacha bo‘lishi kerak");

    setErr("");

    const fd = new FormData();
    // photos (0-3)
    Array.from(form.photos || []).forEach((file) => fd.append("photos", file));

    fd.append("project_name", form.project_name.trim());

    // description — backend Swagger’da JSON string ko‘rinishida
    const descriptionObj = {
      uz: form.desc_uz || "",
      ru: form.desc_ru || "",
      en: form.desc_en || "",
    };
    fd.append("description", JSON.stringify(descriptionObj));

    fd.append("project_url", form.project_url.trim());
    fd.append("github_url", form.github_url.trim());

    const techs = form.technologies
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    fd.append("technologies", techs.join(","));

    fd.append("deployed_date", form.deployed_date);

    try {
      if (mode === "create") {
        await createProjectAdmin(token, fd);
      } else {
        await updateProjectAdmin(token, editing?._id, fd);
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
      await deleteProjectAdmin(token, confirmDel._id);
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
              Projects
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
              Add Project
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
              placeholder="Search by name / tech / description..."
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
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Tech</th>
                  <th className="py-3 px-4">Deployed</th>
                  {/* <th className="py-3 px-4">Views</th> */}
                  <th className="py-3 px-4">Links</th>
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
                        <div className="h-4 w-36 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 w-72 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 w-40 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 w-24 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 w-10 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-4 w-20 rounded bg-black/10 dark:bg-white/10 animate-pulse" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-8 w-20 rounded-2xl bg-black/10 dark:bg-white/10 animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-[#4C5C68] dark:text-white/60">
                      Hech narsa topilmadi.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const cover = p?.photos?.[0];
                    const descText = pickLang(p?.description, lang);
                    return (
                      <tr key={p._id} className="border-t border-black/5 dark:border-white/10">
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5">
                            {cover ? (
                              <img src={cover} alt={p.project_name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
                                {String(p.project_name || "P")[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
                            {p.project_name || "—"}
                          </div>
                            
                        </td>

                        <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                          {clampText(descText, 90)}
                        </td>

                        <td className="py-3 px-4">
                          <TechBadges items={p.technologies || []} />
                        </td>

                        <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                          {formatDate(p.deployed_date)}
                        </td>

                        {/* <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                          {p.views ?? 0}
                        </td> */}

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={p.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition"
                              title="Live"
                            >
                              <FiExternalLink className="text-[#1985A1]" />
                            </a>
                            <a
                              href={p.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition"
                              title="GitHub"
                            >
                              <FiGithub className="text-[#46494C] dark:text-[#DCDCDD]" />
                            </a>
                          </div>
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
          title={mode === "create" ? "Add Project" : "Edit Project"}
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
              label="Project name *"
              value={form.project_name}
              onChange={(e) => setForm((s) => ({ ...s, project_name: e.target.value }))}
              placeholder="English learning..."
            />
            <Input
              label="Deployed date *"
              type="date"
              value={form.deployed_date}
              onChange={(e) => setForm((s) => ({ ...s, deployed_date: e.target.value }))}
            />

            <Input
              label="Project URL *"
              value={form.project_url}
              onChange={(e) => setForm((s) => ({ ...s, project_url: e.target.value }))}
              placeholder="https://..."
            />
            <Input
              label="GitHub URL *"
              value={form.github_url}
              onChange={(e) => setForm((s) => ({ ...s, github_url: e.target.value }))}
              placeholder="https://github.com/..."
            />

            <div className="md:col-span-2">
              <Input
                label="Technologies (comma) *"
                value={form.technologies}
                onChange={(e) => setForm((s) => ({ ...s, technologies: e.target.value }))}
                placeholder="React,Node.js,MongoDB,Tailwind"
              />
              <p className="mt-2 text-xs text-[#4C5C68] dark:text-white/60">
                Vergul bilan yoz: <span className="font-bold">React,Node.js,MongoDB</span>
              </p>
            </div>

            <Textarea
              label="Description UZ *"
              value={form.desc_uz}
              onChange={(e) => setForm((s) => ({ ...s, desc_uz: e.target.value }))}
              placeholder="Uzbekcha qisqa ta’rif..."
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
                  Photos (0-3)
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
                  {editing.photos.slice(0, 3).map((url) => (
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
          title="Delete project?"
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
              {confirmDel?.project_name}
            </span>{" "}
            projectni o‘chirmoqchimisiz? Bu amal qaytarilmaydi.
          </p>
        </DeleteConfirm>
      </div>
    </div>
  );
}
