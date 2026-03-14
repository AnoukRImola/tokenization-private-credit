import type { CampaignStatus } from "../types/campaign.types";

type StatusConfig = { label: string; className: string };

type TranslationFn = (key: string) => string;

export function getCampaignStatusConfig(
  t: TranslationFn,
): Record<CampaignStatus, StatusConfig> {
  return {
    DRAFT: { label: t("status.DRAFT"), className: "bg-secondary text-text-muted border-border" },
    FUNDRAISING: { label: t("status.FUNDRAISING"), className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    ACTIVE: { label: t("status.ACTIVE"), className: "bg-success-bg text-success border-success/30" },
    REPAYMENT: { label: t("status.REPAYMENT"), className: "bg-blue-50 text-blue-700 border-blue-200" },
    CLAIMABLE: { label: t("status.CLAIMABLE"), className: "bg-purple-50 text-purple-700 border-purple-200" },
    CLOSED: { label: t("status.CLOSED"), className: "bg-secondary text-text-muted border-border" },
    PAUSED: { label: t("status.PAUSED"), className: "bg-orange-50 text-orange-700 border-orange-200" },
  };
}

/**
 * @deprecated Use getCampaignStatusConfig(t) instead for i18n support.
 */
export const CAMPAIGN_STATUS_CONFIG: Record<CampaignStatus, StatusConfig> = {
  DRAFT: { label: "Draft", className: "bg-secondary text-text-muted border-border" },
  FUNDRAISING: { label: "Fundraising", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  ACTIVE: { label: "Active", className: "bg-success-bg text-success border-success/30" },
  REPAYMENT: { label: "Repayment", className: "bg-blue-50 text-blue-700 border-blue-200" },
  CLAIMABLE: { label: "Claimable", className: "bg-purple-50 text-purple-700 border-purple-200" },
  CLOSED: { label: "Closed", className: "bg-secondary text-text-muted border-border" },
  PAUSED: { label: "Paused", className: "bg-orange-50 text-orange-700 border-orange-200" },
};
