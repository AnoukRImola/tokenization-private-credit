import type { Campaign } from "../types";
import { CampaignRoiCard } from "./CampaignRoiCard";

interface CampaignRoiListProps {
  campaigns: Campaign[];
  onUpdated: () => void;
}

export function CampaignRoiList({
  campaigns,
  onUpdated,
}: CampaignRoiListProps) {
  if (campaigns.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-12 text-center">
        No campaigns found.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      {campaigns.map((c, i) => (
        <CampaignRoiCard
          key={c.id}
          campaign={c}
          index={i}
          onUpdated={onUpdated}
        />
      ))}
    </div>
  );
}
