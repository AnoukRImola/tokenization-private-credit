"use client";

import React from "react";
import { Button } from "@tokenization/ui/button";
import { Input } from "@tokenization/ui/input";
import { Checkbox } from "@tokenization/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tokenization/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@tokenization/ui/popover";
import { Calendar } from "@tokenization/ui/calendar";
import type { DateRange as DayPickerDateRange } from "react-day-picker";
import {
  RefreshCcw,
  Trash2,
  Search,
  DollarSign,
  Filter as FilterIcon,
  Calendar as CalendarIcon,
  SlidersHorizontal,
} from "lucide-react";
import {
  Select as OrderSelect,
  SelectTrigger as OrderSelectTrigger,
  SelectContent as OrderSelectContent,
  SelectItem as OrderSelectItem,
  SelectValue as OrderSelectValue,
} from "@tokenization/ui/select";
import { useSharedTranslation } from "../../../i18n/TranslationProvider";

type FiltersProps = {
  // values
  title: string;
  engagementId: string;
  isActive: boolean;
  validateOnChain: boolean;
  type: "single-release" | "multi-release" | "all";
  status:
    | "working"
    | "pendingRelease"
    | "released"
    | "resolved"
    | "inDispute"
    | "all";
  minAmount: string;
  maxAmount: string;
  dateRange: DayPickerDateRange;
  formattedRangeLabel: string;

  // setters
  setTitle: (v: string) => void;
  setEngagementId: (v: string) => void;
  setIsActive: (v: boolean) => void;
  setValidateOnChain: (v: boolean) => void;
  setType: (v: "single-release" | "multi-release" | "all") => void;
  setStatus: (
    v:
      | "working"
      | "pendingRelease"
      | "released"
      | "resolved"
      | "inDispute"
      | "all"
  ) => void;
  setMinAmount: (v: string) => void;
  setMaxAmount: (v: string) => void;
  setDateRange: (r: DayPickerDateRange) => void;

  // actions
  onClearFilters: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;

  // ordering
  orderBy: "createdAt" | "updatedAt" | "amount";
  orderDirection: "asc" | "desc";
  setOrderBy: (v: "createdAt" | "updatedAt" | "amount") => void;
  setOrderDirection: (v: "asc" | "desc") => void;
};

