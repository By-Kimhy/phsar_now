import { create } from 'zustand';

import type { CategoryId, CurrencyCode, ProductCondition } from '@/types';

export type SellDraft = {
  images: string[];
  coverIndex: number;
  title: string;
  category: CategoryId;
  description: string;
  brand: string;
  condition: ProductCondition;
  location: string;
  price: string;
  currency: CurrencyCode;
  negotiable: boolean;
};

const emptyDraft: SellDraft = {
  images: [],
  coverIndex: 0,
  title: '',
  category: 'electronics',
  description: '',
  brand: '',
  condition: 'good',
  location: 'Phnom Penh',
  price: '',
  currency: 'USD',
  negotiable: true,
};

type SellState = {
  draft: SellDraft;
  step: number;
  update: (patch: Partial<SellDraft>) => void;
  setStep: (step: number) => void;
  reset: () => void;
};

export const useSellStore = create<SellState>((set) => ({
  draft: emptyDraft,
  step: 0,
  update: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
  setStep: (step) => set({ step }),
  reset: () => set({ draft: emptyDraft, step: 0 }),
}));
