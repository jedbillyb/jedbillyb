interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  accent?: "primary" | "success" | "warning" | "danger";
}

const accentMap = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const;

export function StatCard({ label, value, hint, accent = "primary" }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition-colors hover:border-border-strong">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className={`mt-2 font-mono text-2xl font-semibold ${accentMap[accent]}`}>
        {value}
      </div>
      {hint && (
        <div className="mt-1 font-mono text-xs text-muted-foreground">{hint}</div>
      )}
    </div>
  );
}
