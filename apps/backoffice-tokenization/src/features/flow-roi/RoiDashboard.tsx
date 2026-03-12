"use client";

import { useEffect, useState, useCallback } from "react";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@tokenization/ui/tabs";
import { Loader2 } from "lucide-react";
import { fetchCampaigns } from "@/features/flow-testing/services/campaign.service";
import { CampaignRoiList } from "./components/CampaignRoiList";
import type { Campaign } from "./types";

export function RoiDashboard() {
  const { walletAddress } = useWalletContext();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchCampaigns()
      .then((data) => setCampaigns(data as Campaign[]))
      .catch(() => setError("Could not load campaigns."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  if (!walletAddress) {
    return (
      <main className="flex flex-col gap-8 items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground">
          Connect your wallet to continue
        </p>
      </main>
    );
  }

  const withVault = campaigns.filter((c) => !!c.vaultId);
  const withoutVault = campaigns.filter((c) => !c.vaultId);

  return (
    <main className="flex flex-col gap-8 items-center sm:items-start">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Return on Investment</h1>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading campaigns...</span>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive py-12 text-center">
            {error}
          </p>
        )}

        {!loading && !error && (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="with-vault">With Vault</TabsTrigger>
              <TabsTrigger value="without-vault">Without Vault</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <CampaignRoiList
                campaigns={campaigns}
                onUpdated={loadCampaigns}
              />
            </TabsContent>
            <TabsContent value="with-vault">
              <CampaignRoiList
                campaigns={withVault}
                onUpdated={loadCampaigns}
              />
            </TabsContent>
            <TabsContent value="without-vault">
              <CampaignRoiList
                campaigns={withoutVault}
                onUpdated={loadCampaigns}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
