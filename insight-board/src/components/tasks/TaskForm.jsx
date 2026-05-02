import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import { useAuth } from "../../hooks/AuthContext";
import { validateTask } from "../../utils/validation";
import { useToast } from "../../hooks/ToastContext";
import Button from "../ui/Button";

function TaskForm() {
  const { user } = useAuth();
  const { addTask } = useTasks();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState("");
  const [errors, setErrors] = useState({});
  const [members, setMembers] = useState(() => {
    const list = JSON.parse(localStorage.getItem("users") || "[]");
    return list.filter((u) => u.role === "member");
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, errors: errs } = validateTask({
      title,
      description,
      assignedTo,
      priority,
      deadline,
    });
    setErrors(errs);
    if (!valid) return;

    addTask({ title, description, assignedTo, priority, deadline });
    toast({ variant: "success", title: "Task created", message: title });

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setPriority("");
    setDeadline("");
    setErrors({});
  };

  if (user?.role !== "manager") {
    return null; // only managers can create tasks
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-sm sm:p-6"
    >
      <div>
        <label className="block text-sm font-semibold text-[color:var(--text)]">
          Title
        </label>
        <input
          className="mt-1 border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-[var(--ring)]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-[color:var(--text)]">
          Description
        </label>
        <textarea
          className="mt-1 border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-[var(--ring)] min-h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-[color:var(--text)]">
          Assign To
        </label>
        <select
          className="mt-1 border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-[var(--ring)]"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">-- choose member --</option>
          {members.map((m) => (
            <option key={m.email} value={m.email}>
              {m.email}
            </option>
          ))}
        </select>
        {errors.assignedTo && (
          <p className="text-red-500 text-sm">{errors.assignedTo}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[color:var(--text)]">
            Priority
          </label>
          <select
            className="mt-1 border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-[var(--ring)]"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">-- select --</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && (
            <p className="text-red-500 text-sm">{errors.priority}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[color:var(--text)]">
            Deadline
          </label>
          <input
            type="date"
            className="mt-1 border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-[var(--ring)]"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          {errors.deadline && (
            <p className="text-red-500 text-sm">{errors.deadline}</p>
          )}
        </div>
      </div>

      <Button type="submit">Create Task</Button>
    </form>
  );
}

export default TaskForm;