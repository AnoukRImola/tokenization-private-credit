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
const TOKEN_FACTORY_KEY = "flow-testing-token-factory-id";
const TOKEN_SALE_KEY = "flow-testing-token-sale-id";
const CAMPAIGN_DB_KEY = "flow-testing-campaign-db-id";

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

  const saveTokenFactoryId = useCallback((id: string) => {
    localStorage.setItem(TOKEN_FACTORY_KEY, id);
  }, []);

  const getTokenFactoryId = useCallback((): string | null => {
    return localStorage.getItem(TOKEN_FACTORY_KEY);
  }, []);

  const saveTokenSaleId = useCallback((id: string) => {
    localStorage.setItem(TOKEN_SALE_KEY, id);
  }, []);

  const getTokenSaleId = useCallback((): string | null => {
    return localStorage.getItem(TOKEN_SALE_KEY);
  }, []);

  const saveCampaignDbId = useCallback((id: string) => {
    localStorage.setItem(CAMPAIGN_DB_KEY, id);
  }, []);

  const getCampaignDbId = useCallback((): string | null => {
    return localStorage.getItem(CAMPAIGN_DB_KEY);
  }, []);

  const clearCampaign = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONTRACT_KEY);
    localStorage.removeItem(TOKEN_FACTORY_KEY);
    localStorage.removeItem(TOKEN_SALE_KEY);
    localStorage.removeItem(CAMPAIGN_DB_KEY);
  }, []);

  return {
    saveCampaign,
    getCampaign,
    saveContractId,
    getContractId,
    saveTokenFactoryId,
    getTokenFactoryId,
    saveTokenSaleId,
    getTokenSaleId,
    saveCampaignDbId,
    getCampaignDbId,
    clearCampaign,
  };
}
