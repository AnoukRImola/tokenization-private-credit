import { useCallback } from "react";

export interface CampaignFormData {
  name: string;
  description: string;
  poolSize: number;
  loanDuration: number;
  expectedReturn: number;
  loanSize: number;
}

const STORAGE_KEY = "flow-testing-campaign";
const CONTRACT_KEY = "flow-testing-contract-id";

export function useCampaignFlow() {
  const saveCampaign = useCallback((data: CampaignFormData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  const getCampaign = useCallback((): CampaignFormData | null => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CampaignFormData;
  }, []);

  const saveContractId = useCallback((contractId: string) => {
    localStorage.setItem(CONTRACT_KEY, contractId);
  }, []);

  const getContractId = useCallback((): string | null => {
    return localStorage.getItem(CONTRACT_KEY);
  }, []);

  const clearCampaign = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONTRACT_KEY);
  }, []);

  return { saveCampaign, getCampaign, saveContractId, getContractId, clearCampaign };
}
