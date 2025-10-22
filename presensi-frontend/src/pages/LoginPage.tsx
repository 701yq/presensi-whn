// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [nidn, setNidn] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const resp = await api.post("/login-dosen", { nidn, password });

      // simpan token JWT
      const token = resp.data?.token;
      if (!token) throw new Error("Token tidak ditemukan");

      localStorage.setItem("jwt_token", token);
      console.log("Token saved:", localStorage.getItem("jwt_token"));

      localStorage.setItem("jwt_token", token);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const s = err?.response?.status;
      setErrorMsg(
        s === 401
          ? "NIDN atau password salah."
          : "Gagal login. Periksa koneksi dan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
      <div className="z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-xl overflow-hidden border flex items-center justify-center bg-white">
              <img
                src={logo}
                alt="WHN Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-center text-sm text-gray-700 leading-5">
              <span className="block font-semibold">Politeknik Kesehatan</span>
              <span className="block">Wira Husada Nusantara</span>
            </p>
          </div>

          {/* Form Login */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">NIDN</label>
              <input
                value={nidn}
                onChange={(e) => setNidn(e.target.value)}
                type="text"
                required
                className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-2"
                placeholder="Masukkan NIDN"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
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
