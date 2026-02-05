import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBlogById, getBlogs } from "../api/apis";
import { FiLink, FiCopy, FiCheck } from "react-icons/fi";

const FALLBACK_IMG = "https://via.placeholder.com/1200x600?text=No+Image";

function BlogDetailSkeleton() {
  return (
    <section className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="w-full h-[320px] rounded-3xl bg-black/10 dark:bg-white/10 mb-8" />
        <div className="h-10 w-3/4 rounded bg-black/10 dark:bg-white/10 mb-6" />
        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-[95%] rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-[90%] rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-[85%] rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-[70%] rounded bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    </section>
  );
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

function pickRandom(arr, n) {
  const a = [...arr];
  // Fisher-Yates shuffle
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

function truncateWords(text = "", limit = 6) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "…";
}

function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // recommendations
  const [randomPosts, setRandomPosts] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  // toast states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);

  const blogText = useMemo(() => {
    if (!post) return "";
    return `${post.title}\n\n${post.description}`;
  }, [post]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const data = await getBlogById(id);
        if (!cancelled) setPost(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setPost(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // recommendations fetch (after id changes)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setRecLoading(true);
        const all = await getBlogs(); // array
        if (cancelled) return;

        const filtered = (Array.isArray(all) ? all : []).filter((p) => p?._id !== id);
        setRandomPosts(pickRandom(filtered, 3));
      } catch (e) {
        console.error(e);
        if (!cancelled) setRandomPosts([]);
      } finally {
        if (!cancelled) setRecLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // auto-hide toasts (3s)
  useEffect(() => {
    if (!copiedLink) return;
    const t = setTimeout(() => setCopiedLink(false), 3000);
    return () => clearTimeout(t);
  }, [copiedLink]);

  useEffect(() => {
    if (!copiedPost) return;
    const t = setTimeout(() => setCopiedPost(false), 3000);
    return () => clearTimeout(t);
  }, [copiedPost]);

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(window.location.href);
      setCopiedLink(true);
      setCopiedPost(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyPost = async () => {
    try {
      await copyToClipboard(blogText);
      setCopiedPost(true);
      setCopiedLink(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <BlogDetailSkeleton />;

  if (!post)
    return (
      <div className="mt-40 text-center text-[#4C5C68] dark:text-white/60">
        Post topilmadi
      </div>
    );

  return (
    <section className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Image */}
        <div className="w-full h-[320px] rounded-3xl overflow-hidden mb-8 border border-black/10 dark:border-white/10">
          <img
            src={post.photos?.[0] || FALLBACK_IMG}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title + Actions row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#46494C] dark:text-[#DCDCDD]">
            {post.title}
          </h1>

          {/* Copy Buttons */}
          <div className="flex items-center gap-3 sm:pt-1">
            <button
              onClick={handleCopyLink}
              className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-2xl
                border border-black/10 dark:border-white/10
                bg-white/60 dark:bg-white/5 backdrop-blur
                text-[#46494C] dark:text-[#DCDCDD]
                hover:border-[#1985A1]/40 hover:text-[#1985A1]
                active:scale-95 transition
              "
              type="button"
              title="Havolani nusxalash"
            >
              {copiedLink ? <FiCheck /> : <FiLink />}
              <span className="text-sm font-semibold">
                {copiedLink ? "Copied!" : "Copy link"}
              </span>
            </button>

            <button
              onClick={handleCopyPost}
              className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-2xl
                border border-black/10 dark:border-white/10
                bg-white/60 dark:bg-white/5 backdrop-blur
                text-[#46494C] dark:text-[#DCDCDD]
                hover:border-[#1985A1]/40 hover:text-[#1985A1]
                active:scale-95 transition
              "
              type="button"
              title="Blog matnini nusxalash"
            >
              {copiedPost ? <FiCheck /> : <FiCopy />}
              <span className="text-sm font-semibold">
                {copiedPost ? "Copied!" : "Copy blog"}
              </span>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-lg leading-relaxed text-[#4C5C68] dark:text-white/70 whitespace-pre-line">
          {post.description}
        </p>

        {/* Bottom row: Next blogs + random 3 posts (hidden on mobile) */}
        <div className="w-full mt-14 pt-8 border-t border-black/10 dark:border-white/10 flex items-start flex-col gap-8">
          {/* Left: button */}

          {/* Right: 3 random posts (desktop only) */}
         
            <div className="grid grid-cols-2 gap-2 w-full">
              {(recLoading ? Array.from({ length: 3 }) : randomPosts).map((p, idx) => {
                if (recLoading) {
                  return (
                    <div
                      key={idx}
                      className="h-[120px] rounded-2xl bg-black/10 dark:bg-white/10 animate-pulse"
                    />
                  );
                }

                const img = p?.photos?.[0] || FALLBACK_IMG;

                return (
                  <Link
                    key={p._id}
                    to={`/blog/${p._id}`}
                    className="
                      group rounded-2xl overflow-hidden
                      border border-black/10 dark:border-white/10
                      bg-white/60 dark:bg-white/5 backdrop-blur
                      hover:border-[#1985A1]/40 transition
                    "
                    title={p?.title}
                  >
                  
                    <div className="p-3">
                      <div className="text-sm font-semibold text-[#46494C] dark:text-[#DCDCDD] group-hover:text-[#1985A1] transition-colors line-clamp-1">
                        {p?.title || "Post"}
                      </div>
                      <div className="mt-1 text-xs text-[#4C5C68] dark:text-white/60 line-clamp-1">
                        {truncateWords(p?.description || "", 6)}
                      </div>
                      <div className="mt-2 text-xs font-semibold text-[#1985A1]">
                        Read more →
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
       
          <Link
            to="/blog"
            className="
              inline-flex items-center justify-center
              px-6 py-3 rounded-2xl
              bg-[#1985A1] text-white font-semibold
              hover:opacity-95 active:scale-95 transition
              shadow-lg shadow-[#1985A1]/20
              whitespace-nowrap
            "
          >
            Keyingi bloglar →
          </Link>

        </div>

        {/* Toast */}
        {(copiedLink || copiedPost) && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="px-4 py-2 rounded-2xl bg-black/70 text-white text-sm font-semibold backdrop-blur border border-white/10 shadow-xl">
              {copiedLink ? "Havola nusxalandi ✅" : "Blog nusxalandi ✅"}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default BlogDetail;
