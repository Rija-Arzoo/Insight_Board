import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { FiBarChart2, FiCheckSquare, FiSettings, FiLogOut, FiX } from "react-icons/fi";
import { useMobileNav } from "./MobileNavContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const { sidebarOpen, closeSidebar } = useMobileNav();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: FiBarChart2 },
    { to: "/tasks", label: "Tasks", icon: FiCheckSquare },
    { to: "/settings", label: "Settings", icon: FiSettings },
  ];

  return (
    <>
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] transition-opacity md:hidden"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      ) : null}

      <aside
        className={[
          "fixed left-0 top-0 z-50 flex h-dvh w-[min(18rem,88vw)] shrink-0 flex-col overscroll-contain bg-[color:var(--panel)] shadow-2xl transition-transform duration-300 ease-out md:relative md:z-auto md:h-auto md:min-h-dvh md:w-64 md:translate-x-0 md:border-r md:border-[color:var(--border)] md:shadow-none",
          sidebarOpen ? "translate-x-0" : "max-md:-translate-x-full",
          "max-md:[will-change:transform]",
        ].join(" ")}
      >
      <div className="flex items-start justify-between gap-2 border-b border-[color:var(--border)] p-5 md:p-6">
        <div className="min-w-0">
          <div className="text-2xl font-extrabold tracking-tight text-[color:var(--text)]">
            InsightBoard
          </div>
          {user ? (
            <div className="mt-2 flex flex-col items-start gap-1 text-sm text-[color:var(--muted)]">
              <div className="w-full truncate text-left">{user.email}</div>
              <div className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--panel-2)] px-2 py-0.5 text-left text-xs font-semibold text-[color:var(--text)]">
                {user.role}
              </div>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--text)] hover:bg-black/5 dark:hover:bg-white/5 md:hidden"
          aria-label="Close menu"
          onClick={closeSidebar}
        >
          <FiX className="text-lg" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4 pb-6">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={closeSidebar}
            className={({ isActive }) =>
              [
                "flex touch-manipulation items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition md:py-2",
                isActive
                  ? "text-white shadow-sm bg-[color:var(--accent)]"
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
    </>
  );
}

export default Sidebar;