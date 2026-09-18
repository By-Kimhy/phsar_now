import { create } from 'zustand';

import type { ProductFilters } from '@/types';

const defaultFilters: ProductFilters = {
  category: 'all',
  condition: 'all',
  dateListed: 'any',
  sort: 'recommended',
};

type FilterState = {
  filters: ProductFilters;
  setFilters: (filters: ProductFilters) => void;
  patch: (filters: Partial<ProductFilters>) => void;
  reset: () => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) => set({ filters }),
  patch: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  reset: () => set({ filters: defaultFilters }),
}));
