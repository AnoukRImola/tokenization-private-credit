"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetEscrowFromIndexerByContractIds } from "@trustless-work/escrow";
import type { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow/types";
import { ProjectCard } from "./ProjectCard";
import type { CampaignFromApi } from "./types";

interface CampaignsGridProps {
  campaigns: CampaignFromApi[];
  isLoading?: boolean;
}

export function CampaignsGrid({ campaigns, isLoading }: CampaignsGridProps) {
  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();

  const escrowIds = useMemo(
    () => campaigns.map((c) => c.escrowId).filter(Boolean),
    [campaigns],
  );

  const { data: escrowsList, isLoading: isEscrowsLoading } = useQuery({
    queryKey: ["escrows-by-ids", escrowIds],
    queryFn: async () => {
      const result = await getEscrowByContractIds({
        contractIds: escrowIds,
        validateOnChain: false,
      });
      const list = Array.isArray(result)
        ? result
        : result
          ? [result]
          : [];
      return list as GetEscrowsFromIndexerResponse[];
    },
    enabled: escrowIds.length > 0,
    staleTime: 1000 * 60 * 10,
  });

  const escrowsById = useMemo(() => {
    if (!escrowsList || !Array.isArray(escrowsList)) return {};
    return escrowsList.reduce(
      (acc, item, idx) => {
        const key =
          (item as { contractId?: string })?.contractId ?? escrowIds[idx];
        if (key) acc[key] = item;
        return acc;
      },
      {} as Record<string, GetEscrowsFromIndexerResponse>,
    );
  }, [escrowsList, escrowIds]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProjectCard
            key={`skeleton-${i}`}
            campaign={{} as CampaignFromApi}
            isLoading
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {campaigns.map((campaign) => (
        <ProjectCard
          key={campaign.id}
          campaign={campaign}
          escrow={escrowsById[campaign.escrowId]}
          isLoading={isEscrowsLoading}
        />
      ))}
    </div>
  );
}
