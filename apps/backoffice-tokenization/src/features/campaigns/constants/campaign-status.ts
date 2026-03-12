import type { CampaignStatus } from "@/features/campaigns/types/campaign.types";

export const CAMPAIGN_STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; className: string }
> = {
  active: { label: "Activa", className: "bg-success-bg text-success border-success/30" },
  pending: { label: "Pendiente", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  draft: { label: "Borrador", className: "bg-secondary text-text-muted border-border" },
  completed: { label: "Completada", className: "bg-secondary text-text-muted border-border" },
  cancelled: { label: "Cancelada", className: "bg-destructive/10 text-destructive border-destructive/20" },
};
