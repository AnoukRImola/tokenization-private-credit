"use client";

import React from "react";
import { Button } from "@tokenization/ui/button";
import type {
  GetEscrowsFromIndexerResponse as Escrow,
  MultiReleaseMilestone,
  SingleReleaseMilestone,
} from "@trustless-work/escrow/types";
import { Filters } from "./Filters";
import { useEscrowsBySigner } from "../useEscrowsBySigner.shared";
import { Card, CardContent, CardHeader, CardTitle } from "@tokenization/ui/card";
import { Badge } from "@tokenization/ui/badge";
import { Separator } from "@tokenization/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@tokenization/ui/tooltip";
import {
  Goal,
  Wallet,
  Loader2,
  AlertTriangle,
  RefreshCw,
  FileX,
} from "lucide-react";
import { useEscrowContext } from "@tokenization/tw-blocks-shared/src/providers/EscrowProvider";
import { useEscrowDialogs } from "@tokenization/tw-blocks-shared/src/providers/EscrowDialogsProvider";
import { EscrowDetailDialog } from "../details/EscrowDetailDialog";
import {
  formatCurrency,
  formatTimestamp,
} from "../../../helpers/format.helper";
import { useSharedTranslation } from "../../../i18n/TranslationProvider";

export const EscrowsBySignerCards = () => {
  const { t } = useSharedTranslation();
  const {
    walletAddress,
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    nextData,
    isFetchingNext,
    page,
    setPage,
    orderBy,
    setOrderBy,
    orderDirection,
    setOrderDirection,
    sorting,
    title,
    setTitle,
    engagementId,
    setEngagementId,
    isActive,
    setIsActive,
    validateOnChain,
    setValidateOnChain,
    type,
    setType,
    status,
    setStatus,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    dateRange,
    setDateRange,
    formattedRangeLabel,
    onClearFilters,
    handleSortingChange,
  } = useEscrowsBySigner();

  const { setSelectedEscrow } = useEscrowContext();

  const dialogStates = useEscrowDialogs();

  const handleRefresh = React.useCallback(() => {
    void refetch();
  }, [refetch]);

  function allMilestonesReleasedOrResolved(
    milestones: MultiReleaseMilestone[]
  ) {
    return milestones.every(
      (milestone) => milestone.flags?.released || milestone.flags?.resolved
    );
  }

  function allMilestonesApproved(milestones: SingleReleaseMilestone[]) {
    return milestones.every((milestone) => milestone.approved);
  }

  function getSingleReleaseStatus(
    flags: { disputed?: boolean; resolved?: boolean; released?: boolean } = {}
  ) {
    if (flags.disputed) return { label: t("escrow.cards.disputed"), variant: "destructive" };
    if (flags.resolved) return { label: t("escrow.cards.resolvedTooltip"), variant: "outline" };
    if (flags.released) return { label: t("escrow.cards.releasedTooltip"), variant: "outline" };
    return { label: t("escrow.filters.working"), variant: "outline" };
  }

  const currentSort = sorting?.[0];
  const sortField =
    (currentSort?.id as "amount" | "createdAt" | "updatedAt" | undefined) ??
    undefined;
  const sortDesc = currentSort?.desc ?? true;

  const setSort = (field: "amount" | "createdAt" | "updatedAt") => {
    if (sortField === field) {
      handleSortingChange([{ id: field, desc: !sortDesc }]);
    } else {
      handleSortingChange([{ id: field, desc: true }]);
    }
  };

  const clearSort = () => handleSortingChange([]);

  const onCardClick = (escrow: Escrow) => {
    setSelectedEscrow(escrow);
    dialogStates.second.setIsOpen(true);
  };

  const escrows: Escrow[] = data ?? [];

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <Filters
          title={title}
          engagementId={engagementId}
          isActive={isActive}
          validateOnChain={validateOnChain}
          type={type}
          status={status}
          minAmount={minAmount}
          maxAmount={maxAmount}
          dateRange={dateRange}
          formattedRangeLabel={formattedRangeLabel}
          setTitle={setTitle}
          setEngagementId={setEngagementId}
          setIsActive={setIsActive}
          setValidateOnChain={setValidateOnChain}
          setType={setType}
          setStatus={setStatus}
          setMinAmount={setMinAmount}
          setMaxAmount={setMaxAmount}
          setDateRange={setDateRange}
          onClearFilters={onClearFilters}
          onRefresh={handleRefresh}
          isRefreshing={isFetching}
          orderBy={orderBy}
          orderDirection={orderDirection}
          setOrderBy={setOrderBy}
          setOrderDirection={setOrderDirection}
        />

        <div className="w-full py-2 sm:py-4">
          <div className="mb-2 sm:mb-3 flex items-center justify-end gap-2">
            <span className="hidden sm:block text-xs text-muted-foreground">
              {t("escrow.cards.sort")}
            </span>
            <Button
              className="cursor-pointer"
              variant={sortField === "createdAt" ? "default" : "outline"}
              size="sm"
              onClick={() => setSort("createdAt")}
            >
              {t("escrow.filters.created")} {sortField === "createdAt" ? (sortDesc ? "▼" : "▲") : ""}
            </Button>
            <Button
              className="cursor-pointer"
              variant={sortField === "updatedAt" ? "default" : "outline"}
              size="sm"
              onClick={() => setSort("updatedAt")}
            >
              {t("escrow.filters.updated")} {sortField === "updatedAt" ? (sortDesc ? "▼" : "▲") : ""}
            </Button>
            <Button
              className="cursor-pointer"
              variant={sortField === "amount" ? "default" : "outline"}
              size="sm"
              onClick={() => setSort("amount")}
            >
              {t("escrow.filters.amount")} {sortField === "amount" ? (sortDesc ? "▼" : "▲") : ""}
            </Button>
            <Button
              className="cursor-pointer"
              variant="ghost"
              size="sm"
              onClick={clearSort}
              disabled={!currentSort}
            >
              {t("escrow.cards.reset")}
            </Button>
          </div>
          <div className="mt-2 sm:mt-4 overflow-x-auto">
            {!walletAddress ? (
              <div>
                <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                  <Wallet className="h-8 w-8 md:h-12 md:w-12 text-primary mb-3" />
                  <h3 className="font-medium text-foreground mb-2">
                    {t("escrow.cards.connectWallet")}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {t("escrow.cards.connectWalletDesc")}
                  </p>
                </div>
              </div>
            ) : isLoading ? (
              <div>
                <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                  <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {t("escrow.cards.loading")}
                  </p>
                </div>
              </div>
            ) : isError ? (
              <div>
                <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                  <AlertTriangle className="h-8 w-8 md:h-10 md:w-10 text-destructive mb-3" />
                  <h3 className="font-medium text-foreground mb-2">
                    {t("escrow.cards.errorTitle")}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-4">
                    {t("escrow.cards.errorDesc")}
                  </p>
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t("escrow.cards.retry")}
                  </Button>
                </div>
              </div>
            ) : escrows.length === 0 ? (
              <div>
                <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                  <FileX className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground/60 mb-3" />
                  <h3 className="font-medium text-foreground mb-2">
                    {t("escrow.cards.noDataTitle")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("escrow.cards.noDataDesc")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-2">
                {escrows.map((escrow) => (
                  <React.Fragment key={escrow.contractId}>
                    <Card
                      className="w-full max-w-md mx-auto hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCardClick(escrow);
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
                            {escrow.title}
                          </CardTitle>
                          <Badge
                            variant={isActive ? "default" : "destructive"}
                            className="shrink-0"
                          >
                            {isActive ? t("escrow.filters.active") : t("escrow.filters.inactive")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {escrow.description}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Amount Section */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t("escrow.filters.amount")}</span>
                            <span className="font-semibold">
                              {escrow.type === "single-release"
                                ? formatCurrency(
                                  escrow.amount,
                                  escrow.trustline.symbol
                                )
                                : formatCurrency(
                                  escrow.milestones.reduce(
                                    (acc, milestone) =>
                                      acc +
                                      (milestone as MultiReleaseMilestone)
                                        .amount,
                                    0
                                  ),
                                  escrow.trustline.symbol
                                )}
                            </span>
                          </div>

                          {escrow.balance !== undefined && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {t("escrow.cards.balance")}
                              </span>
                              <span className="font-medium text-green-800 dark:text-green-600">
                                {formatCurrency(
                                  escrow.balance,
                                  escrow.trustline.symbol
                                )}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {t("escrow.cards.platformFee")}
                            </span>
                            <span className="text-muted-foreground">
                              {escrow.platformFee}%
                            </span>
                          </div>
                        </div>

                        <Separator />

                        {/* Details Section */}
                        <div className="space-y-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <Goal className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {t("escrow.cards.milestones")}
                              </span>
                            </div>
                            <ul className="list-disc list-inside flex flex-col gap-1">
                              {escrow.milestones
                                .slice(0, 3)
                                .map((milestone, index) => (
                                  <li
                                    key={`milestone-${milestone.description}-${milestone.status}-${index}`}
                                    className="text-xs flex justify-between"
                                  >
                                    <p className="truncate mr-4">
                                      {milestone.description}
                                    </p>

                                    {escrow.type === "multi-release" &&
                                      "amount" in milestone && (
                                        <>
                                          <div className="flex items-center gap-1">
                                            <span className="text-muted-foreground">
                                              {formatCurrency(
                                                milestone.amount,
                                                escrow.trustline.symbol
                                              )}
                                            </span>

                                            {milestone.flags?.disputed && (
                                              <Tooltip>
                                                <TooltipTrigger>
                                                  <span
                                                    className={`bg-red-800 rounded-full h-2 w-2 ml-1 ${milestone.flags?.disputed
                                                        ? "block"
                                                        : "hidden"
                                                      }`}
                                                  />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  {t("escrow.cards.disputed")}
                                                </TooltipContent>
                                              </Tooltip>
                                            )}

                                            {milestone.flags?.resolved && (
                                              <Tooltip>
                                                <TooltipTrigger>
                                                  <span
                                                    className={`bg-green-800 rounded-full h-2 w-2 ml-1 ${milestone.flags?.resolved
                                                        ? "block"
                                                        : "hidden"
                                                      }`}
                                                  />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  {t("escrow.cards.resolvedTooltip")}
                                                </TooltipContent>
                                              </Tooltip>
                                            )}

                                            {milestone.flags?.released && (
                                              <Tooltip>
                                                <TooltipTrigger>
                                                  <span
                                                    className={`bg-green-800 rounded-full h-2 w-2 ml-1 ${milestone.flags?.released
                                                        ? "block"
                                                        : "hidden"
                                                      }`}
                                                  />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  {t("escrow.cards.releasedTooltip")}
                                                </TooltipContent>
                                              </Tooltip>
                                            )}

                                            {milestone.flags?.approved &&
                                              !milestone.flags?.disputed &&
                                              !milestone.flags?.resolved &&
                                              !milestone.flags?.released && (
                                                <Tooltip>
                                                  <TooltipTrigger>
                                                    <span
                                                      className={`bg-yellow-600 rounded-full h-2 w-2 ml-1 ${milestone.flags
                                                          ?.approved &&
                                                          !milestone.flags
                                                            ?.disputed &&
                                                          !milestone.flags
                                                            ?.resolved &&
                                                          !milestone.flags
                                                            ?.released
                                                          ? "block"
                                                          : "hidden"
                                                        }`}
                                                    />
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    {t("escrow.cards.pendingReleaseTooltip")}
                                                  </TooltipContent>
                                                </Tooltip>
                                              )}
                                          </div>
                                        </>
                                      )}
                                  </li>
                                ))}

                              {escrow.milestones.length > 3 && (
                                <li className="text-xs">
                                  {t("escrow.cards.more", { count: escrow.milestones.length - 3 })}
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Type Badge */}
                        <div className="pt-2 flex items-end justify-between">
                          <div className="flex flex-col gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {escrow.type
                                .replace("_", " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Badge>

                            {escrow.type === "single-release" &&
                              !allMilestonesApproved(
                                escrow.milestones as SingleReleaseMilestone[]
                              ) && (
                                <Badge
                                  variant={
                                    getSingleReleaseStatus(escrow.flags ?? {})
                                      .variant as "destructive" | "outline"
                                  }
                                  className="text-xs"
                                >
                                  {
                                    getSingleReleaseStatus(escrow.flags ?? {})
                                      .label
                                  }
                                </Badge>
                              )}

                            {escrow.type === "single-release" &&
                              allMilestonesApproved(
                                escrow.milestones as SingleReleaseMilestone[]
                              ) &&
                              !escrow.flags?.released &&
                              !escrow.flags?.resolved &&
                              !escrow.flags?.disputed && (
                                <Badge variant="outline" className="text-xs">
                                  {t("escrow.cards.pendingReleaseTooltip")}
                                </Badge>
                              )}

                            {escrow.type === "multi-release" &&
                              allMilestonesReleasedOrResolved(
                                escrow.milestones as MultiReleaseMilestone[]
                              ) && (
                                <Badge variant="outline" className="text-xs">
                                  {t("escrow.cards.finished")}
                                </Badge>
                              )}
                            {escrow.type === "multi-release" &&
                              !allMilestonesReleasedOrResolved(
                                escrow.milestones as MultiReleaseMilestone[]
                              ) && (
                                <Badge variant="outline" className="text-xs">
                                  {t("escrow.filters.working")}
                                </Badge>
                              )}
                          </div>

                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(escrow.createdAt)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground">
              {t("escrow.cards.page", { page })}
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
              >
                {t("escrow.cards.previous")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={
                  isFetching ||
                  !walletAddress ||
                  ((nextData?.length ?? 0) === 0 && !isFetchingNext)
                }
              >
                {t("escrow.cards.next")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      {dialogStates.second.isOpen ? (
        <EscrowDetailDialog
          isDialogOpen={dialogStates.second.isOpen}
          setIsDialogOpen={dialogStates.second.setIsOpen}
          setSelectedEscrow={setSelectedEscrow}
        />
      ) : null}
    </>
  );
};
