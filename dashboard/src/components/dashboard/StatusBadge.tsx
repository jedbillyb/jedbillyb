interface StatusBadgeProps {
  status: "active" | "inactive" | "warning";
  label?: string;
}

const styles = {
  active: "border-success/40 bg-success/10 text-success",
  inactive: "border-destructive/40 bg-destructive/10 text-destructive",
  warning: "border-warning/40 bg-warning/10 text-warning",
} as const;

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const text = label ?? status.toUpperCase();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${styles[status]}`}
    >
      <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {text}
    </span>
  );
}
