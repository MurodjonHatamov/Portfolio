import React from "react";

function Blog() {
  const posts = [
    {
      id: 1,
      title: "How I Build Clean UI with React & Tailwind",
      desc: "Minimal dizayn va toza UI yaratishda e’tibor beradigan asosiy nuqtalar.",
      date: "Aug 2026",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Why Minimalism Matters in Web Design",
      desc: "Nega kamroq element — ko‘proq sifat degani ekanini tushuntiraman.",
      date: "Jul 2026",
      readTime: "4 min read",
    },
    {
      id: 3,
      title: "My Frontend Learning Path",
      desc: "Frontend dasturlashni qanday bosqichma-bosqich o‘rgandim.",
      date: "Jun 2026",
      readTime: "6 min read",
    },
  ];

  return (
    <section
      id="blog"
      className="min-h-screen px-4 sm:px-6 lg:px-8 pt-24 pb-20"
    >
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

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="
                group p-6 sm:p-8 rounded-3xl
                border border-black/10 dark:border-white/10
                bg-white/60 dark:bg-white/5
                backdrop-blur
                hover:border-[#1985A1]/40
                transition-all
              "
            >
              {/* Meta */}
              <div className="flex items-center gap-3 text-sm text-[#4C5C68] dark:text-white/50 mb-2">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>

              {/* Title */}
              <h2
                className="
                  text-2xl sm:text-3xl font-semibold
                  text-[#46494C] dark:text-[#DCDCDD]
                  group-hover:text-[#1985A1]
                  transition-colors
                "
              >
                {post.title}
              </h2>

              {/* Description */}
              <p className="mt-3 text-[#4C5C68] dark:text-white/65 leading-relaxed">
                {post.desc}
              </p>

              {/* Read more */}
              <div className="mt-5">
                <span className="text-sm font-semibold text-[#1985A1]">
                  Read article →
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Empty / Footer note */}
        <div className="mt-16 text-center text-sm text-[#4C5C68] dark:text-white/40">
          Yangi postlar tez orada ✍️
        </div>
      </div>
    </section>
  );
}

export default Blog;
    