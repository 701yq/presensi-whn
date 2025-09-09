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

    // cek sesi: kalau 200 artinya sudah login
    api
      .get("/api/user")
      .then(() => {
        if (alive) setAllowed(true);
      })
      .catch(() => {
        if (alive) setAllowed(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  if (allowed === null) {
    return (
      <div className="min-h-screen grid place-items-center">
        Memeriksa sesi…
      </div>
    );
  }

  if (allowed === false) {
    return <Navigate to="/" replace />;
  }

  // allowed === true
  return <>{children}</>;
}
