export { cn } from "@tokenization/shared/lib/utils";

const SOROBAN_DECIMAL_SCALE = 1e7;

export function fromStroops(stroops: number | string): number {
  return Number(stroops) / SOROBAN_DECIMAL_SCALE;
}
