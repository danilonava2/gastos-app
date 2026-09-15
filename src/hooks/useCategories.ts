import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { DEFAULT_CATEGORIES } from '../types';
import { toErrorMessage, useToast } from '../contexts/ToastContext';

export function useCategories(uid: string | undefined) {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (!uid) {
      setCategories(DEFAULT_CATEGORIES);
      setLoading(false);
      return;
    }
    const ref = doc(db, 'users', uid, 'settings', 'categories');
    const unsubscribe = onSnapshot(ref, (snap) => {
      const list = snap.data()?.list as string[] | undefined;
      setCategories(list && list.length > 0 ? list : DEFAULT_CATEGORIES);
      setLoading(false);
    });
    return unsubscribe;
  }, [uid]);

  const saveCategories = async (uid: string, list: string[]) => {
    try {
      await setDoc(doc(db, 'users', uid, 'settings', 'categories'), { list });
      return true;
    } catch (err) {
      showToast(toErrorMessage(err, 'No se pudo guardar la categoría.'));
      return false;
    }
  };

  return { categories, loading, saveCategories };
}
