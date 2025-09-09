import type { ReactNode } from "react";
import Sidebar from "./Sidebar";               // <- default export, huruf besar
import { api } from "../lib/api";
import { getXsrfToken } from "../lib/csrf";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get("/sanctum/csrf-cookie");
      await api.post(
        "/logout",
        {},
        { headers: { "X-XSRF-TOKEN": getXsrfToken() } }
      );
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="flex bg-white">
      <Sidebar onLogout={handleLogout} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
