"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletContext } from "@tokenization/tw-blocks-shared/src/wallet-kit/WalletProvider";
import { Button } from "@tokenization/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@tokenization/ui/tabs";
import { Loader2, Plus, ExternalLink } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  issuerAddress: string;
  escrowId: string;
  tokenFactoryId: string | null;
  tokenSaleId: string | null;
}

const IN_PROGRESS_STATUSES = ["FUNDRAISING", "ACTIVE", "REPAYMENT"];
const INACTIVE_STATUSES = ["DRAFT", "PAUSED", "CLOSED", "CLAIMABLE", "FUNDED"];

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  FUNDRAISING: "Recaudando",
  ACTIVE: "Activa",
  REPAYMENT: "En pago",
  CLAIMABLE: "Reclamable",
  CLOSED: "Cerrada",
  PAUSED: "Pausada",
  FUNDED: "Fondeada",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "text-muted-foreground border-muted-foreground/30",
  FUNDRAISING: "text-blue-400 border-blue-400/40",
  ACTIVE: "text-green-400 border-green-400/40",
  REPAYMENT: "text-yellow-400 border-yellow-400/40",
  CLAIMABLE: "text-purple-400 border-purple-400/40",
  CLOSED: "text-muted-foreground border-muted-foreground/30",
  PAUSED: "text-orange-400 border-orange-400/40",
  FUNDED: "text-emerald-400 border-emerald-400/40",
};

function truncate(str: string, n = 12) {
  if (str.length <= n * 2 + 3) return str;
  return `${str.slice(0, n)}...${str.slice(-n)}`;
}

function CampaignCard({
  campaign,
  index,
}: {
  campaign: Campaign;
  index: number;
}) {
  const router = useRouter();
  const statusColor = STATUS_COLORS[campaign.status] ?? "text-muted-foreground border-muted-foreground/30";

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-mono">
              #{String(index + 1).padStart(3, "0")}
            </span>
            <h3 className="font-semibold text-base truncate">{campaign.name}</h3>
          </div>
          {campaign.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {campaign.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${statusColor}`}
          >
            {STATUS_LABELS[campaign.status] ?? campaign.status}
          </span>
          {campaign.escrowId && (
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer text-primary hover:text-primary gap-1 h-7 px-2"
              onClick={() => router.push(`/flow-testing/${campaign.escrowId}`)}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ver Escrow
            </Button>
          )}
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-1 border-t border-border/50">
        <p className="text-xs text-muted-foreground font-mono">
          {campaign.escrowId ? truncate(campaign.escrowId) : "Sin escrow"}
        </p>
        <Button
          size="sm"
          className="cursor-pointer h-8"
          onClick={() => router.push(`/flow-testing/${campaign.escrowId}`)}
          disabled={!campaign.escrowId}
        >
          Añadir préstamo
        </Button>
      </div>
    </div>
  );
}

function CampaignList({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-12 text-center">
        No hay campañas en esta categoría.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-4">
      {campaigns.map((c, i) => (
        <CampaignCard key={c.id} campaign={c} index={i} />
      ))}
    </div>
  );
}

export function FlowTesting() {
  const { walletAddress } = useWalletContext();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CORE_API = process.env.NEXT_PUBLIC_CORE_API_URL ?? "http://localhost:4000";

  useEffect(() => {
    fetch(`${CORE_API}/campaigns`)
      .then((r) => r.json())
      .then(setCampaigns)
      .catch(() => setError("No se pudieron cargar las campañas."))
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
        {/* Page header */}
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
          <p className="text-sm text-destructive py-12 text-center">{error}</p>
        )}

        {!loading && !error && (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
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
