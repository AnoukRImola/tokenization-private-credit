import type { ReactNode } from "react";
import { cn } from "@tokenization/shared/lib/utils";

export interface CampaignCardProps {
  title: string;
  description: string;
  statusBadge: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  stat?: { label: string; value: number };
  className?: string;
  children?: ReactNode;
}

export function CampaignCard({
  title,
  description,
  statusBadge,
  actions,
  footer,
  stat,
  className,
  children,
}: CampaignCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-5",
        "shadow-card hover:shadow-hover",
        "transition-shadow duration-200",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        {statusBadge}
        {actions}
      </div>

      <div className="flex flex-col gap-0.5">
        <h3 className="text-lg font-bold text-foreground leading-tight">
          {title}
        </h3>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
        {description}
      </p>

      {children}

      <div className="flex items-end justify-between gap-4 pt-1">
        {footer && <div className="flex items-center gap-2">{footer}</div>}

        {stat && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
              {stat.label}
            </span>
            <span className="text-lg font-bold text-foreground">
              {stat.value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
