import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiRefreshCw, FiSave, FiExternalLink } from "react-icons/fi";

import Card from "../../components/admin/Card";
import Input from "../../components/Input";
import Textarea from "../../components/admin/Textarea";
import Sk from "../../components/Sk";

import { getLang, pickLang } from "../../api/mainPage";
import { getMainpage, updateMainpage, getMainpageCvUrl } from "../../api/admin";

const FALLBACK_IMG = "https://via.placeholder.com/300x300?text=No+Photo";

function splitComma(s = "") {
  return String(s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const lang = useMemo(() => getLang(), []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [profile, setProfile] = useState(null); // server object
  const [form, setForm] = useState({
    full_name: "",
    address: "",
    github: "",
    telegram: "",
    linkedin: "",

    profession_uz: "",
    profession_ru: "",
    profession_en: "",

    professionAdd_uz: "",
    professionAdd_ru: "",
    professionAdd_en: "",

    skills: "", // comma string
    tools: "",  // comma string

    photo: null, // file
    cv: null,    // file
  });

  const resetToast = () => {
    setOk("");
    setErr("");
  };

  const fetchData = async () => {
    resetToast();
    setLoading(true);
    try {
      const data = await getMainpage(); // array
      const one = Array.isArray(data) ? data[0] : null;
      setProfile(one || null);

      if (one) {
        const prof = one?.profession;
        const profAdd = one?.profession_add;

        setForm({
          full_name: one?.full_name || "",
          address: one?.address || "",
          github: one?.github || "",
          telegram: one?.telegram || "",
          linkedin: one?.linkedin || "",

          profession_uz: typeof prof === "object" ? (prof?.uz || "") : String(prof || ""),
          profession_ru: typeof prof === "object" ? (prof?.ru || "") : "",
          profession_en: typeof prof === "object" ? (prof?.en || "") : "",

          professionAdd_uz: typeof profAdd === "object" ? (profAdd?.uz || "") : String(profAdd || ""),
          professionAdd_ru: typeof profAdd === "object" ? (profAdd?.ru || "") : "",
          professionAdd_en: typeof profAdd === "object" ? (profAdd?.en || "") : "",

          skills: Array.isArray(one?.skills) ? one.skills.join(",") : "",
          tools: Array.isArray(one?.tools) ? one.tools.join(",") : "",

          photo: null,
          cv: null,
        });
      }
    } catch (e) {
      setErr(e?.message || "Profile olishda xatolik");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    resetToast();

    if (!token) return navigate("/admin/login");
    if (!profile?._id) return setErr("Profile ID topilmadi (mainpage bo‘sh)");

    // minimal validation
    if (!form.full_name.trim()) return setErr("full_name majburiy");
    if (!form.profession_uz.trim() && !form.profession_en.trim() && !form.profession_ru.trim())
      return setErr("profession (kamida bitta til) majburiy");

    setSaving(true);

    try {
      const fd = new FormData();

      fd.append("full_name", form.full_name.trim());
      if (form.address?.trim()) fd.append("address", form.address.trim());
      if (form.github?.trim()) fd.append("github", form.github.trim());
      if (form.telegram?.trim()) fd.append("telegram", form.telegram.trim());
      if (form.linkedin?.trim()) fd.append("linkedin", form.linkedin.trim());

      // JSON string fields
      fd.append(
        "profession",
        JSON.stringify({
          uz: form.profession_uz || "",
          ru: form.profession_ru || "",
          en: form.profession_en || "",
        })
      );

      fd.append(
        "profession_add",
        JSON.stringify({
          uz: form.professionAdd_uz || "",
          ru: form.professionAdd_ru || "",
          en: form.professionAdd_en || "",
        })
      );

      // array fields: eng to‘g‘ri usul — har bir itemni alohida append
      splitComma(form.skills).forEach((x) => fd.append("skills", x));
      splitComma(form.tools).forEach((x) => fd.append("tools", x));

      // files
      if (form.photo) fd.append("photos", form.photo); // API: photos (binary)
      if (form.cv) fd.append("cv", form.cv);           // API: cv (binary)

      const updated = await updateMainpage(token, profile._id, fd);
      setOk("✅ Saqlandi!");
      setProfile(updated);

      // formni qayta to‘ldirib yuboramiz (serverdan)
      await fetchData();
    } catch (e) {
      setErr(e?.message || "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const currentName = useMemo(() => pickLang(profile?.profession, lang), [profile, lang]);
  const currentAdd = useMemo(() => pickLang(profile?.profession_add, lang), [profile, lang]);

  return (
    <div className="min-h-screen bg-[#DCDCDD]/30 dark:bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-28 md:pb-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
              Profile
            </h1>
          
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchData}
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
              onClick={submit}
              disabled={saving || loading}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                bg-[#1985A1] text-white
                shadow-lg shadow-[#1985A1]/20
                hover:opacity-95 transition active:scale-95
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              <FiSave />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Alerts */}
        {err && (
          <div className="mt-6 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400">
            {err}
          </div>
        )}
        {ok && (
          <div className="mt-6 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {ok}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <Card className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Sk className="h-60 rounded-3xl" />
              <div className="md:col-span-2 space-y-3">
                <Sk className="h-10 rounded-2xl" />
                <Sk className="h-10 rounded-2xl" />
                <Sk className="h-24 rounded-2xl" />
              </div>
            </div>
          </Card>
        ) : !profile ? (
          <Card className="mt-6">
            <div className="text-[#4C5C68] dark:text-white/60">
              Mainpage profili topilmadi. Backend’da /mainpage ichida 1ta document bo‘lishi kerak.
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left preview */}
            <Card className="lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
                    Preview
                  </h2>
              
                </div>

                {profile?.cv ? (
                  <a
                    href={getMainpageCvUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#1985A1] text-sm font-semibold hover:underline"
                    title="Download CV"
                  >
                    <FiExternalLink />
                    CV
                  </a>
                ) : null}
              </div>

              <div className="mt-4 rounded-3xl overflow-hidden border border-black/10 dark:border-white/10">
                <img
                  src={profile?.photos?.[0] || FALLBACK_IMG}
                  alt="profile"
                  className="w-full h-60 object-cover"
                />
              </div>

              <div className="mt-4">
                <div className="text-xl font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
                  {profile.full_name}
                </div>
                <div className="mt-1 text-sm text-[#4C5C68] dark:text-white/70">
                  {currentName}
                </div>
                <div className="mt-2 text-sm text-[#4C5C68] dark:text-white/70">
                  {currentAdd}
                </div>

                <div className="mt-4 text-xs text-[#4C5C68] dark:text-white/60">
                  Address: {profile?.address || "—"}
                </div>
              </div>
            </Card>

            {/* Right form */}
            <Card className="lg:col-span-2">
              <h2 className="text-lg font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
                Edit profile
              </h2>
          

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full name *"
                  value={form.full_name}
                  onChange={(e) => setForm((s) => ({ ...s, full_name: e.target.value }))}
                />
                <Input
                  label="Address"
                  value={form.address}
                  onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
                />

                <Input
                  label="GitHub"
                  value={form.github}
                  onChange={(e) => setForm((s) => ({ ...s, github: e.target.value }))}
                  placeholder="https://github.com/..."
                />
                <Input
                  label="Telegram"
                  value={form.telegram}
                  onChange={(e) => setForm((s) => ({ ...s, telegram: e.target.value }))}
                  placeholder="https://t.me/..."
                />

                <Input
                  label="LinkedIn"
                  value={form.linkedin}
                  onChange={(e) => setForm((s) => ({ ...s, linkedin: e.target.value }))}
                  placeholder="https://..."
                />

                <div className="md:col-span-2">
                  <Input
                    label="Skills (comma)"
                    value={form.skills}
                    onChange={(e) => setForm((s) => ({ ...s, skills: e.target.value }))}
                    placeholder="React,Node.js,Tailwind"
                  />
                  <p className="mt-2 text-xs text-[#4C5C68] dark:text-white/60">
                    Masalan: <b>React,Node.js,Tailwind</b>
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Tools (comma)"
                    value={form.tools}
                    onChange={(e) => setForm((s) => ({ ...s, tools: e.target.value }))}
                    placeholder="VS Code,Figma,Github"
                  />
                </div>

                <Textarea
                  label="Profession UZ *"
                  value={form.profession_uz}
                  onChange={(e) => setForm((s) => ({ ...s, profession_uz: e.target.value }))}
                />
                <Textarea
                  label="Profession RU"
                  value={form.profession_ru}
                  onChange={(e) => setForm((s) => ({ ...s, profession_ru: e.target.value }))}
                />
                <Textarea
                  label="Profession EN"
                  value={form.profession_en}
                  onChange={(e) => setForm((s) => ({ ...s, profession_en: e.target.value }))}
                />

                <Textarea
                  label="Profession Add UZ"
                  value={form.professionAdd_uz}
                  onChange={(e) => setForm((s) => ({ ...s, professionAdd_uz: e.target.value }))}
                />
                <Textarea
                  label="Profession Add RU"
                  value={form.professionAdd_ru}
                  onChange={(e) => setForm((s) => ({ ...s, professionAdd_ru: e.target.value }))}
                />
                <Textarea
                  label="Profession Add EN"
                  value={form.professionAdd_en}
                  onChange={(e) => setForm((s) => ({ ...s, professionAdd_en: e.target.value }))}
                />

                {/* Files */}
                <div className="md:col-span-2">
                  <label className="block">
                    <span className="block text-xs font-bold text-[#4C5C68] dark:text-white/60 mb-2">
                      Profile photo (1 dona) — ixtiyoriy (tanlasang yangilanadi)
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
                      {form.photo ? `Tanlandi: ${form.photo.name}` : "Rasm tanlanmadi"}
                    </p>
                  </label>

                  <label className="block mt-4">
                    <span className="block text-xs font-bold text-[#4C5C68] dark:text-white/60 mb-2">
                      CV file — ixtiyoriy (tanlasang yangilanadi)
                    </span>
                    <input
                      type="file"
                      onChange={(e) => setForm((s) => ({ ...s, cv: e.target.files?.[0] || null }))}
                      className="
                        w-full px-4 py-3 rounded-2xl
                        bg-white/70 dark:bg-white/5
                        border border-black/10 dark:border-white/10
                        text-[#46494C] dark:text-[#DCDCDD]
                      "
                    />
                    <p className="mt-2 text-xs text-[#4C5C68] dark:text-white/60">
                      {form.cv ? `Tanlandi: ${form.cv.name}` : "CV tanlanmadi"}
                    </p>
                  </label>
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    onClick={submit}
                    disabled={saving}
                    className="
                      inline-flex items-center gap-2 px-5 py-3 rounded-2xl
                      bg-[#1985A1] text-white font-semibold
                      shadow-lg shadow-[#1985A1]/20
                      hover:opacity-95 transition active:scale-95
                      disabled:opacity-60 disabled:cursor-not-allowed
                    "
                  >
                    <FiSave />
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
