"use client";

import { Card, CardContent } from "@tokenization/ui/card";
import { Badge } from "@tokenization/ui/badge";
import { Button } from "@tokenization/ui/button";
import {
  formatCurrency,
} from "@tokenization/tw-blocks-shared/src/helpers/format.helper";
import type {
  GetEscrowsFromIndexerResponse as Escrow,
  MultiReleaseMilestone,
} from "@trustless-work/escrow/types";
import { InvestDialog } from "@/features/tokens/components/InvestDialog";
import { SelectedEscrowProvider } from "@/features/tokens/context/SelectedEscrowContext";
import { Rocket } from "lucide-react";

export type ProjectCardProps = {
  escrow: Escrow | undefined;
  escrowId: string;
  tokenSale?: string;
  tokenFactory?: string;
  imageSrc?: string;
  isLoading?: boolean;
};

function getLoansCompleted(escrow: Escrow | undefined): number {
  if (!escrow?.milestones) return 0;
  const milestones = escrow.milestones as MultiReleaseMilestone[];
  return milestones.filter((m) => m.status === "Approved").length;
}

function getMinInvest(escrow: Escrow | undefined): number {
  if (!escrow?.milestones?.length) return 100;
  const milestones = escrow.milestones as MultiReleaseMilestone[];
  const amounts = milestones.map((m) => Number(m.amount));
  return Math.min(...amounts);
}

export const ProjectCard = ({
  escrow,
  escrowId,
  tokenSale,
  imageSrc,
  isLoading = false,
}: ProjectCardProps) => {
  const title = escrow?.title ?? "Loading...";
  const description = escrow?.description ?? "";
  const loansCompleted = getLoansCompleted(escrow);
  const minInvest = getMinInvest(escrow);
  const currency = escrow?.trustline?.symbol ?? "USDC";

  if (isLoading) {
    return (
      <Card className="px-6 py-5">
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex items-start justify-between">
            <div className="h-6 w-48 animate-pulse rounded bg-muted" />
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              <div className="h-5 w-24 animate-pulse rounded bg-muted" />
              <div className="h-5 w-20 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-9 w-24 animate-pulse rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="px-6 py-5">
      <CardContent className="flex flex-col gap-3 p-0">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge className="bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-100">
            FUNDRAISING
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description || "No description"}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Loans Completed
              </span>
              <span className="font-medium">{loansCompleted}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Min. Invest
              </span>
              <span className="font-medium">
                {formatCurrency(minInvest, currency)}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            {tokenSale ? (
              <SelectedEscrowProvider
                value={{
                  escrow,
                  escrowId,
                  tokenSaleContractId: tokenSale,
                  imageSrc,
                }}
              >
                <InvestDialog tokenSaleContractId={tokenSale} />
              </SelectedEscrowProvider>
            ) : (
              <Button
                disabled
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                <Rocket className="h-4 w-4" />
                Invest
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
