import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Expense, NewExpense } from '../types';

export function useExpenses(uid: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setExpenses([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'users', uid, 'expenses'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenses(
        snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Expense, 'id'>) }))
      );
      setLoading(false);
    });
    return unsubscribe;
  }, [uid]);

  const addExpense = async (uid: string, expense: NewExpense) => {
    await addDoc(collection(db, 'users', uid, 'expenses'), {
      ...expense,
      createdAt: serverTimestamp(),
    });
  };

  const updateExpense = async (uid: string, expenseId: string, expense: NewExpense) => {
    await updateDoc(doc(db, 'users', uid, 'expenses', expenseId), { ...expense });
  };

  const deleteExpense = async (uid: string, expenseId: string) => {
    await deleteDoc(doc(db, 'users', uid, 'expenses', expenseId));
  };

  return { expenses, loading, addExpense, updateExpense, deleteExpense };
}
