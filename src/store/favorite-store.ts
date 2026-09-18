import { create } from 'zustand';

import { favoriteService } from '@/services';
import type { FavoriteCollection, SavedSearch } from '@/types';

type FavoriteState = {
  ids: string[];
  collections: FavoriteCollection[];
  savedSearches: SavedSearch[];
  hydrate: () => Promise<void>;
  toggle: (productId: string) => Promise<boolean>;
  isFavorite: (productId: string) => boolean;
};

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  ids: [],
  collections: [],
  savedSearches: [],
  hydrate: async () => {
    const [ids, collections, savedSearches] = await Promise.all([
      favoriteService.getFavoriteIds(),
      favoriteService.getCollections(),
      favoriteService.getSavedSearches(),
    ]);
    set({ ids, collections, savedSearches });
  },
  toggle: async (productId) => {
    const next = await favoriteService.toggle(productId);
    set({
      ids: next ? [...get().ids, productId] : get().ids.filter((id) => id !== productId),
    });
    return next;
  },
  isFavorite: (productId) => get().ids.includes(productId),
}));
