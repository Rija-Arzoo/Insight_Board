import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/35"
        aria-label="Close modal"
        onClick={() => onClose?.()}
      />
      <div className="relative mx-auto mt-20 w-[min(92vw,680px)] rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-2xl">
        <div className="px-6 py-4 border-b border-[color:var(--border)] flex items-center justify-between gap-4">
          <div className="min-w-0">
            {title ? (
              <div className="truncate text-base font-bold text-[color:var(--text)]">
                {title}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-[color:var(--border)] hover:bg-black/5 dark:hover:bg-white/5 transition text-[color:var(--text)]"
            onClick={() => onClose?.()}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? (
          <div className="px-6 py-4 border-t border-[color:var(--border)]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}

