import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Hapus token JWT dari localStorage
      localStorage.removeItem("token");

      // (Opsional) Bisa juga beri notifikasi logout sukses
      // alert("Logout berhasil");

      // Redirect ke halaman login
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
