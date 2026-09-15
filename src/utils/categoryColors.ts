const PALETTE = [
  '#17798c',
  '#f2b134',
  '#1fae7a',
  '#e0703a',
  '#7b6cf6',
  '#e0457a',
  '#4c8fd1',
  '#8d99ae',
];

export const FALLBACK_CATEGORY_COLOR = '#8d99ae';

export function getCategoryColors(categories: string[]): Record<string, string> {
  return Object.fromEntries(categories.map((c, i) => [c, PALETTE[i % PALETTE.length]]));
}
