import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../hooks/AuthContext";
import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useToast } from "../../hooks/ToastContext";

function TaskTable({ search, statusFilter, sortKey, sortDir, focusId }) {
  const { user } = useAuth();
  const {
    deleteTask,
    changeStatus,
    updateTask,
    getTasksForUser,
  } = useTasks();
  const { toast } = useToast();

  const [editing, setEditing] = useState(null);
  const [editValues, setEditValues] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const focusHandledRef = useRef("");

  const visible = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    const list = getTasksForUser(user?.email, user?.role)
      .filter((task) => {
        if (!q) return true;
        const hay = [
          task.title,
          task.assignedTo,
          task.deadline,
          task.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .filter((task) => !statusFilter || task.status === statusFilter);

    const dir = sortDir === "desc" ? -1 : 1;
    const key = sortKey || "";
    if (!key) return list;

    const safe = (v) => (v ?? "").toString().toLowerCase();
    return [...list].sort((a, b) => {
      const av = safe(a[key]);
      const bv = safe(b[key]);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [getTasksForUser, search, sortDir, sortKey, statusFilter, user?.email, user?.role]);

  const openEdit = (task) => {
    setEditing(task);
    setEditValues({
      title: task.title ?? "",
      assignedTo: task.assignedTo ?? "",
      priority: task.priority ?? "",
      deadline: task.deadline ?? "",
      status: task.status ?? "Pending",
    });
  };

  const closeEdit = () => {
    setEditing(null);
    setEditValues(null);
  };

  const statusChipClasses = (status) => {
    const s = (status ?? "Pending").toString().trim().toLowerCase();
    const base = "task-chip";
    if (s === "completed") return `${base} task-chip-completed`;
    if (s === "in progress") return `${base} task-chip-progress`;
    return `${base} task-chip-pending`;
  };

  useEffect(() => {
    if (!focusId) return;
    if (focusHandledRef.current === focusId) return;

    const found = visible.find((t) => t.id === focusId);
    if (!found) return;

    focusHandledRef.current = focusId;
    setHighlightId(focusId);

    window.setTimeout(() => {
      const el = document.getElementById(`task-${focusId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);

    if (user?.role === "manager") {
      window.setTimeout(() => openEdit(found), 80);
    }

    const t = window.setTimeout(() => setHighlightId(null), 2200);
    return () => window.clearTimeout(t);
  }, [focusId, user?.role, visible]);

  if (visible.length === 0) {
    return (
      <div className="bg-[color:var(--panel)] mt-6 p-6 rounded-2xl border border-[color:var(--border)] text-center text-[color:var(--muted)] shadow-sm">
        No tasks to display.
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 bg-[color:var(--panel)] rounded-2xl border border-[color:var(--border)] overflow-x-auto shadow-sm">
        <table className="w-full text-left">
        <thead className="bg-black/[0.02] dark:bg-white/[0.04]">
          <tr>
            <th className="p-4 text-sm font-semibold text-[color:var(--muted)]">
              Title
            </th>
            <th className="p-4 text-sm font-semibold text-[color:var(--muted)]">
              Assigned To
            </th>
            <th className="p-4 text-sm font-semibold text-[color:var(--muted)]">
              Priority
            </th>
            <th className="p-4 text-sm font-semibold text-[color:var(--muted)]">
              Deadline
            </th>
            <th className="p-4 text-sm font-semibold text-[color:var(--muted)]">
              Status
            </th>
            <th className="p-4 text-sm font-semibold text-[color:var(--muted)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {visible.map((task) => (
            <tr
              key={task.id}
              id={`task-${task.id}`}
              className="border-t border-[color:var(--border)] hover:bg-black/5 dark:hover:bg-white/5 transition"
              style={
                highlightId === task.id
                  ? { outline: "2px solid var(--accent)", outlineOffset: "-2px" }
                  : undefined
              }
            >
              <td className="p-4 font-medium">{task.title}</td>
              <td className="p-4 text-[color:var(--muted)]">{task.assignedTo}</td>
              <td className="p-4 text-[color:var(--muted)]">{task.priority}</td>
              <td className="p-4 text-[color:var(--muted)]">{task.deadline}</td>
              <td className="p-4">
                <span className={statusChipClasses(task.status)}>
                  {task.status}
                </span>
              </td>
              <td className="p-4 flex gap-3">
                {user.role === "manager" && (
                  <>
                    <button
                      onClick={() => openEdit(task)}
                      className="font-semibold text-[color:var(--accent-ink)] hover:text-[color:var(--accent)] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="task-action-delete"
                      onClick={() => {
                        deleteTask(task.id);
                        toast({ variant: "success", title: "Task deleted" });
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
                {user.role === "member" && task.status !== "Completed" && (
                  <>
                    <button
                      onClick={() => changeStatus(task.id, "In Progress")}
                      className="font-semibold text-[color:var(--accent-ink)] hover:text-[color:var(--accent)] hover:underline"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => changeStatus(task.id, "Completed")}
                      className="font-semibold text-emerald-700 dark:text-green-300 hover:underline"
                    >
                      Complete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <Modal
        open={!!editing}
        onClose={closeEdit}
        title="Edit task"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeEdit}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!editing || !editValues) return;
                updateTask(editing.id, editValues);
                toast({ variant: "success", title: "Task updated", message: editValues.title });
                closeEdit();
              }}
            >
              Save changes
            </Button>
          </div>
        }
      >
        {editValues ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              value={editValues.title}
              onChange={(e) => setEditValues((v) => ({ ...v, title: e.target.value }))}
            />
            <Input
              label="Assigned to"
              value={editValues.assignedTo}
              onChange={(e) =>
                setEditValues((v) => ({ ...v, assignedTo: e.target.value }))
              }
            />

            <label className="block">
              <div className="text-sm font-semibold text-[color:var(--text)]">
                Priority
              </div>
              <select
                className="mt-1 w-full rounded-lg px-3 py-2 outline-none transition border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] focus:ring-2 focus:ring-[var(--ring)]"
                value={editValues.priority}
                onChange={(e) => setEditValues((v) => ({ ...v, priority: e.target.value }))}
              >
                <option value="">-- select --</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <Input
              label="Deadline"
              type="date"
              value={editValues.deadline}
              onChange={(e) => setEditValues((v) => ({ ...v, deadline: e.target.value }))}
            />

            <label className="block md:col-span-2">
              <div className="text-sm font-semibold text-[color:var(--text)]">
                Status
              </div>
              <select
                className="mt-1 w-full rounded-lg px-3 py-2 outline-none transition border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] focus:ring-2 focus:ring-[var(--ring)]"
                value={editValues.status}
                onChange={(e) => setEditValues((v) => ({ ...v, status: e.target.value }))}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

export default TaskTable;