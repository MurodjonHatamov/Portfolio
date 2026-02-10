import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiRefreshCw, FiEdit2, FiTrash2 } from "react-icons/fi";
import Card from "../../components/admin/Card";
import DeleteConfirm from "../../components/admin/DeleteConfirm";
import Sk from "../../components/Sk";
import { getLang, pickLang } from "../../api/mainPage";
import { getBlogsAdmin, deleteBlogAdmin } from "../../api/admin";
import { safeText, truncateWords } from "../../api/admin"; // pastdagi utilsga joyla

const FALLBACK_IMG = "https://via.placeholder.com/300x200?text=No+Image";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("uz-UZ", { year: "numeric", month: "2-digit", day: "2-digit" });
  } catch {
    return iso;
  }
}

export default function Blog() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const lang = useMemo(() => getLang(), []);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  const [confirmDel, setConfirmDel] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await getBlogsAdmin(); // public GET
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Xatolik");
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
    return rows.filter((p) => {
      const title = safeText(pickLang(p?.title, lang));
      const desc = safeText(pickLang(p?.description, lang));
      const hay = `${title} ${desc}`.toLowerCase();
      return hay.includes(query);
    });
  }, [rows, q, lang]);

  const doDelete = async () => {
    if (!confirmDel?._id) return;
    if (!token) return navigate("/admin/login");

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
              Blog
            </h1>
        
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchAll}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10
                text-[#46494C] dark:text-[#DCDCDD]
                hover:bg-white/90 dark:hover:bg-white/10 transition active:scale-95"
            >
              <FiRefreshCw />
              Refresh
            </button>

            <button
              onClick={() => navigate("/admin/blog/add")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                bg-[#1985A1] text-white shadow-lg shadow-[#1985A1]/20
                hover:opacity-95 transition active:scale-95"
            >
              <FiPlus />
              Add Blog
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
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4 w-28">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-black/5 dark:border-white/10">
                      <td className="py-3 px-4"><Sk className="w-12 h-12 rounded-2xl" /></td>
                      <td className="py-3 px-4"><Sk className="h-4 w-40 rounded" /></td>
                      <td className="py-3 px-4"><Sk className="h-4 w-72 rounded" /></td>
                      <td className="py-3 px-4"><Sk className="h-4 w-24 rounded" /></td>
                      <td className="py-3 px-4"><Sk className="h-4 w-10 rounded" /></td>
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
                  filtered.map((p) => {
                    const cover = p?.photos?.[0] || FALLBACK_IMG;
                    const title = safeText(pickLang(p?.title, lang)) || "Post";
                    const desc = safeText(pickLang(p?.description, lang));

                    return (
                      <tr key={p._id} className="border-t border-black/5 dark:border-white/10">
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10">
                            <img src={cover} alt={title} className="w-full h-full object-cover" />
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-extrabold text-[#46494C] dark:text-[#DCDCDD] line-clamp-1">
                            {title}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                          {truncateWords(desc, 10)}
                        </td>

                        <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                          {formatDate(p?.createdAt)}
                        </td>

                        <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                          {p?.views ?? 0}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate("/admin/blog/add", { state: { edit: p } })}
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

        <DeleteConfirm
          open={!!confirmDel}
          title="Delete blog?"
          onClose={() => setConfirmDel(null)}
          footer={
            <>
              <button
                onClick={() => setConfirmDel(null)}
                className="px-4 py-2 rounded-2xl bg-white/70 dark:bg-white/5
                  border border-black/10 dark:border-white/10 text-[#46494C] dark:text-[#DCDCDD]
                  hover:bg-white/90 dark:hover:bg-white/10 transition active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="px-4 py-2 rounded-2xl bg-red-500 text-white
                  shadow-lg shadow-red-500/20 hover:opacity-95 transition active:scale-95"
              >
                Delete
              </button>
            </>
          }
        >
          <p className="text-sm text-[#4C5C68] dark:text-white/70">
            <span className="font-bold text-[#46494C] dark:text-[#DCDCDD]">
              {safeText(pickLang(confirmDel?.title, lang)) || confirmDel?.title || "Post"}
            </span>{" "}
            postni o‘chirmoqchimisiz? Bu amal qaytarilmaydi.
          </p>
        </DeleteConfirm>
      </div>
    </div>
  );
}
