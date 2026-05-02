const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

const variants = {
  primary: "bg-[color:var(--accent)] text-white hover:brightness-95 shadow-sm",
  secondary:
    "border border-[color:var(--border)] bg-[color:var(--panel)] hover:brightness-[0.98] text-[color:var(--text)]",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "hover:bg-black/5 dark:hover:bg-white/5 text-[color:var(--text)]",
};

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const v = variants[variant] ?? variants.primary;
  return <button type={type} className={`${base} ${v} ${className}`} {...props} />;
}

