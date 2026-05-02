import { createContext, useContext, useEffect, useMemo, useState } from "react";

const MobileNavContext = createContext(null);

export function MobileNavProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const value = useMemo(
    () => ({
      sidebarOpen,
      openSidebar: () => setSidebarOpen(true),
      closeSidebar: () => setSidebarOpen(false),
      toggleSidebar: () => setSidebarOpen((v) => !v),
    }),
    [sidebarOpen]
  );

  useEffect(() => {
    if (!sidebarOpen) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const unlock = () => {
      if (mq.matches) setSidebarOpen(false);
    };
    mq.addEventListener("change", unlock);
    return () => mq.removeEventListener("change", unlock);
  }, [sidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  return (
    <MobileNavContext.Provider value={value}>{children}</MobileNavContext.Provider>
  );
}

// Hook is colocated with provider; fast-refresh allows single hook export from context modules.
// eslint-disable-next-line react-refresh/only-export-components -- useMobileNav is the public API
export function useMobileNav() {
  const ctx = useContext(MobileNavContext);
  if (!ctx) {
    throw new Error("useMobileNav must be used within MobileNavProvider");
  }
  return ctx;
}
