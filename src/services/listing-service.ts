import { CURRENT_USER_ID } from '@/mock/users';
import { db } from '@/services/db';
import { createId, delay, nowIso } from '@/utils/id';
import type { Listing, ListingStatus, ListingSuggestion, Product } from '@/types';

export type CreateListingInput = {
  title: string;
  description: string;
  images: string[];
  priceAmount: number;
  currency: Product['price']['currency'];
  negotiable: boolean;
  condition: Product['condition'];
  category: Product['category'];
  brand?: string;
  location: string;
  tags?: string[];
  specs?: Record<string, string>;
  status?: ListingStatus;
};

export const listingService = {
  async getMyListings(status?: ListingStatus): Promise<Listing[]> {
    await delay();
    await db.hydrate();
    return db.data.products.filter(
      (item) => item.sellerId === CURRENT_USER_ID && (!status || item.status === status),
    );
  },

  async createListing(input: CreateListingInput): Promise<Listing> {
    await delay(360);
    await db.hydrate();
    const listing: Listing = {
      id: createId('p'),
      sellerId: CURRENT_USER_ID,
      title: input.title,
      description: input.description,
      images: input.images,
      price: { amount: input.priceAmount, currency: input.currency },
      negotiable: input.negotiable,
      condition: input.condition,
      category: input.category,
      brand: input.brand,
      location: input.location,
      distanceKm: 0.2,
      createdAt: nowIso(),
      specs: input.specs ?? {},
      tags: input.tags ?? [],
      views: 0,
      favoriteCount: 0,
      messageCount: 0,
      status: input.status ?? 'active',
    };
    db.data.products.unshift(listing);
    const me = db.data.users.find((user) => user.id === CURRENT_USER_ID);
    if (me && listing.status === 'active') {
      me.listingsCount += 1;
    }
    db.persist();
    return listing;
  },

  async updateListing(id: string, patch: Partial<Listing>): Promise<Listing> {
    await delay(240);
    await db.hydrate();
    const index = db.data.products.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Listing not found');
    db.data.products[index] = { ...db.data.products[index], ...patch };
    db.persist();
    return db.data.products[index];
  },

  async deleteListing(id: string): Promise<void> {
    await delay(200);
    await db.hydrate();
    db.data.products = db.data.products.filter((item) => item.id !== id);
    db.persist();
  },

  async markAsSold(id: string): Promise<Listing> {
    return this.updateListing(id, { status: 'sold' });
  },

  async generateListingSuggestions(images: string[]): Promise<ListingSuggestion> {
    await delay(700);
    const sample = images[0] ?? '';
    if (sample.toLowerCase().includes('phone') || images.length > 1) {
      return {
        title: 'Smartphone in excellent condition',
        category: 'electronics',
        description: 'Well kept device with charger included. Meetup in Phnom Penh.',
        tags: ['phone', 'electronics'],
        brand: 'Apple',
      };
    }
    return {
      title: 'Pre-loved item ready for a new home',
      category: 'home',
      description: 'Clean, gently used, and ready for pickup. Happy to answer questions.',
      tags: ['home', 'secondhand'],
    };
  },
};
