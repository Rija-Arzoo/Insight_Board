import { useLayoutEffect, useState } from "react";
import { ThemeContext } from "../hooks/ThemeContext";


export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("themeMode") || "light");
  const [preset, setPreset] = useState(() => localStorage.getItem("themePreset") || "lavender");

  // Prevent "dark class" flash from previous sessions.
  useLayoutEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  useLayoutEffect(() => {
    localStorage.setItem("themeMode", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useLayoutEffect(() => {
    localStorage.setItem("themePreset", preset);
    document.documentElement.classList.remove("theme-lavender", "theme-sky", "theme-mint");
    document.documentElement.classList.add(`theme-${preset}`);
  }, [preset]);

  const toggleTheme = () => {
    setTheme((t) => {
      return t === "dark" ? "light" : "dark";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, preset, setPreset, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}