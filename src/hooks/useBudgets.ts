import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Budgets } from '../types';
import { toErrorMessage, useToast } from '../contexts/ToastContext';

export function useBudgets(uid: string | undefined) {
  const [budgets, setBudgets] = useState<Budgets>({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!uid) {
      setBudgets({});
      setLoading(false);
      return;
    }
    const ref = doc(db, 'users', uid, 'settings', 'budgets');
    const unsubscribe = onSnapshot(ref, (snap) => {
      setBudgets((snap.data() as Budgets) ?? {});
      setLoading(false);
    });
    return unsubscribe;
  }, [uid]);

  const setBudget = async (uid: string, category: string, limit: number) => {
    try {
      const ref = doc(db, 'users', uid, 'settings', 'budgets');
      await setDoc(ref, { [category]: limit }, { merge: true });
    } catch (err) {
      showToast(toErrorMessage(err, 'No se pudo guardar el presupuesto.'));
    }
  };

  return { budgets, loading, setBudget };
}
