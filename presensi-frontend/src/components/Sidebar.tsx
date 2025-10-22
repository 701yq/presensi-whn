import { LayoutGrid, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

type Props = { onLogout: () => void };

export default function Sidebar({ onLogout }: Props) {
  const itemClass = (active: boolean) =>
    `flex items-center gap-3 w-full px-4 py-2 rounded-lg transition
     ${
       active
         ? "bg-white/20 text-white font-medium"
         : "text-white/90 hover:bg-white/10"
     }`;

  return (
    <aside className="h-screen w-64 bg-[#1E63B4] text-white sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <img
          src={logo}
          className="w-10 h-10 rounded-lg bg-white p-1"
          alt="WHN"
        />
        <span className="font-semibold">WHN</span>
      </div>

      <nav className="px-4 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => itemClass(isActive)}
        >
          <LayoutGrid size={18} />
          <span>Dashboard</span>
        </NavLink>
      </nav>

      <div className="mt-auto p-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-white/10"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
