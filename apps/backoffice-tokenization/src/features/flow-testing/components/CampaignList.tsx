import type { Campaign } from "../types";
import { CampaignCard } from "./CampaignCard";

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-12 text-center">
        No hay campañas en esta categoría.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      {campaigns.map((c, i) => (
        <CampaignCard key={c.id} campaign={c} index={i} />
      ))}
    </div>
  );
}
