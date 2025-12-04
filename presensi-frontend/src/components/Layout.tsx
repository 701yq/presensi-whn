import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    // tampilkan konfirmasi modal
    setShowConfirm(true);
  };

  const confirmLogout = () => {
    // hapus token JWT
    localStorage.removeItem("jwt_token");
    setShowConfirm(false);
    navigate("/", { replace: true });
  };

  const cancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar onLogout={handleLogoutClick} />
      <main className="flex-1 p-8">{children}</main>

      {/*konfirmasi logout*/}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Konfirmasi Logout
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Apakah anda yakin ingin keluar?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
