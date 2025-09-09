import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { getXsrfToken } from "../lib/csrf";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1) Set cookie XSRF-TOKEN & laravel_session
      await api.get("/sanctum/csrf-cookie");

      // 2) Ambil token dari cookie & kirim sebagai header
      const xsrf = getXsrfToken();
      await api.post(
        "/login",
        { email, password },
        { headers: { "X-XSRF-TOKEN": xsrf } }
      );

      // 3) (opsional) validasi sesi
      await api.get("/api/user");

      // 4) Redirect ke dashboard
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const s = err?.response?.status;
      setErrorMsg(
        s === 422
          ? "Validasi gagal. Periksa email & password."
          : s === 401
          ? "Email atau password salah."
          : s === 419
          ? "CSRF mismatch. Muat ulang halaman lalu coba lagi."
          : "Gagal login. Coba lagi beberapa saat."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
      {/* Dekorasi kanan-atas */}
      <div className="absolute -top-20 right-0 w-[520px] h-[300px] pointer-events-none select-none z-0">
        <svg viewBox="0 0 520 300" className="w-full h-full">
          <polygon points="520,0 520,200 340,80" fill="#1565C0" />
          <polygon points="520,0 420,60 520,140" fill="#1E88E5" />
          <polygon points="410,40 520,140 360,160" fill="#0D47A1" />
        </svg>
      </div>

      {/* Dekorasi kiri-bawah */}
      <div className="absolute bottom-0 -left-10 w-[520px] h-[220px] pointer-events-none select-none z-0">
        <svg viewBox="0 0 520 220" className="w-full h-full">
          <polygon points="0,220 160,160 60,80" fill="#1565C0" />
          <polygon points="60,80 200,200 0,220" fill="#1E88E5" />
          <polygon points="120,120 220,180 160,220" fill="#0D47A1" />
        </svg>
      </div>

      {/* Kartu Login */}
      <div className="z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          {/* Logo + Title */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-xl overflow-hidden border flex items-center justify-center bg-white">
              <img src={logo} alt="WHN Logo" className="w-full h-full object-contain" />
            </div>
            <p className="text-center text-sm text-gray-700 leading-5">
              <span className="block font-semibold">Politeknik Kesehatan</span>
              <span className="block">Wira Husada Nusantara</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-2"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"}
                required
                className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-2"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="text-xs text-blue-700 mt-2"
                onClick={() => setShowPass((s) => !s)}
              >
                {showPass ? "Sembunyikan" : "Tampilkan"} password
              </button>
            </div>

            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1E63B4] text-white py-2.5 font-medium hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
