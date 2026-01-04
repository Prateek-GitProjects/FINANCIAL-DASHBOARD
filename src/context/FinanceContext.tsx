import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FinRecord } from '@/types';

interface FinanceContextType {
  records: FinRecord[];
  loading: boolean;
  refreshRecords: () => Promise<void>;
  addRecord: (record: Omit<FinRecord, 'id' | 'createdAt'>) => Promise<void>;
  updateRecord: (id: string, updates: Partial<FinRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/records';

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<FinRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data: FinRecord[] = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new record
  const addRecord = async (record: Omit<FinRecord, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...record,
          createdAt: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('Failed to add record');
      await refreshRecords();
    } catch (error) {
      console.error(error);
    }
  };

  const updateRecord = async (id: string, updates: Partial<FinRecord>) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update record');
      await refreshRecords();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete record');
      await refreshRecords();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refreshRecords();
  }, []);

  return (
    <FinanceContext.Provider
      value={{ records, loading, refreshRecords, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
}
