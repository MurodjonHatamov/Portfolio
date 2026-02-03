import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "../api/apis";

const FALLBACK_IMG =
  "https://via.placeholder.com/1200x600?text=No+Image";

function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    getBlogById(id).then(setPost).catch(console.error);
  }, [id]);

  if (!post) return <div className="mt-40 text-center">Loading...</div>;

  return (
    <section className="min-h-screen px-4 pt-24 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Image */}
        <div className="w-full h-[320px] rounded-3xl overflow-hidden mb-8">
          <img
            src={post.photos?.[0] || FALLBACK_IMG}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#46494C] dark:text-[#DCDCDD]">
          {post.title}
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg leading-relaxed text-[#4C5C68] dark:text-white/70">
          {post.description}
        </p>
      </div>
    </section>
  );
}

export default BlogDetail;
