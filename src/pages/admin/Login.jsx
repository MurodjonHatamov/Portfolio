import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiUser, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";
import { loginAdmin } from "../../api/admin";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ login: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  // 3s da yo'qolsin
  useEffect(() => {
    if (!error && !ok) return;
    const t = setTimeout(() => {
      setError("");
      setOk(false);
    }, 3000);
    return () => clearTimeout(t);
  }, [error, ok]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk(false);

    if (!form.login.trim() || !form.password.trim()) {
      setError("Login va parolni kiriting");
      return;
    }

    try {
      setLoading(true);

      const token = await loginAdmin({
        login: form.login.trim(),
        password: form.password.trim(),
      });

      localStorage.setItem("admin_token", token);
      setOk(true);

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err?.message || "Login xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div
        className="
          w-full max-w-md rounded-3xl p-8 sm:p-10
          bg-white/70 dark:bg-white/5 backdrop-blur-xl
          border border-black/10 dark:border-white/10
          shadow-2xl
        "
      >
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-[#46494C] dark:text-[#DCDCDD]">
            Admin Login
          </h1>

        </div>

        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-sm font-semibold">
            {error}
          </div>
        )}
        {ok && (
          <div className="mb-5 p-3 rounded-2xl bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 text-sm font-semibold">
            Muvaffaqiyatli ✅
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4C5C68]" />
            <input
              type="text"
              value={form.login}
              onChange={onChange("login")}
              placeholder="Login"
              autoComplete="username"
              className="
                w-full pl-11 pr-4 py-3 rounded-2xl
                border border-black/10 dark:border-white/10
                bg-transparent
                text-[#46494C] dark:text-[#DCDCDD]
                placeholder:text-[#4C5C68]/70 dark:placeholder:text-white/40
                outline-none focus:border-[#1985A1] transition
              "
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4C5C68]" />
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={onChange("password")}
              placeholder="Password"
              autoComplete="current-password"
              className="
                w-full pl-11 pr-12 py-3 rounded-2xl
                border border-black/10 dark:border-white/10
                bg-transparent
                text-[#46494C] dark:text-[#DCDCDD]
                placeholder:text-[#4C5C68]/70 dark:placeholder:text-white/40
                outline-none focus:border-[#1985A1] transition
              "
            />

            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                w-9 h-9 rounded-xl
                border border-black/10 dark:border-white/10
                bg-white/60 dark:bg-white/5 backdrop-blur
                text-[#4C5C68] dark:text-white/60
                hover:text-[#1985A1] hover:border-[#1985A1]/40
                active:scale-95 transition
                flex items-center justify-center
                cursor-pointer
              "
              aria-label="Show password"
              title={showPass ? "Hide" : "Show"}
            >
              {showPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full flex items-center justify-center gap-2
              py-3 rounded-2xl bg-[#1985A1]
              text-white font-semibold
              hover:opacity-95 active:scale-95 transition
              disabled:opacity-60
            "
          >
            {loading ? "Kirish..." : "Kirish"} <FiLogIn />
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
