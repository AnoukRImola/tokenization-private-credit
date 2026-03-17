import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const ALLOWED_KEYS = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
const SOROBAN_DECIMAL_SCALE = 1e7;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fromStroops(stroops: number | string): number {
  return Number(stroops) / SOROBAN_DECIMAL_SCALE;
}
import type { KeyboardEvent } from "react";


export function numericInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
  if (
    !/[0-9.,]/.test(e.key) &&
    !ALLOWED_KEYS.includes(e.key) &&
    !e.ctrlKey &&
    !e.metaKey
  ) {
    e.preventDefault();
  }
}

export function parseNumericInput(value: string, max?: number): number {
  const num = Number(value.replace(/[^0-9.,]/g, "").replace(",", "."));
  const safe = isNaN(num) ? 0 : num;
  return max !== undefined ? Math.min(safe, max) : safe;
}
