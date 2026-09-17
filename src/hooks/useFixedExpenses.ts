import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { FixedExpense, NewFixedExpense } from '../types';
import { toErrorMessage, useToast } from '../contexts/ToastContext';

export function useFixedExpenses(uid: string | undefined) {
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!uid) {
      setFixedExpenses([]);
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'users', uid, 'fixedExpenses'), orderBy('note'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFixedExpenses(
        snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FixedExpense, 'id'>) }))
      );
      setLoading(false);
    });
    return unsubscribe;
  }, [uid]);

  const addFixedExpense = async (uid: string, fixedExpense: NewFixedExpense) => {
    try {
      await addDoc(collection(db, 'users', uid, 'fixedExpenses'), fixedExpense);
    } catch (err) {
      showToast(toErrorMessage(err, 'No se pudo guardar el gasto fijo.'));
    }
  };

  const updateFixedExpense = async (uid: string, id: string, fixedExpense: NewFixedExpense) => {
    try {
      await updateDoc(doc(db, 'users', uid, 'fixedExpenses', id), { ...fixedExpense });
    } catch (err) {
      showToast(toErrorMessage(err, 'No se pudo actualizar el gasto fijo.'));
    }
  };

  const deleteFixedExpense = async (uid: string, id: string) => {
    try {
      await deleteDoc(doc(db, 'users', uid, 'fixedExpenses', id));
    } catch (err) {
      showToast(toErrorMessage(err, 'No se pudo eliminar el gasto fijo.'));
    }
  };

  return { fixedExpenses, loading, addFixedExpense, updateFixedExpense, deleteFixedExpense };
}
