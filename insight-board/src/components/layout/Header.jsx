import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { useTheme } from "../../hooks/ThemeContext";
import { useTasks } from "../../hooks/useTasks";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { validateTask } from "../../utils/validation";
import { useToast } from "../../hooks/ToastContext";
import { FiChevronDown, FiMoon, FiPlus, FiSearch, FiSettings, FiSun, FiLogOut } from "react-icons/fi";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addTask, getTasksForUser } = useTasks();
  const { toast } = useToast();

  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const blurCloseTimer = useRef(null);

  const members = useMemo(() => {
    const list = JSON.parse(localStorage.getItem("users") || "[]");
    return list.filter((u) => u.role === "member");
  }, []);

  const [quick, setQuick] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "",
    deadline: "",
  });

  const runSearch = (e) => {
    e.preventDefault();
    const trimmed = q.trim();
    navigate(`/tasks${trimmed ? `?q=${encodeURIComponent(trimmed)}` : ""}`);
  };

  const matches = useMemo(() => {
    const trimmed = (q || "").trim().toLowerCase();
    if (!trimmed) return [];
    const list = getTasksForUser(user?.email, user?.role) || [];
    return list
      .filter((t) => {
        const hay = [t.title, t.assignedTo, t.deadline, t.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(trimmed);
      })
      .slice(0, 8);
  }, [getTasksForUser, q, user?.email, user?.role]);

  const goToTask = (task) => {
    if (!task?.id) return;
    setQ("");
    setSearchOpen(false);
    navigate(`/tasks?focus=${encodeURIComponent(task.id)}`);
  };

  const closeQuick = () => {
    setQuickOpen(false);
    setErrors({});
  };

  const submitQuick = () => {
    const { valid, errors: errs } = validateTask(quick);
    setErrors(errs);
    if (!valid) return;
    addTask(quick);
    toast({ variant: "success", title: "Task created", message: quick.title });
    setQuick({ title: "", description: "", assignedTo: "", priority: "", deadline: "" });
    closeQuick();
    navigate("/tasks");
  };

  return (
    <header className="sticky top-0 z-10 bg-[color:var(--panel)] border-b border-[color:var(--border)]">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm text-[color:var(--muted)]">Welcome back</div>
          <div className="truncate text-lg font-bold text-[color:var(--text)]">
            {user?.email ?? ""}
          </div>
        </div>

        <form onSubmit={runSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
          <div
            className="relative w-full"
            onFocusCapture={() => {
              if (blurCloseTimer.current) window.clearTimeout(blurCloseTimer.current);
              setSearchOpen(true);
            }}
            onBlurCapture={() => {
              if (blurCloseTimer.current) window.clearTimeout(blurCloseTimer.current);
              blurCloseTimer.current = window.setTimeout(() => setSearchOpen(false), 120);
            }}
          >
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, assignee, or date…"
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--panel-2)] !text-[color:var(--text)] caret-[color:var(--accent)] placeholder:text-[color:var(--muted)] outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />

            {searchOpen && matches.length ? (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-lg overflow-hidden">
                <div className="px-3 py-2 text-xs font-semibold text-[color:var(--muted)]">
                  Matches
                </div>
                <div className="max-h-72 overflow-auto">
                  {matches.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goToTask(t)}
                      className="w-full text-left px-3 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-[color:var(--text)]">
                            {t.title}
                          </div>
                          <div className="truncate text-xs text-[color:var(--muted)]">
                            {t.assignedTo || "Unassigned"} • {t.deadline || "No deadline"}
                          </div>
                        </div>
                        <div className="shrink-0 text-xs font-semibold text-[color:var(--accent)]">
                          Open
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </form>

        <div className="flex items-center gap-2">
          {user?.role === "manager" ? (
            <Button
              variant="primary"
              className="hidden sm:inline-flex"
              onClick={() => setQuickOpen(true)}
            >
              <FiPlus />
              New task
            </Button>
          ) : null}

          <button
            onClick={toggleTheme}
            type="button"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-[color:var(--border)] hover:bg-black/5 dark:hover:bg-white/5 transition text-[color:var(--text)]"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="inline-flex items-center gap-2 h-10 px-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--panel-2)] hover:bg-black/5 dark:hover:bg-white/5 transition text-[color:var(--text)]"
              aria-label="Open profile menu"
            >
              <span className="hidden sm:inline text-sm font-semibold">
                {user?.role ?? "account"}
              </span>
              <FiChevronDown className="text-black/50 dark:text-white/50" />
            </button>

            {profileOpen ? (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-lg overflow-hidden">
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[color:var(--text)] hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <FiSettings />
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <Modal
        open={quickOpen}
        onClose={closeQuick}
        title="Create task"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeQuick}>
              Cancel
            </Button>
            <Button onClick={submitQuick}>Create</Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Title"
            value={quick.title}
            onChange={(e) => setQuick((v) => ({ ...v, title: e.target.value }))}
            error={errors.title}
          />
          <label className="block">
            <div className="text-sm font-semibold text-[color:var(--text)]">
              Assign to
            </div>
            <select
              className={[
                "mt-1 w-full rounded-lg px-3 py-2 outline-none transition",
                "border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)]",
                "focus:ring-2 focus:ring-[var(--ring)]",
                errors.assignedTo ? "border-red-400 dark:border-red-500" : "",
              ].join(" ")}
              value={quick.assignedTo}
              onChange={(e) => setQuick((v) => ({ ...v, assignedTo: e.target.value }))}
            >
              <option value="">-- choose member --</option>
              {members.map((m) => (
                <option key={m.email} value={m.email}>
                  {m.email}
                </option>
              ))}
            </select>
            {errors.assignedTo ? (
              <div className="mt-1 text-sm text-red-600 dark:text-red-300">
                {errors.assignedTo}
              </div>
            ) : null}
          </label>

          <label className="block">
            <div className="text-sm font-semibold text-[color:var(--text)]">
              Priority
            </div>
            <select
              className={[
                "mt-1 w-full rounded-lg px-3 py-2 outline-none transition",
                "border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)]",
                "focus:ring-2 focus:ring-[var(--ring)]",
                errors.priority ? "border-red-400 dark:border-red-500" : "",
              ].join(" ")}
              value={quick.priority}
              onChange={(e) => setQuick((v) => ({ ...v, priority: e.target.value }))}
            >
              <option value="">-- select --</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.priority ? (
              <div className="mt-1 text-sm text-red-600 dark:text-red-300">
                {errors.priority}
              </div>
            ) : null}
          </label>

          <Input
            label="Deadline"
            type="date"
            value={quick.deadline}
            onChange={(e) => setQuick((v) => ({ ...v, deadline: e.target.value }))}
            error={errors.deadline}
          />

          <label className="block md:col-span-2">
            <div className="text-sm font-semibold text-[color:var(--text)]">
              Description
            </div>
            <textarea
              className={[
                "mt-1 w-full rounded-lg px-3 py-2 outline-none transition min-h-28",
                "border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)]",
                "focus:ring-2 focus:ring-[var(--ring)]",
                errors.description ? "border-red-400 dark:border-red-500" : "",
              ].join(" ")}
              value={quick.description}
              onChange={(e) => setQuick((v) => ({ ...v, description: e.target.value }))}
            />
            {errors.description ? (
              <div className="mt-1 text-sm text-red-600 dark:text-red-300">
                {errors.description}
              </div>
            ) : null}
          </label>
        </div>
      </Modal>
    </header>
  );
}

export default Header;