import { FiCheckCircle, FiInfo, FiX, FiXCircle } from "react-icons/fi";

const iconFor = (variant) => {
  switch (variant) {
    case "success":
      return FiCheckCircle;
    case "error":
      return FiXCircle;
    default:
      return FiInfo;
  }
};

const colorFor = (variant) => {
  switch (variant) {
    case "success":
      return "border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)]";
    case "error":
      return "border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)]";
    default:
      return "border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)]";
  }
};

const stripeFor = (variant) => {
  switch (variant) {
    case "success":
      return "bg-emerald-500";
    case "error":
      return "bg-rose-500";
    default:
      return "bg-[color:var(--accent)]";
  }
};

export default function Toaster({ items, onDismiss }) {
  if (!items?.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-[min(92vw,360px)]">
      {items.map((t) => {
        const Icon = iconFor(t.variant);
        return (
          <div
            key={t.id}
            className={[
              "rounded-2xl border shadow-lg overflow-hidden",
              colorFor(t.variant),
            ].join(" ")}
          >
            <div className="flex items-stretch">
              <div className={`w-1 ${stripeFor(t.variant)}`} />
              <div className="flex items-start gap-3 p-4 flex-1">
              <div className="mt-0.5">
                <Icon />
              </div>
              <div className="min-w-0 flex-1">
                {t.title ? (
                  <div className="text-sm font-bold truncate">{t.title}</div>
                ) : null}
                {t.message ? (
                  <div className="text-sm text-[color:var(--muted)] mt-0.5">{t.message}</div>
                ) : null}
              </div>
              <button
                type="button"
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-transparent hover:border-[color:var(--border)] hover:bg-black/5 dark:hover:bg-white/5 transition"
                onClick={() => onDismiss?.(t.id)}
                aria-label="Dismiss"
              >
                <FiX />
              </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

