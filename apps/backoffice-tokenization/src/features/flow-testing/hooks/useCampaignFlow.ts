import { useCallback } from "react";
import type { CampaignFormData } from "../types";

export interface CampaignFlowState {
  campaign: CampaignFormData | null;
  contractId: string | null;
  tokenFactoryId: string | null;
  tokenSaleId: string | null;
  campaignDbId: string | null;
}

const STORAGE_KEY = "flow-testing-campaign-flow";

function emptyState(): CampaignFlowState {
  return {
    campaign: null,
    contractId: null,
    tokenFactoryId: null,
    tokenSaleId: null,
    campaignDbId: null,
  };
}

function loadState(): CampaignFlowState {
  if (typeof window === "undefined") return emptyState();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyState();
  return JSON.parse(raw) as CampaignFlowState;
}

export function useCampaignFlow() {
  const getState = useCallback(
    (): CampaignFlowState => loadState(),
    [],
  );

  const update = useCallback(
    (partial: Partial<CampaignFlowState>) => {
      const current = loadState();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...current, ...partial }),
      );
    },
    [],
  );

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { getState, update, clear };
}
