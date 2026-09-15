import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Budgets } from '../types';

export function useBudgets(uid: string | undefined) {
  const [budgets, setBudgets] = useState<Budgets>({});
  const [loading, setLoading] = useState(true);

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
    const ref = doc(db, 'users', uid, 'settings', 'budgets');
    await setDoc(ref, { [category]: limit }, { merge: true });
  };

  return { budgets, loading, setBudget };
}
