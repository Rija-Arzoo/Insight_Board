import { FiCheckCircle, FiEdit2, FiPlusCircle, FiTrash2, FiRefreshCw } from "react-icons/fi";

const iconFor = (type) => {
  switch (type) {
    case "task.created":
      return FiPlusCircle;
    case "task.updated":
      return FiEdit2;
    case "task.deleted":
      return FiTrash2;
    case "task.status":
      return FiRefreshCw;
    default:
      return FiCheckCircle;
  }
};

const formatWhen = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
};

export default function ActivityFeed({ items }) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-bold text-[color:var(--text)]">Activity</div>
        <div className="text-xs text-[color:var(--muted)]">Last 100 saved</div>
      </div>

      {items?.length ? (
        <ul className="mt-4 space-y-3">
          {items.slice(0, 8).map((a) => {
            const Icon = iconFor(a.type);
            return (
              <li key={a.id} className="flex gap-3">
                <div className="mt-0.5 h-8 w-8 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center text-[color:var(--text)]">
                  <Icon />
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-[color:var(--text)]">{a.message}</div>
                  <div className="text-xs text-[color:var(--muted)]">{formatWhen(a.at)}</div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-4 text-sm text-[color:var(--muted)]">
          No activity yet. Create or update a task to see events here.
        </div>
      )}
    </div>
  );
}

