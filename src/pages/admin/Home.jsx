import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiRefreshCw, FiPlus, FiEdit2, FiMail, FiUsers, FiCopy } from "react-icons/fi";
import StatCard from "../../components/admin/StatCard";
import RowSkeleton from "../../components/admin/RowSkeleton";

import { getViewersAdmin, getMessagesAdmin} from "../../api/admin";
import { getBlogs } from "../../api/apis"; 
// <-- pathni o'zingdagi api.js joyiga mosla

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function shortUA(ua = "") {
  if (!ua) return "-";
  if (ua.length <= 70) return ua;
  return ua.slice(0, 70) + "…";
}

function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [viewers, setViewers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]);

  const token = localStorage.getItem("admin_token");

  const fetchAll = async () => {
    setLoading(true);
    setErr("");

    try {
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const [v, b, m] = await Promise.all([
        getViewersAdmin(token),
        getBlogs(),
        getMessagesAdmin(token),
      ]);

      setViewers(Array.isArray(v) ? v : []);
      setBlogs(Array.isArray(b) ? b : []);
      setMessages(Array.isArray(m) ? m : []);
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

  const stats = useMemo(() => {
    const totalViewers = viewers.length;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    const last24h = viewers.filter((v) => {
      const t = new Date(v.createdAt).getTime();
      return Number.isFinite(t) && now - t <= oneDay;
    }).length;

    const totalBlogs = blogs.length;
    const totalMessages = messages.length;

    return { totalViewers, last24h, totalBlogs, totalMessages };
  }, [viewers, blogs, messages]);

  // ... qolgan JSX sen yozganingdek qoladi
  return (
    <div className="min-h-screen bg-[#DCDCDD]/30 dark:bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 pb-28 md:pb-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
              Admin Dashboard
            </h1>
          </div>

          {/* Quick actions */}
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
              <span className="hidden sm:block">Refresh</span>
            </button>

            <button
              onClick={() => navigate("/admin/blog")}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                bg-[#1985A1] text-white
                shadow-lg shadow-[#1985A1]/20
                hover:opacity-95 transition active:scale-95
              "
            >
              <FiPlus />
              New Blog
            </button>

            <button
              onClick={() => navigate("/admin/projects")}
              className="
                inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                bg-white/70 dark:bg-white/5
                border border-black/10 dark:border-white/10
                text-[#46494C] dark:text-[#DCDCDD]
                hover:bg-white/90 dark:hover:bg-white/10
                transition active:scale-95
              "
            >
              <FiPlus />
              New Project
            </button>
          </div>
        </div>

        {err && (
          <div className="mt-6 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400">
            {err}
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard title="Jami Viewers" value={stats.totalViewers} icon={<FiUsers />} />
          <StatCard title="Oxirgi 24 soat" value={stats.last24h} icon={<FiUsers />} />
          <StatCard title="Oxirgi bloglar" value={stats.totalBlogs} icon={<FiEdit2 />} />
          <StatCard title="Oxirgi xabarlar" value={stats.totalMessages} icon={<FiMail />} />
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Viewers */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Viewers (private)"
              subtitle="Saytga kirgan qurilmalar, IP va device info"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#4C5C68] dark:text-white/60">
                    <th className="py-3 px-3">IP</th>
                    <th className="py-3 px-3">Device</th>
                    <th className="py-3 px-3">Sana</th>
                    <th className="py-3 px-3 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <RowSkeleton rows={5} cols={4} />
                  ) : viewers.length === 0 ? (
                    <tr>
                      <td className="py-4 px-3 text-[#4C5C68] dark:text-white/60" colSpan={4}>
                        Hozircha ma’lumot yo‘q.
                      </td>
                    </tr>
                  ) : (
                    viewers.slice(0, 8).map((v) => (
                      <tr
                        key={v._id}
                        className="border-t border-black/5 dark:border-white/10"
                      >
                        <td className="py-3 px-3 font-semibold text-[#46494C] dark:text-[#DCDCDD]">
                          {v.ip_address}
                        </td>
                        <td className="py-3 px-3 text-[#4C5C68] dark:text-white/70">
                          {shortUA(v.device_info)}
                        </td>
                        <td className="py-3 px-3 text-[#4C5C68] dark:text-white/70">
                          {formatDate(v.createdAt)}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => navigator.clipboard?.writeText(v.ip_address)}
                            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition active:scale-95"
                            title="Copy IP"
                          >
                            <FiCopy className="text-[#4C5C68] dark:text-white/70" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Right column: latest blogs + messages */}
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader
                title="Oxirgi bloglar"
                subtitle="Tez edit qilish uchun"
                actionText="Hammasi"
                onAction={() => navigate("/admin/blog")}
              />
              <div className="flex flex-col gap-2">
                {loading ? (
                  <ListSkeleton items={4} />
                ) : blogs.length === 0 ? (
                  <EmptyText text="Blog topilmadi (endpointni tekshir)." />
                ) : (
                  blogs.slice(0, 3).map((b) => (
                    <button
                      key={b._id || b.id || b.slug || b.title}
                      onClick={() => navigate(`/admin/blog`)}
                      className="
                        w-full text-left p-3 rounded-2xl
                        border border-black/10 dark:border-white/10
                        bg-white/50 dark:bg-white/5
                        hover:bg-white/80 dark:hover:bg-white/10
                        transition active:scale-[0.99]
                      "
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-[#46494C] dark:text-[#DCDCDD] line-clamp-1">
                          {b.title || "Untitled"}
                        </p>
                        <span className="text-xs text-[#1985A1] font-bold">
                          {b.status || "published"}
                        </span>
                      </div>
                      <p className="text-xs text-[#4C5C68] dark:text-white/60 mt-1">
                        {formatDate(b.createdAt || b.date)}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Oxirgi xabarlar"
                subtitle="Contact form’dan kelganlar"
                actionText="Hammasi"
                onAction={() => navigate("/admin/messages")}
              />
              <div className="flex flex-col gap-2">
                {loading ? (
                  <ListSkeleton items={4} />
                ) : messages.length === 0 ? (
                  <EmptyText text="Xabar topilmadi (endpointni tekshir)." />
                ) : (
                  messages.slice(0, 3).map((m) => (
                    <button
                      key={m._id || m.id || (m.email + (m.createdAt || ""))}
                      onClick={() => navigate("/admin/messages")}
                      className="
                        w-full text-left p-3 rounded-2xl
                        border border-black/10 dark:border-white/10
                        bg-white/50 dark:bg-white/5
                        hover:bg-white/80 dark:hover:bg-white/10
                        transition active:scale-[0.99]
                      "
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-[#46494C] dark:text-[#DCDCDD] line-clamp-1">
                          {m.name || m.email || "Unknown"}
                        </p>
                        <span className="text-xs text-[#4C5C68] dark:text-white/60">
                          {formatDate(m.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-[#4C5C68] dark:text-white/60 mt-1 line-clamp-1">
                        {m.message || m.text || m.subject || "—"}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


function Card({ children, className = "" }) {
    return (
      <div
        className={`
          rounded-3xl p-4
          bg-white/70 dark:bg-white/5
          border border-black/10 dark:border-white/10
          backdrop-blur-xl
          ${className}
        `}
      >
        {children}
      </div>
    );
  }
  function CardHeader({ title, subtitle, actionText, onAction }) {
    return (
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg font-extrabold text-[#46494C] dark:text-[#DCDCDD]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-[#4C5C68] dark:text-white/60 mt-1">{subtitle}</p>
          )}
        </div>
        {actionText && (
          <button
            onClick={onAction}
            className="
              text-sm font-bold text-[#1985A1]
              hover:underline underline-offset-4
            "
          >
            {actionText}
          </button>
        )}
      </div>
    );
  }
  function EmptyText({ text }) {
    return <p className="text-sm text-[#4C5C68] dark:text-white/60 p-2">{text}</p>;
  }
  function ListSkeleton({ items = 4 }) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
            className="p-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5"
          >
            <div className="h-3 w-2/3 rounded-full bg-black/10 dark:bg-white/10 animate-pulse" />
            <div className="mt-2 h-3 w-1/2 rounded-full bg-black/10 dark:bg-white/10 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }






export default Home;
