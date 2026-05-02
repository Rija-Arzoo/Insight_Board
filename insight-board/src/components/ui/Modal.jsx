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
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain">
      <button
        type="button"
        className="fixed inset-0 min-h-[100dvh] bg-black/35"
        aria-label="Close modal"
        onClick={() => onClose?.()}
      />
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[680px] flex-col justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:py-10">
        <div className="relative flex max-h-[min(88dvh,760px)] w-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] shadow-2xl">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[color:var(--border)] px-4 py-4 sm:px-6">
            <div className="min-w-0">
              {title ? (
                <div className="truncate text-base font-bold text-[color:var(--text)]">
                  {title}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-[color:var(--border)] text-[color:var(--text)] transition hover:bg-black/5 dark:hover:bg-white/5"
              onClick={() => onClose?.()}
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
            {children}
          </div>

          {footer ? (
            <div className="shrink-0 border-t border-[color:var(--border)] px-4 py-4 sm:px-6">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}

