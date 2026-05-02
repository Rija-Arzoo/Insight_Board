import { useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContext } from "../hooks/ToastContext";
import Toaster from "../components/ui/Toaster";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = uuidv4();
    const t = {
      id,
      title: toast?.title ?? "",
      message: toast?.message ?? "",
      variant: toast?.variant ?? "info", // info | success | error
      timeoutMs: toast?.timeoutMs ?? 2500,
    };

    setToasts((prev) => [t, ...prev].slice(0, 5));

    window.setTimeout(() => dismiss(id), t.timeoutMs);
  }, [dismiss]);

  const api = useMemo(
    () => ({
      toast: push,
      dismiss,
    }),
    [dismiss, push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster items={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

