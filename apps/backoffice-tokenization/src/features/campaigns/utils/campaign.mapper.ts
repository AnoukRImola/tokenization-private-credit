import type { Campaign } from "@/features/campaigns/types/campaign.types";

export function mapCampaignProgress(campaign: Campaign): number {
  if (campaign.targetAmount === 0) return 0;
  return Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100);
}
