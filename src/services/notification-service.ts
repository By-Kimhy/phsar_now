import { db } from '@/services/db';
import { createId, delay } from '@/utils/id';
import type { AppNotification, FavoriteCollection, ProductFilters, SavedSearch } from '@/types';

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    await delay();
    await db.hydrate();
    return [...db.data.notifications].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },

  async markRead(id: string): Promise<void> {
    await db.hydrate();
    const item = db.data.notifications.find((notification) => notification.id === id);
    if (item) {
      item.read = true;
      db.persist();
    }
  },

  async markAllRead(): Promise<void> {
    await db.hydrate();
    db.data.notifications.forEach((item) => {
      item.read = true;
    });
    db.persist();
  },
};

export const favoriteService = {
  async getFavoriteIds(): Promise<string[]> {
    await db.hydrate();
    return db.data.favoriteIds;
  },

  async toggle(productId: string): Promise<boolean> {
    await delay(80);
    await db.hydrate();
    const exists = db.data.favoriteIds.includes(productId);
    db.data.favoriteIds = exists
      ? db.data.favoriteIds.filter((id) => id !== productId)
      : [...db.data.favoriteIds, productId];
    const product = db.data.products.find((item) => item.id === productId);
    if (product) {
      product.favoriteCount += exists ? -1 : 1;
    }
    db.persist();
    return !exists;
  },

  async getCollections(): Promise<FavoriteCollection[]> {
    await db.hydrate();
    return db.data.collections;
  },

  async createCollection(name: string): Promise<FavoriteCollection> {
    await db.hydrate();
    const collection: FavoriteCollection = {
      id: createId('col'),
      name,
      productIds: [],
      createdAt: new Date().toISOString(),
    };
    db.data.collections.push(collection);
    db.persist();
    return collection;
  },

  async addToCollection(collectionId: string, productId: string): Promise<void> {
    await db.hydrate();
    const collection = db.data.collections.find((item) => item.id === collectionId);
    if (collection && !collection.productIds.includes(productId)) {
      collection.productIds.push(productId);
      db.persist();
    }
  },

  async getSavedSearches(): Promise<SavedSearch[]> {
    await db.hydrate();
    return db.data.savedSearches;
  },

  async saveSearch(query: string, filters: ProductFilters): Promise<SavedSearch> {
    await db.hydrate();
    const saved: SavedSearch = {
      id: createId('ss'),
      query,
      filters,
      createdAt: new Date().toISOString(),
    };
    db.data.savedSearches.unshift(saved);
    db.persist();
    return saved;
  },

  async getRecentSearches(): Promise<string[]> {
    await db.hydrate();
    return db.data.recentSearches;
  },

  async addRecentSearch(query: string): Promise<void> {
    await db.hydrate();
    const next = [query, ...db.data.recentSearches.filter((item) => item !== query)].slice(0, 8);
    db.data.recentSearches = next;
    db.persist();
  },

  async clearRecentSearches(): Promise<void> {
    await db.hydrate();
    db.data.recentSearches = [];
    db.persist();
  },
};

export const safetyService = {
  async reportListing(productId: string, reason: string, details?: string): Promise<void> {
    await delay(240);
    await db.hydrate();
    db.data.notifications.unshift({
      id: createId('n'),
      type: 'listingActivity',
      title: 'Report submitted',
      body: `We received your report for listing ${productId} (${reason}).${details ? ` ${details}` : ''}`,
      createdAt: new Date().toISOString(),
      read: false,
      productId,
    });
    db.persist();
  },

  async reportUser(userId: string, reason: string): Promise<void> {
    await delay(240);
    await db.hydrate();
    db.data.notifications.unshift({
      id: createId('n'),
      type: 'listingActivity',
      title: 'User report submitted',
      body: `Thanks for reporting. Our team will review (${reason}).`,
      createdAt: new Date().toISOString(),
      read: false,
    });
    void userId;
    db.persist();
  },
};
