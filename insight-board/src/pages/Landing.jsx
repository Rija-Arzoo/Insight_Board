import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import Button from "../components/ui/Button";

function Landing() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-4 py-2 text-sm font-semibold text-[color:var(--text)] shadow-sm">
          InsightBoard <span className="opacity-50">•</span> Team productivity suite
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[color:var(--text)]">
              Plan work. Track progress. Ship faster.
            </h1>
            <p className="mt-4 text-lg text-[color:var(--muted)] max-w-xl">
              A modern task + analytics dashboard with role-based access, activity feed,
              Kanban board, CSV export, and beautiful themes.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link to="/login" className="inline-flex">
                <Button variant="primary" className="px-6 py-3">
                  Get started
                </Button>
              </Link>
              <Link to={user ? "/dashboard" : "/login"} className="inline-flex">
                <Button variant="secondary" className="px-6 py-3">
                  View dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold text-[color:var(--muted)]">
              {["Role-based access", "Kanban + Table", "Activity feed", "Themes + Dark mode"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[color:var(--border)] bg-[color:var(--panel)] px-3 py-1"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[color:var(--border)] flex items-center justify-between">
                <div className="text-sm font-bold text-[color:var(--text)]">Today</div>
                <div className="text-xs font-semibold text-[color:var(--muted)]">
                  Theme-ready UI
                </div>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Design new landing", tag: "In Progress", color: "bg-violet-500" },
                  { title: "Finish analytics", tag: "Pending", color: "bg-amber-500" },
                  { title: "Review PRs", tag: "Completed", color: "bg-emerald-500" },
                  { title: "Prepare report", tag: "Pending", color: "bg-amber-500" },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel-2)] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-bold text-sm text-[color:var(--text)] truncate">
                        {c.title}
                      </div>
                      <div className={`h-2.5 w-2.5 rounded-full ${c.color}`} />
                    </div>
                    <div className="mt-3 inline-flex items-center rounded-full border border-[color:var(--border)] px-2 py-0.5 text-xs font-bold text-[color:var(--muted)]">
                      {c.tag}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="pointer-events-none absolute -z-10 -inset-6 rounded-[40px] blur-2xl opacity-30"
              style={{
                background:
                  "radial-gradient(500px 300px at 20% 20%, var(--accent), transparent 60%), radial-gradient(500px 300px at 80% 40%, var(--accent-2), transparent 60%)",
              }}
            />
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Managers + members",
              desc: "Managers create and assign; members execute and update status.",
            },
            {
              title: "Fast navigation",
              desc: "Search with suggestions and jump to the exact task instantly.",
            },
            {
              title: "Polished UX",
              desc: "Reusable components, modals, toasts, and consistent theming.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel)] p-6 shadow-sm"
            >
              <div className="font-extrabold text-[color:var(--text)]">{f.title}</div>
              <div className="mt-2 text-sm text-[color:var(--muted)]">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;