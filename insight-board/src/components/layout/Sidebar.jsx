import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { FiBarChart2, FiCheckSquare, FiSettings, FiLogOut } from "react-icons/fi";

function Sidebar() {
  const { user, logout } = useAuth();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: FiBarChart2 },
    { to: "/tasks", label: "Tasks", icon: FiCheckSquare },
    { to: "/settings", label: "Settings", icon: FiSettings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[color:var(--panel)] border-r border-[color:var(--border)] min-h-screen">
      <div className="p-6 border-b border-[color:var(--border)]">
        <div className="text-2xl font-extrabold tracking-tight text-[color:var(--text)]">
          InsightBoard
        </div>
        {user ? (
          <div className="mt-2 flex flex-col items-start gap-1 text-sm text-[color:var(--muted)]">
            <div className="w-full truncate text-left">{user.email}</div>
            <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] px-2 py-0.5 text-xs font-semibold text-left">
              {user.role}
            </div>
          </div>
        ) : null}
      </div>

      <nav className="flex flex-col p-4 gap-1 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition",
                isActive
                  ? "text-white bg-[color:var(--accent)] shadow-sm"
                  : "text-[color:var(--text)] hover:bg-black/5 dark:hover:bg-white/5",
              ].join(" ")
            }
          >
            <link.icon className="text-lg" />
            {link.label}
          </NavLink>
        ))}

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={logout}
            className="sidebar-logout"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar