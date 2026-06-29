import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatYear(date: string | number): string {
  return new Date(date).getFullYear().toString();
}

export function padNumber(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Splits a string into an array of words, preserving whitespace.
 * Used with GSAP SplitText-style animations.
 */
export function splitWords(text: string): string[] {
  return text.split(" ").filter(Boolean);
}

/**
 * Splits a string into individual characters.
 */
export function splitChars(text: string): string[] {
  return text.split("");
}

/**
 * Maps a value from one range to another.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
