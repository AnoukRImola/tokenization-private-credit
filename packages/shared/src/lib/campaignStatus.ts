import type { SharedCampaignStatus } from "../types/campaign";

export type CampaignStatusConfig = { label: string; className: string };

/**
 * Returns a consistent status config for campaign badges (labels + Tailwind classes).
 * Pass your campaigns namespace translator, e.g. useTranslations("campaigns").
 * Translation keys: status.DRAFT, status.FUNDRAISING, status.ACTIVE, etc.
 */
export function getCampaignStatusConfig(
  t: (key: string) => string,
): Record<SharedCampaignStatus, CampaignStatusConfig> {
  return {
    DRAFT: { label: t("status.DRAFT"), className: "bg-secondary text-text-muted border-border" },
    FUNDRAISING: { label: t("status.FUNDRAISING"), className: "bg-blue-50 text-blue-600 border-blue-200" },
    ACTIVE: { label: t("status.ACTIVE"), className: "bg-success-bg text-success border-success/30" },
    REPAYMENT: { label: t("status.REPAYMENT"), className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    CLAIMABLE: { label: t("status.CLAIMABLE"), className: "bg-purple-50 text-purple-700 border-purple-200" },
    CLOSED: { label: t("status.CLOSED"), className: "bg-secondary text-text-muted border-border" },
    PAUSED: { label: t("status.PAUSED"), className: "bg-orange-50 text-orange-700 border-orange-200" },
  };
}
