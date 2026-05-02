import { useMemo } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../hooks/AuthContext";

const columns = [
  { key: "Pending", title: "Pending" },
  { key: "In Progress", title: "In Progress" },
  { key: "Completed", title: "Completed" },
];

export default function TaskBoard({ search = "", statusFilter = "" }) {
  const { user } = useAuth();
  const { getTasksForUser, changeStatus } = useTasks();

  const items = useMemo(() => {
    const list = getTasksForUser(user?.email, user?.role);
    const q = search.trim().toLowerCase();
    const filtered = q
      ? list.filter((t) => {
          const hay = [t.title, t.assignedTo, t.deadline, t.description]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return hay.includes(q);
        })
      : list;
    return statusFilter ? filtered.filter((t) => t.status === statusFilter) : filtered;
  }, [getTasksForUser, search, statusFilter, user?.email, user?.role]);

  const byStatus = useMemo(() => {
    const map = new Map(columns.map((c) => [c.key, []]));
    for (const t of items) {
      const key = map.has(t.status) ? t.status : "Pending";
      map.get(key).push(t);
    }
    return map;
  }, [items]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
      {columns.map((col) => (
        <div
          key={col.key}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-sm"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const id = e.dataTransfer.getData("text/taskId");
            if (!id) return;
            changeStatus(id, col.key);
          }}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-[color:var(--text)]">{col.title}</div>
            <div className="text-xs font-semibold text-[color:var(--muted)]">
              {(byStatus.get(col.key) || []).length}
            </div>
          </div>

          <div className="mt-3 space-y-3 min-h-24">
            {(byStatus.get(col.key) || []).map((t) => (
              <div
                key={t.id}
                draggable={user?.role === "manager" || user?.role === "member"}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/taskId", t.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                className="rounded-xl border border-[color:var(--border)] bg-[color:var(--panel-2)] p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="font-semibold text-[color:var(--text)]">
                  {t.title}
                </div>
                <div className="mt-1 text-sm text-[color:var(--muted)] line-clamp-2">
                  {t.description || "—"}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-[color:var(--border)] px-2 py-1 text-[color:var(--text)]">
                    {t.priority || "Priority"}
                  </span>
                  <span className="rounded-full border border-[color:var(--border)] px-2 py-1 text-[color:var(--text)]">
                    {t.deadline || "No deadline"}
                  </span>
                  {t.assignedTo ? (
                    <span className="rounded-full border border-[color:var(--border)] px-2 py-1 text-[color:var(--text)]">
                      {t.assignedTo}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs text-[color:var(--muted)]">
            Drag cards here to move status.
          </div>
        </div>
      ))}
    </div>
  );
}

