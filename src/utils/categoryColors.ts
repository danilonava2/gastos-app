import { CATEGORIES } from '../types';

const PALETTE = [
  '#4f7cff',
  '#ff7d5c',
  '#3ecf8e',
  '#ffb84f',
  '#a06bff',
  '#ff5c93',
  '#39c0d9',
  '#8d99ae',
];

export const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c, i) => [c, PALETTE[i % PALETTE.length]])
);