export const Filters = ({
  title,
  engagementId,
  isActive,
  validateOnChain,
  type,
  status,
  minAmount,
  maxAmount,
  dateRange,
  formattedRangeLabel,
  isRefreshing,
  orderBy,
  orderDirection,
  setTitle,
  setEngagementId,
  setIsActive,
  setValidateOnChain,
  setType,
  setStatus,
  setMinAmount,
  setMaxAmount,
  setDateRange,
  onClearFilters,
  onRefresh,
  setOrderBy,
  setOrderDirection,
}: FiltersProps) => {
  const { t } = useSharedTranslation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch: during SSR `isRefreshing` is often false,
  // but on the first client render React Query may already be fetching.
  const refreshDisabled = mounted ? isRefreshing : false;
  const refreshIconClass = `w-3 h-3 ${mounted && isRefreshing ? "animate-spin" : ""}`;

  return (
    <div className="w-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">{t("escrow.filters.title")}</h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs font-medium border-border/60 bg-background/80 hover:bg-muted/80 transition-colors cursor-pointer"
            onClick={onRefresh}
            disabled={refreshDisabled}
          >
            <RefreshCcw className={refreshIconClass} />
            <span className="hidden xs:inline">{t("escrow.filters.refresh")}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            onClick={onClearFilters}
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden xs:inline">{t("escrow.filters.clear")}</span>
          </Button>
        </div>
      </div>

      {/* Filters Grid */}
      <div className="space-y-4">
        {/* Row 1: Search, ID, Amount Range, and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t("escrow.filters.search")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("escrow.filters.searchPlaceholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-9 pl-9 text-sm border-border/60 focus:border-primary/60 bg-background/80 transition-colors w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t("escrow.filters.engagementId")}
            </label>
            <div className="relative">
              <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("escrow.filters.engagementIdPlaceholder")}
                value={engagementId}
                onChange={(e) => setEngagementId(e.target.value)}
                className="h-9 pl-9 text-sm border-border/60 focus:border-primary/60 bg-background/80 transition-colors w-full"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t("escrow.filters.amountRange")}
            </label>
            <div className="w-full">
              <div className="flex items-center gap-2 w-full">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    placeholder={t("escrow.filters.min")}
                    type="number"
                    min="0"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="h-9 pl-7 text-sm border-border/60 focus:border-primary/60 bg-background/80 w-full"
                  />
                </div>
                <span className="text-xs text-muted-foreground px-1">-</span>
                <div className="relative flex-1">
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    placeholder={t("escrow.filters.max")}
                    type="number"
                    min="0"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="h-9 pl-7 text-sm border-border/60 focus:border-primary/60 bg-background/80 w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t("escrow.filters.type")}
            </label>
            <div className="w-full">
              <Select
                value={type}
                onValueChange={(v) => setType(v as typeof type)}
              >
                <SelectTrigger className="h-9 text-sm border-border/60 bg-background/80 w-full">
                  <SelectValue placeholder={t("escrow.filters.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("escrow.filters.allTypes")}</SelectItem>
                  <SelectItem value="single-release">{t("escrow.filters.singleRelease")}</SelectItem>
                  <SelectItem value="multi-release">{t("escrow.filters.multiRelease")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Row 2: Status, Date Range, Active Checkbox, and Ordering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t("escrow.filters.status")}
            </label>
            <div className="w-full">
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as typeof status)}
              >
                <SelectTrigger className="h-9 text-sm border-border/60 bg-background/80 w-full">
                  <SelectValue placeholder={t("escrow.filters.selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("escrow.filters.allStatuses")}</SelectItem>
                  <SelectItem value="working">{t("escrow.filters.working")}</SelectItem>
                  <SelectItem value="pendingRelease">
                    {t("escrow.filters.pendingRelease")}
                  </SelectItem>
                  <SelectItem value="released">{t("escrow.filters.released")}</SelectItem>
                  <SelectItem value="resolved">{t("escrow.filters.resolved")}</SelectItem>
                  <SelectItem value="inDispute">{t("escrow.filters.inDispute")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t("escrow.filters.dateRange")}
            </label>
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm border-border/60 bg-background/80 hover:bg-muted/80 w-full justify-start transition-colors"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{formattedRangeLabel}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range: DayPickerDateRange | undefined) =>
                        setDateRange(
                          range ?? { from: undefined, to: undefined }
                        )
                      }
                      numberOfMonths={2}
                    />
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDateRange({ from: undefined, to: undefined })
                        }
                      >
                        {t("escrow.filters.clear")}
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {t("escrow.filters.activeOnchain")}
            </label>
            <div className="w-full lg:w-auto lg:min-w-fit">
              <div className="grid grid-cols-2 gap-2 w-full lg:w-auto">
                <div className="flex items-center justify-center lg:justify-start gap-2 h-9 px-3 rounded-md border border-border/60 bg-background/80 w-full lg:w-auto">
                  <Checkbox
                    checked={Boolean(isActive)}
                    onCheckedChange={(checked) => setIsActive(Boolean(checked))}
                  />
                  <span className="text-sm text-foreground font-medium whitespace-nowrap">
                    {t("escrow.filters.active")}
                  </span>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 h-9 px-3 rounded-md border border-border/60 bg-background/80 w-full lg:w-auto">
                  <Checkbox
                    checked={Boolean(validateOnChain)}
                    onCheckedChange={(checked) =>
                      setValidateOnChain(Boolean(checked))
                    }
                  />
                  <span className="text-sm text-foreground font-medium whitespace-nowrap">
                    {t("escrow.filters.onChain")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 w-full lg:col-span-2">
            <label className="text-xs font-medium text-muted-foreground">
              {t("escrow.filters.sortBy")}
            </label>
            <div className="w-full">
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1">
                  <OrderSelect
                    value={orderBy}
                    onValueChange={(v) => setOrderBy(v as typeof orderBy)}
                  >
                    <OrderSelectTrigger className="h-9 text-sm border-border/60 bg-background/80 w-full">
                      <OrderSelectValue placeholder={t("escrow.filters.orderBy")} />
                    </OrderSelectTrigger>
                    <OrderSelectContent>
                      <OrderSelectItem value="createdAt">
                        {t("escrow.filters.created")}
                      </OrderSelectItem>
                      <OrderSelectItem value="updatedAt">
                        {t("escrow.filters.updated")}
                      </OrderSelectItem>
                      <OrderSelectItem value="amount">{t("escrow.filters.amount")}</OrderSelectItem>
                    </OrderSelectContent>
                  </OrderSelect>
                </div>
                <div className="flex-1">
                  <OrderSelect
                    value={orderDirection}
                    onValueChange={(v) =>
                      setOrderDirection(v as typeof orderDirection)
                    }
                  >
                    <OrderSelectTrigger className="h-9 text-sm border-border/60 bg-background/80 w-full">
                      <OrderSelectValue placeholder={t("escrow.filters.direction")} />
                    </OrderSelectTrigger>
                    <OrderSelectContent>
                      <OrderSelectItem value="desc">{t("escrow.filters.descending")}</OrderSelectItem>
                      <OrderSelectItem value="asc">{t("escrow.filters.ascending")}</OrderSelectItem>
                    </OrderSelectContent>
                  </OrderSelect>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
