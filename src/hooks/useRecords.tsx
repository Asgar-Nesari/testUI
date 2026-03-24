import { useState, useEffect, useCallback } from 'react';
import type { RecordResponse, RecordRequest, ToastMessage } from '../types/record';
import { recordsApi } from '../services/recordsApi';


export function useRecords() {
  const [records, setRecords] = useState<RecordResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const fetchAll = useCallback(async () => {
  setLoading(true);
  try {
    const data = await recordsApi.getAll();
    // Handles both plain array and paginated object response
    const list = Array.isArray(data) ? data : (data as any).content ?? [];
    setRecords(list);
  } catch {
    addToast('error', 'Failed to load records.');
    setRecords([]); // ← always fall back to empty array
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const createRecord = async (data: RecordRequest): Promise<boolean> => {
    try {
      const created = await recordsApi.create(data);
      setRecords(prev => [created, ...prev]);
      addToast('success', 'Record created successfully!');
      return true;
    } catch {
      addToast('error', 'Failed to create record.');
      return false;
    }
  };

  const updateRecord = async (id: number, data: RecordRequest): Promise<boolean> => {
    try {
      const updated = await recordsApi.update(id, data);
      setRecords(prev => prev.map(r => (r.id === id ? updated : r)));
      addToast('success', 'Record updated successfully!');
      return true;
    } catch {
      addToast('error', 'Failed to update record.');
      return false;
    }
  };

  const deleteRecord = async (id: number): Promise<void> => {
    try {
      await recordsApi.delete(id);
      setRecords(prev => prev.filter(r => r.id !== id));
      addToast('success', 'Record deleted.');
    } catch {
      addToast('error', 'Failed to delete record.');
    }
  };

  const searchRecords = async (query: string, field: 'title' | 'purpose') => {
    if (!query.trim()) { fetchAll(); return; }
    setLoading(true);
    try {
      const data = await recordsApi.search(query, field);
      setRecords(data);
    } catch {
      addToast('error', 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  return {
    records,
    loading,
    toasts,
    createRecord,
    updateRecord,
    deleteRecord,
    searchRecords,
    fetchAll,
  };
}