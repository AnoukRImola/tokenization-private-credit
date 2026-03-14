export { cn } from "@tokenization/shared/lib/utils";

const SOROBAN_DECIMAL_SCALE = 1e7;

export function fromStroops(stroops: number | string): number {
  return Number(stroops) / SOROBAN_DECIMAL_SCALE;
}

export function formatCurrency(amount: number, currency?: string): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return currency ? `${currency} ${formatted}` : formatted;
}
