import type { Campaign, CreateCampaignFormValues } from "@/features/campaigns/types/campaign.types";

const CORE_API = process.env.NEXT_PUBLIC_CORE_API_URL ?? "http://localhost:4000";

export async function getCampaigns(): Promise<Campaign[]> {
  const res = await fetch(`${CORE_API}/campaigns`);
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
}

export async function getCampaignById(id: string): Promise<Campaign> {
  const res = await fetch(`${CORE_API}/campaigns/${id}`);
  if (!res.ok) throw new Error("Failed to fetch campaign");
  return res.json();
}

export async function createCampaign(data: CreateCampaignFormValues): Promise<Campaign> {
  const res = await fetch(`${CORE_API}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create campaign");
  return res.json();
}
