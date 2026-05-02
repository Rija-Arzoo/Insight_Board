import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import TaskForm from "../components/tasks/TaskForm";
import TaskTable from "../components/tasks/TaskTable";
import TaskBoard from "../components/tasks/TaskBoard";
import Button from "../components/ui/Button";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../hooks/AuthContext";
import { useToast } from "../hooks/ToastContext";

function Tasks() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [view, setView] = useState("table"); // table | board
  const [sortKey, setSortKey] = useState("deadline");
  const [sortDir, setSortDir] = useState("asc"); // asc | desc
  const [searchOpen, setSearchOpen] = useState(false);
  const blurCloseTimer = useRef(null);

  const { user } = useAuth();
  const { getTasksForUser } = useTasks();
  const { toast } = useToast();

  const urlQ = params.get("q") || "";
  const effectiveSearch = search || urlQ;
  const focusId = params.get("focus") || "";

  useEffect(() => {
    if (!focusId) return;
    queueMicrotask(() => setView("table"));
  }, [focusId]);

  const searchMatches = useMemo(() => {
    const trimmed = (effectiveSearch || "").trim().toLowerCase();
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
  }, [effectiveSearch, getTasksForUser, user?.email, user?.role]);

  const goToTask = (task) => {
    if (!task?.id) return;
    setSearch("");
    setSearchOpen(false);
    const next = new URLSearchParams(params);
    next.delete("q");
    next.set("focus", task.id);
    setParams(next, { replace: true });
    setView("table");
  };

  const visibleForExport = useMemo(() => {
    const list = getTasksForUser(user?.email, user?.role) || [];
    const q = effectiveSearch.trim().toLowerCase();
    const filtered = q ? list.filter((t) => (t.title || "").toLowerCase().includes(q)) : list;
    return statusFilter ? filtered.filter((t) => t.status === statusFilter) : filtered;
  }, [effectiveSearch, getTasksForUser, statusFilter, user?.email, user?.role]);

  const exportCsv = () => {
    const rows = visibleForExport.map((t) => ({
      title: t.title ?? "",
      description: t.description ?? "",
      assignedTo: t.assignedTo ?? "",
      priority: t.priority ?? "",
      deadline: t.deadline ?? "",
      status: t.status ?? "",
      createdAt: t.createdAt ?? "",
    }));
    const headers = Object.keys(rows[0] || {
      title: "",
      description: "",
      assignedTo: "",
      priority: "",
      deadline: "",
      status: "",
      createdAt: "",
    });
    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `insightboard_tasks_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    toast({
      variant: "success",
      title: "Exported CSV",
      message: `${visibleForExport.length} task(s)`,
    });
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-[color:var(--text)] sm:text-2xl">Tasks</h1>
          <div className="mt-1 text-sm text-[color:var(--muted)]">
            Table + Kanban board, sorting, and export
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <Button
            variant={view === "table" ? "primary" : "secondary"}
            className="min-h-11 min-w-0 touch-manipulation px-3 py-2 text-sm sm:min-h-0 sm:px-4"
            onClick={() => setView("table")}
          >
            Table
          </Button>
          <Button
            variant={view === "board" ? "primary" : "secondary"}
            className="min-h-11 min-w-0 touch-manipulation px-3 py-2 text-sm sm:min-h-0 sm:px-4"
            onClick={() => setView("board")}
          >
            Kanban
          </Button>
          <Button variant="secondary" className="min-h-11 min-w-0 touch-manipulation px-3 py-2 text-sm sm:min-h-0 sm:px-4" onClick={exportCsv}>
            Export CSV
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap">
        <div
          className="relative w-full md:max-w-md"
          onFocusCapture={() => {
            if (blurCloseTimer.current) window.clearTimeout(blurCloseTimer.current);
            setSearchOpen(true);
          }}
          onBlurCapture={() => {
            if (blurCloseTimer.current) window.clearTimeout(blurCloseTimer.current);
            blurCloseTimer.current = window.setTimeout(() => setSearchOpen(false), 120);
          }}
        >
          <input
            type="text"
            placeholder="Search by title, assignee, or date (YYYY-MM-DD)..."
            value={effectiveSearch}
            onChange={(e) => {
              setSearch(e.target.value);
              if (params.get("q")) {
                const next = new URLSearchParams(params);
                next.delete("q");
                setParams(next, { replace: true });
              }
            }}
            className="min-h-11 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--panel-2)] px-3 py-2 !text-[color:var(--text)] caret-[color:var(--accent)] outline-none placeholder:text-[color:var(--muted)] focus:ring-2 focus:ring-[var(--ring)]"
          />

          {searchOpen && searchMatches.length ? (
            <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-lg overflow-hidden z-10">
              <div className="px-3 py-2 text-xs font-semibold text-[color:var(--muted)]">
                Matches
              </div>
              <div className="max-h-72 overflow-auto">
                {searchMatches.map((t) => (
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="min-h-11 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--panel-2)] px-3 py-2 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[var(--ring)] md:w-56"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={`${sortKey}:${sortDir}`}
          onChange={(e) => {
            const [k, d] = e.target.value.split(":");
            setSortKey(k);
            setSortDir(d);
          }}
          className="min-h-11 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--panel-2)] px-3 py-2 text-[color:var(--text)] outline-none focus:ring-2 focus:ring-[var(--ring)] md:w-60"
        >
          <option value="deadline:asc">Sort: deadline (asc)</option>
          <option value="deadline:desc">Sort: deadline (desc)</option>
          <option value="priority:asc">Sort: priority (asc)</option>
          <option value="priority:desc">Sort: priority (desc)</option>
          <option value="title:asc">Sort: title (A→Z)</option>
          <option value="title:desc">Sort: title (Z→A)</option>
          <option value="assignedTo:asc">Sort: assignee (A→Z)</option>
          <option value="assignedTo:desc">Sort: assignee (Z→A)</option>
        </select>
      </div>

      <TaskForm />

      {view === "table" ? (
        <TaskTable
          search={effectiveSearch}
          statusFilter={statusFilter}
          sortKey={sortKey}
          sortDir={sortDir}
          focusId={focusId}
        />
      ) : (
        <TaskBoard search={effectiveSearch} statusFilter={statusFilter} />
      )}
    </Layout>
  );
}

export default Tasks