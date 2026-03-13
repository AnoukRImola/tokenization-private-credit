"use client";

import { useState, useEffect } from "react";
import { Button } from "@tokenization/ui/button";
import type { Campaign } from "../types";
import { CampaignRoiCard } from "./CampaignRoiCard";

const PAGE_SIZE = 4;

interface CampaignRoiListProps {
  campaigns: Campaign[];
  onUpdated: () => void;
}

export function CampaignRoiList({
  campaigns,
  onUpdated,
}: CampaignRoiListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [campaigns]);

  if (campaigns.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-12 text-center">
        No campaigns found.
      </p>
    );
  }

  const visible = campaigns.slice(0, visibleCount);
  const hasMore = visibleCount < campaigns.length;

  return (
    <div className="flex flex-col gap-3 mt-4">
      {visible.map((c, i) => (
        <CampaignRoiCard
          key={c.id}
          campaign={c}
          index={i}
          onUpdated={onUpdated}
        />
      ))}
      {hasMore && (
        <div className="flex justify-center mt-2">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
