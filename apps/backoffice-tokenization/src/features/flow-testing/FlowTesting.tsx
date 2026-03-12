"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { Button } from "@tokenization/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@tokenization/ui/tabs";
import { Loader2, Plus } from "lucide-react";
import { CampaignList } from "./components/CampaignList";
import { fetchCampaigns } from "./services/campaign.service";
import {
  IN_PROGRESS_STATUSES,
  INACTIVE_STATUSES,
} from "./constants";
import type { Campaign } from "./types";

export function FlowTesting() {
  const { walletAddress } = useWalletContext();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns()
      .then((data) => setCampaigns(data as Campaign[]))
      .catch(() =>
        setError("No se pudieron cargar las campañas."),
      )
      .finally(() => setLoading(false));
  }, []);

  if (!walletAddress) {
    return (
      <main className="flex flex-col gap-8 items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground">
          Conecta tu wallet para continuar
        </p>
      </main>
    );
  }

  const inProgress = campaigns.filter((c) =>
    IN_PROGRESS_STATUSES.includes(c.status),
  );
  const inactive = campaigns.filter((c) =>
    INACTIVE_STATUSES.includes(c.status),
  );

  return (
    <main className="flex flex-col gap-8 items-center sm:items-start">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Campañas</h1>
          <Button
            onClick={() => router.push("/flow-testing/create")}
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Cargando campañas...</span>
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
              <TabsTrigger value="in-progress">
                In Progress
              </TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <CampaignList campaigns={campaigns} />
            </TabsContent>
            <TabsContent value="in-progress">
              <CampaignList campaigns={inProgress} />
            </TabsContent>
            <TabsContent value="inactive">
              <CampaignList campaigns={inactive} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
