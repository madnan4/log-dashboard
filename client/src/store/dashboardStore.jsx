import { create } from 'zustand';

export const useDashboardStore = create((set) => ({
  result: null,
  isLoading: false,
  error: null,
  searchQuery: '',

  setResult: (result) => set({ result, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  reset: () => set({ result: null, error: null, searchQuery: '' }),
}));