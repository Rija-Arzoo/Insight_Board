const SummaryCard = ({ title, value }) => {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[color:var(--muted)]">{title}</h2>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-[color:var(--text)]">
        {value}
      </p>
    </div>
  );
};

export default SummaryCard;
