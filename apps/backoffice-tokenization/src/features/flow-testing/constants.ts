export const CORE_API =
  process.env.NEXT_PUBLIC_CORE_API_URL ?? "http://localhost:4000";

export const USDC_TESTNET_ADDRESS =
  "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";

export const IN_PROGRESS_STATUSES = [
  "FUNDRAISING",
  "ACTIVE",
  "REPAYMENT",
];
export const INACTIVE_STATUSES = [
  "DRAFT",
  "PAUSED",
  "CLOSED",
  "CLAIMABLE",
  "FUNDED",
];

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Borrador",
  FUNDRAISING: "Recaudando",
  ACTIVE: "Activa",
  REPAYMENT: "En pago",
  CLAIMABLE: "Reclamable",
  CLOSED: "Cerrada",
  PAUSED: "Pausada",
  FUNDED: "Fondeada",
};

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: "text-muted-foreground border-muted-foreground/30",
  FUNDRAISING: "text-blue-400 border-blue-400/40",
  ACTIVE: "text-green-400 border-green-400/40",
  REPAYMENT: "text-yellow-400 border-yellow-400/40",
  CLAIMABLE: "text-purple-400 border-purple-400/40",
  CLOSED: "text-muted-foreground border-muted-foreground/30",
  PAUSED: "text-orange-400 border-orange-400/40",
  FUNDED: "text-emerald-400 border-emerald-400/40",
};

export const TOKENIZE_PHASE_LABELS = [
  "Desplegar Token Factory",
  "Desplegar Token de Participación",
  "Configurar Administrador",
  "Crear Campaña",
];

export const FLOW_STEPS = [
  { label: "Nueva campaña" },
  { label: "Inicializar Escrow" },
  { label: "Tokenizar" },
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function slugToSymbol(name: string): string {
  return (
    name
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 4)
      .toUpperCase() || "TKN"
  );
}

export function truncate(str: string, n = 12): string {
  if (str.length <= n * 2 + 3) return str;
  return `${str.slice(0, n)}...${str.slice(-n)}`;
}
