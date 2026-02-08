import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogs } from "../api/apis";
import { FaCalendarAlt, FaEye } from "react-icons/fa";
import { getLang, pickLang } from "../api/mainPage";

function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

const lang =useMemo (()=>getLang(),[])

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr("");
        setLoading(true);
        const data = await getBlogs();
        if (!alive) return;
        setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Xatolik yuz berdi");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // 5-6 ta so'z preview
  const previewWords = (text = "", limit = 6) => {
    const words = String(text).trim().split(/\s+/).filter(Boolean);
    if (words.length <= limit) return words.join(" ");
    return words.slice(0, limit).join(" ") + " ...";
  };



  // ✅ tilga moslab normalize qilamiz
  const normalized = useMemo(() => {
    return posts.map((p) => {
      const titleText = pickLang(p?.title, lang) || "Untitled";
      const descText = pickLang(p?.description, lang) || "";

      const fullText = `${titleText} ${descText}`;

      return {
        _id: p?._id,
        title: titleText,
        description: descText,
        date: p?.createdAt ? p.createdAt : new Date().toISOString(),
        views: p?.views ?? 0,
      };
    });
  }, [posts, lang]);

  return (
    <section id="blog" className="min-h-screen px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#46494C] dark:text-[#DCDCDD]">
            Blog
          </h1>
          <p className="mt-3 text-[#4C5C68] dark:text-white/60">
            Fikrlar, tajriba va frontend bo‘yicha yozuvlarim.
          </p>
        </div>

        {/* Error */}
        {!loading && err && (
          <div className="mb-8 rounded-3xl p-4 border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-center font-semibold">
            {err}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-6 sm:p-8 rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur"
              >
                <div className="h-4 w-40 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
                <div className="mt-4 h-7 w-3/4 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
                <div className="mt-3 h-5 w-full bg-black/10 dark:bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Posts */}
        {!loading && !err && (
          <div className="space-y-6">
            {normalized.map((post) => (
              <article
                key={post._id}
                onClick={() => navigate(`/blog/${post._id}`)}
                className="
                  group p-3 sm:p-3 sm:pl-4 rounded-2xl cursor-pointer
                  border border-black/10 dark:border-white/10
                  bg-white/60 dark:bg-white/5 backdrop-blur
                  hover:border-[#1985A1]/40 transition-all
                  active:scale-[0.99]
                "
              >
                <h2
                  className="
                    text-2xl sm:text-3xl font-semibold
                    text-[#46494C] dark:text-[#DCDCDD]
                    group-hover:text-[#1985A1]
                    transition-colors
                    line-clamp-1
                  "
                >
                  {previewWords(post.title, 8)}
                </h2>

                <p className="mt-3 line-clamp-1 text-[#4C5C68] dark:text-white/65 leading-relaxed">
                  {previewWords(post.description, 12)}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[#1985A1] font-semibold block mt-1">
                    Read more →
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-[#C5C3C6] flex items-center gap-1 text-[15px]">
                      <FaCalendarAlt />
                      {new Date(post.date).toLocaleDateString("uz-UZ")}
                    </span>
                    <span className="text-[#C5C3C6] flex items-center gap-1 text-[15px]">
                      <FaEye />
                      {post.views}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-16 text-center text-sm text-[#4C5C68] dark:text-white/40">
          Yangi postlar tez orada ✍️
        </div>
      </div>
    </section>
  );
}

export default Blog;
