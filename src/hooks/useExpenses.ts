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
import { toErrorMessage, useToast } from '../contexts/ToastContext';

export function useExpenses(uid: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

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
