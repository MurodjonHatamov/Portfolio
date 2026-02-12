import React, { useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Card from "../../components/admin/Card";
import DeleteConfirm from "../../components/admin/DeleteConfirm";
import Sk from "../../components/Sk";

import { getContactsAdmin, deleteContactAdmin } from "../../api/admin";

function clampText(s = "", n = 80) {
  const str = String(s || "");
  return str.length > n ? str.slice(0, n) + "…" : str;
}

export default function Contact() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);

  const [q, setQ] = useState("");
  const [confirmDel, setConfirmDel] = useState(null);

  const fetchAll = async () => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const data = await getContactsAdmin(token);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Contactlarni olishda xatolik");
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

    return rows.filter((m) => {
      const hay = `${m?.name || ""} ${m?.phone_tg || ""} ${m?.theme || ""} ${m?.text || ""}`.toLowerCase();
      return hay.includes(query);
    });
  }, [rows, q]);

  const doDelete = async () => {
    if (!confirmDel?._id) return;
    try {
      await deleteContactAdmin(token, confirmDel._id);
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
              Contact Messages
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
              placeholder="Search (name / phone / theme / text)..."
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
                  <th className="py-3 px-4 w-16">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Phone / TG</th>
                  <th className="py-3 px-4">Theme</th>
                  <th className="py-3 px-4">Text</th>
                  <th className="py-3 px-4 w-20 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-t border-black/5 dark:border-white/10">
                      <td className="py-3 px-4"><Sk className="h-4 w-8 rounded" /></td>
                      <td className="py-3 px-4"><Sk className="h-4 w-28 rounded" /></td>
                      <td className="py-3 px-4"><Sk className="h-4 w-28 rounded" /></td>
                      <td className="py-3 px-4"><Sk className="h-4 w-24 rounded" /></td>
                      <td className="py-3 px-4"><Sk className="h-4 w-80 rounded" /></td>
                      <td className="py-3 px-4"><Sk className="h-8 w-14 rounded-2xl ml-auto" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#4C5C68] dark:text-white/60">
                      Hech narsa topilmadi.
                    </td>
                  </tr>
                ) : (
                  filtered.map((m, idx) => (
                    <tr key={m?._id || idx} className="border-t border-black/5 dark:border-white/10">
                      <td className="py-3 px-4 text-[#4C5C68] dark:text-white/60">
                        {idx + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
                          {m?.name || "—"}
                        </div>
            
                      </td>

                      <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                        {m?.phone_tg || "—"}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-[#1985A1]/10 text-[#1985A1]">
                          {m?.theme || "—"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[#4C5C68] dark:text-white/70">
                        {clampText(m?.text, 110)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => setConfirmDel(m)}
                            className="p-2 rounded-2xl hover:bg-red-500/10 transition active:scale-95"
                            title="Delete"
                          >
                            <FiTrash2 className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Delete confirm */}
        <DeleteConfirm
          open={!!confirmDel}
          title="Delete message?"
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
              {confirmDel?.name || "User"}
            </span>{" "}
            xabarini o‘chirmoqchimisiz? Bu amal qaytarilmaydi.
          </p>

          <div className="mt-3 rounded-2xl p-3 border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5">
            <div className="text-xs text-[#4C5C68] dark:text-white/60 mb-1">
              Theme: <span className="font-bold">{confirmDel?.theme}</span>
            </div>
            <div className="text-sm text-[#46494C] dark:text-[#DCDCDD]">
              {clampText(confirmDel?.text, 200)}
            </div>
          </div>
        </DeleteConfirm>
      </div>
    </div>
  );
}
