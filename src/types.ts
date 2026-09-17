export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note: string;
  createdAt: number;
}

export type NewExpense = Omit<Expense, 'id' | 'createdAt'>;

export interface FixedExpense {
  id: string;
  amount: number;
  category: string;
  note: string;
}

export type NewFixedExpense = Omit<FixedExpense, 'id'>;

export interface Budgets {
  [category: string]: number;
}

export const DEFAULT_CATEGORIES = [
  'Comida',
  'Transporte',
  'Vivienda',
  'Servicios',
  'Salud',
  'Entretenimiento',
  'Educación',
  'Otros',
];
