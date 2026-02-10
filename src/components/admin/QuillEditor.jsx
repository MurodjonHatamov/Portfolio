import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function QuillEditor({ value = "", onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // editorni yaratish (faqat 1 marta)
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Blog matnini yozing...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    // boshlang'ich qiymat
    quillRef.current.clipboard.dangerouslyPasteHTML(value || "");

    // har yozganda parentga yuboradi
    quillRef.current.on("text-change", () => {
      const html = quillRef.current.root.innerHTML;
      if (onChange) onChange(html);
    });
  }, []);

  // tashqaridan value o‘zgarsa (edit mode uchun)
  useEffect(() => {
    if (!quillRef.current) return;

    const current = quillRef.current.root.innerHTML;

    if ((value || "") !== current) {
      const range = quillRef.current.getSelection();
      quillRef.current.clipboard.dangerouslyPasteHTML(value || "");

      if (range) {
        quillRef.current.setSelection(range);
      }
    }
  }, [value]);

  return (
    <div className="rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b0f13] text-black dark:text-white">
      <div ref={editorRef} style={{ minHeight: "250px" }} />
    </div>
  );
}

export default QuillEditor;
