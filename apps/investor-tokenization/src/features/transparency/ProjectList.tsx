"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetEscrowFromIndexerByContractIds } from "@trustless-work/escrow";
import type { GetEscrowsFromIndexerResponse } from "@trustless-work/escrow/types";
import { ProjectCard } from "./ProjectCard";

const data = [
  {
    escrowId: "CCZHTYVLK6R2QMIFBTEN65ZVCSFBD3L5TXYCZJT5WTXE63ABYXBBCSEB",
    tokenSale: "CC2AGB3AW5IITDIPEZGVX6XT5RTDIVINRZL7F6KZPIHEWN2GRXL5CRCT",
    tokenFactory: "CDJTII2GR2FY6Q4NDJGZI7NW2SHQ7GR5Y2H7B7Q253PTZZAZZ25TFYYU",
    src: "/escrows/car.png",
  },
];

interface ProjectListProps {
  search?: string;
  filter?: string;
}

export const ProjectList = ({ search = "", filter = "all" }: ProjectListProps) => {
  const { getEscrowByContractIds } = useGetEscrowFromIndexerByContractIds();
  const escrowIds = data.map((d) => d.escrowId);

  const { data: escrowsList, isLoading } = useQuery({
    queryKey: ["escrows-by-ids", escrowIds],
    queryFn: async () => {
      const result = await getEscrowByContractIds({
        contractIds: escrowIds,
        validateOnChain: true,
      });
      const list = Array.isArray(result)
        ? result
        : result
          ? [result]
          : [];
      return list as GetEscrowsFromIndexerResponse[];
    },
    enabled: escrowIds.length > 0,
  });

  const escrowsById =
    escrowsList && Array.isArray(escrowsList)
      ? escrowsList.reduce(
          (acc, item, idx) => {
            const key =
              (item as { contractId?: string })?.contractId ?? escrowIds[idx];
            if (key) acc[key] = item;
            return acc;
          },
          {} as Record<string, GetEscrowsFromIndexerResponse>
        )
      : {};

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const escrow = escrowsById[item.escrowId];
      if (search) {
        const q = search.toLowerCase();
        const title = (escrow?.title ?? "").toLowerCase();
        const desc = (escrow?.description ?? "").toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }
      if (filter === "active") return escrow?.isActive === true;
      if (filter === "fundraising") return !escrow?.isActive;
      return true;
    });
  }, [search, filter, escrowsById]);

  return (
    <div className="space-y-4">
      {filteredData.map((item) => {
        const escrow = escrowsById[item.escrowId];
        return (
          <ProjectCard
            key={item.escrowId}
            escrowId={item.escrowId}
            tokenSale={item.tokenSale}
            tokenFactory={item.tokenFactory}
            imageSrc={item.src}
            escrow={escrow}
            isLoading={isLoading}
          />
        );
      })}
    </div>
  );
};
