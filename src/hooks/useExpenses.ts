import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Expense, NewExpense } from '../types';
import { toErrorMessage, useToast } from '../contexts/ToastContext';

export interface DateRange {
  start: string;
  end: string;
}

export async function getExpensesByCategory(uid: string, category: string): Promise<Expense[]> {
  const snapshot = await getDocs(
    query(collection(db, 'users', uid, 'expenses'), where('category', '==', category))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Expense, 'id'>) }));
}

export function useExpenses(uid: string | undefined, range: DateRange) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!uid) {
      setExpenses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, 'users', uid, 'expenses'),
      where('date', '>=', range.start),
      where('date', '<=', range.end),
      orderBy('date', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenses(
        snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Expense, 'id'>) }))
      );
      setLoading(false);
    });
    return unsubscribe;
  }, [uid, range.start, range.end]);

  const addExpense = async (uid: string, expense: NewExpense) => {
    try {
      await addDoc(collection(db, 'users', uid, 'expenses'), {
        ...expense,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      showToast(toErrorMessage(err, 'No se pudo guardar el gasto.'));
    }
  };

  const updateExpense = async (uid: string, expenseId: string, expense: NewExpense) => {
    try {
      await updateDoc(doc(db, 'users', uid, 'expenses', expenseId), { ...expense });
    } catch (err) {
      showToast(toErrorMessage(err, 'No se pudo actualizar el gasto.'));
    }
  };

  const deleteExpense = async (uid: string, expenseId: string) => {
    try {
      await deleteDoc(doc(db, 'users', uid, 'expenses', expenseId));
    } catch (err) {
      showToast(toErrorMessage(err, 'No se pudo eliminar el gasto.'));
    }
  };

  return { expenses, loading, addExpense, updateExpense, deleteExpense };
}
