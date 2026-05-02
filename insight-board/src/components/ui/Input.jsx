export default function Input({
  label,
  error,
  className = "",
  inputClassName = "",
  ...props
}) {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <div className="text-sm font-semibold text-[color:var(--text)]">
          {label}
        </div>
      ) : null}
      <input
        className={[
          "mt-1 w-full rounded-lg px-3 py-2 outline-none transition",
          "border border-[color:var(--border)] bg-[color:var(--panel)] text-[color:var(--text)]",
          "focus:ring-2 focus:ring-[var(--ring)]",
          "caret-[color:var(--accent)] placeholder:text-[color:var(--muted)]",
          error ? "border-red-400 dark:border-red-500" : "",
          inputClassName,
        ].join(" ")}
        {...props}
      />
      {error ? (
        <div className="mt-1 text-sm text-red-600 dark:text-red-300">{error}</div>
      ) : null}
    </label>
  );
}

