import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export interface ServiceCardProps {
  name: string;
  status: "active" | "inactive" | "warning";
  statusLabel?: string;
  port?: string | number;
  meta: Array<{ label: string; value: string }>;
  details?: Array<{ summary: string; code?: string; envKeys?: string }>;
}

export function ServiceCard({ name, status, statusLabel, port, meta, details }: ServiceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/40 hover:shadow-[0_0_30px_-10px_oklch(0.72_0.15_250_/_0.35)]">
      <div className="flex items-start justify-between gap-4 border-b border-border bg-gradient-to-b from-card to-card/50 p-5">
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-muted-foreground">$</div>
          <div>
            <h3 className="font-mono text-base font-semibold text-foreground">{name}</h3>
            {port && (
              <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                :{port}
              </div>
            )}
          </div>
        </div>
        <StatusBadge status={status} label={statusLabel} />
      </div>

      <dl className="divide-y divide-border/60">
        {meta.map((m) => (
          <div key={m.label} className="grid grid-cols-[140px_1fr] gap-4 px-5 py-2.5">
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {m.label}
            </dt>
            <dd className="break-all font-mono text-xs text-foreground">{m.value}</dd>
          </div>
        ))}
      </dl>

      {details && details.map((d, i) => <Detail key={i} {...d} />)}
    </div>
  );
}

function Detail({ summary, code, envKeys }: { summary: string; code?: string; envKeys?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-5 py-3 text-left font-mono text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
      >
        <ChevronRight
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-90 text-primary" : ""}`}
        />
        {summary}
      </button>
      {open && (
        <div className="space-y-3 border-t border-border bg-code/60 p-4">
          {code && (
            <pre className="overflow-x-auto rounded-md border border-border bg-code p-3 font-mono text-xs leading-relaxed text-foreground/90">
              <code>{code}</code>
            </pre>
          )}
          {envKeys && (
            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Env Keys
              </div>
              <div className="flex flex-wrap gap-1.5">
                {envKeys.split(",").map((k) => (
                  <span
                    key={k}
                    className="rounded border border-border bg-card px-2 py-0.5 font-mono text-[11px] text-primary"
                  >
                    {k.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
