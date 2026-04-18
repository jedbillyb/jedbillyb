import type { ReactNode } from "react";

interface SectionProps {
  index: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Section({ index, title, description, children }: SectionProps) {
  return (
    <section className="mt-20 first:mt-0">
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
            {index}
          </div>
          <h2 className="mt-1 font-mono text-2xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
