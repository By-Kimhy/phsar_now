import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  conversations as seedConversations,
  messages as seedMessages,
  notifications as seedNotifications,
  offers as seedOffers,
  orders as seedOrders,
  products as seedProducts,
  reviews as seedReviews,
  users as seedUsers,
} from '@/mock';
import type {
  AppNotification,
  ChatMessage,
  Conversation,
  FavoriteCollection,
  Offer,
  Order,
  Product,
  Review,
  SavedSearch,
  User,
} from '@/types';

const STORAGE_KEY = 'phsarnow.db.v1';

type DatabaseShape = {
  users: User[];
  products: Product[];
  conversations: Conversation[];
  messages: ChatMessage[];
  offers: Offer[];
  orders: Order[];
  notifications: AppNotification[];
  reviews: Review[];
  favoriteIds: string[];
  collections: FavoriteCollection[];
  savedSearches: SavedSearch[];
  blockedUserIds: string[];
  followedSellerIds: string[];
  recentSearches: string[];
};

function seed(): DatabaseShape {
  return {
    users: structuredClone(seedUsers),
    products: structuredClone(seedProducts),
    conversations: structuredClone(seedConversations),
    messages: structuredClone(seedMessages),
    offers: structuredClone(seedOffers),
    orders: structuredClone(seedOrders),
    notifications: structuredClone(seedNotifications),
    reviews: structuredClone(seedReviews),
    favoriteIds: ['p_iphone15', 'p_jordan', 'p_watch'],
    collections: [
      {
        id: 'col_tech',
        name: 'Tech & Camera Gear',
        productIds: ['p_iphone15', 'p_macbook', 'p_camera'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'col_home',
        name: 'Home Office',
        productIds: ['p_lamp', 'p_teak'],
        createdAt: new Date().toISOString(),
      },
    ],
    savedSearches: [
      {
        id: 'ss_fuji',
        query: 'Fujifilm X100V',
        filters: { query: 'Fujifilm', category: 'electronics', maxPrice: 1300, sort: 'newest' },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'ss_ipad',
        query: 'iPad Air M1',
        filters: { query: 'iPad', category: 'electronics', maxPrice: 500, sort: 'price-asc' },
        createdAt: new Date().toISOString(),
      },
    ],
    blockedUserIds: [],
    followedSellerIds: ['user_dara'],
    recentSearches: ['iPhone', 'Honda Dream', 'Air Jordan'],
  };
}

class MockDatabase {
  data: DatabaseShape = seed();
  private hydrated = false;
  private persistTimer: ReturnType<typeof setTimeout> | null = null;

  async hydrate(): Promise<void> {
    if (this.hydrated) return;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<DatabaseShape>;
        this.data = { ...seed(), ...parsed };
      }
    } catch {
      this.data = seed();
    }
    this.hydrated = true;
  }

  persist(): void {
    if (this.persistTimer) clearTimeout(this.persistTimer);
    this.persistTimer = setTimeout(() => {
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }, 80);
  }

  reset(): void {
    this.data = seed();
    this.persist();
  }
}

export const db = new MockDatabase();
