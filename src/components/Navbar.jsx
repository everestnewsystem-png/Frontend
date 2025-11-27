// src/components/Navbar.jsx
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Wrench,
  LayoutDashboard,
  CheckSquare2,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 👉 You can change these paths to match your routes
  const items = [
    { key: "home", label: "Home", icon: Home, path: "/home" },
    { key: "applicants", label: "Applicants", icon: Users, path: "/applicants" },
    { key: "tools", label: "Tools", icon: Wrench, path: "/tools" },
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { key: "tasks", label: "Tasks", icon: CheckSquare2, path: "/tasks" },
  ];

  return (
    <nav className="hidden md:flex fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 rounded-full bg-slate-900/90 border border-slate-700 px-4 py-2 shadow-xl backdrop-blur">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => navigate(item.path)} // 👈 change path above if needed
              title={item.label}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full transition 
                ${isActive
                  ? "bg-slate-100 text-slate-900 shadow-md"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
