import type { CampaignStatus } from "../types/campaign.types";

export const CAMPAIGN_STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; className: string }
> = {
  READY: { label: "Ready", className: "bg-success-bg text-success border-success/30" },
  PENDING: { label: "Pending", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  CLOSED: { label: "Closed", className: "bg-secondary text-text-muted border-border" },
};
