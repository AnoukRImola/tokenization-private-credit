import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const SOROBAN_DECIMAL_SCALE = 1e7;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fromStroops(stroops: number | string): number {
  return Number(stroops) / SOROBAN_DECIMAL_SCALE;
}