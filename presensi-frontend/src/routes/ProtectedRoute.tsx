// src/routes/ProtectedRoute.tsx
import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../lib/api";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;

    async function verifyTokenRequest() {
      const token = localStorage.getItem("jwt_token");
      console.log("ProtectedRoute: token from localStorage:", token);

      if (!token) {
        setAllowed(false);
        return;
      }

      try {
        const resp = await api.get("/verify-token");
        console.log("verify-token response:", resp.status, resp.data);

        if (resp.status === 200 && alive) {
          setAllowed(true);
        } else if (alive) {
          setAllowed(false);
        }
      } catch (err) {
        console.error("verify-token error:", err);
        if (alive) setAllowed(false);
      }
    }

    verifyTokenRequest();

    return () => {
      alive = false;
    };
  }, []);

  // log status allowed setiap render
  console.log("ProtectedRoute allowed:", allowed);

  if (allowed === null) {
    return (
      <div className="min-h-screen grid place-items-center">
        Memeriksa sesi…
      </div>
    );
  }

  if (!allowed) {
    // hapus token jika tidak valid
    localStorage.removeItem("jwt_token");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
