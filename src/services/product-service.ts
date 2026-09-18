import { db } from '@/services/db';
import { delay } from '@/utils/id';
import type { Product, ProductFilters } from '@/types';

function applyFilters(items: Product[], filters: ProductFilters = {}): Product[] {
  const now = Date.now();
  return items.filter((product) => {
    if (product.status === 'draft' || product.status === 'pending') return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${product.title} ${product.brand ?? ''} ${product.tags.join(' ')} ${product.category}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.category && filters.category !== 'all' && filters.category !== 'more') {
      if (product.category !== filters.category) return false;
    }
    if (filters.conditions?.length && !filters.conditions.includes(product.condition)) {
      return false;
    } else if (filters.condition && filters.condition !== 'all' && product.condition !== filters.condition) {
      return false;
    }
    if (filters.brand && product.brand?.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }
    if (filters.location && !product.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.minPrice != null && product.price.amount < filters.minPrice) return false;
    if (filters.maxPrice != null && product.price.amount > filters.maxPrice) return false;
    if (filters.maxDistanceKm != null && product.distanceKm > filters.maxDistanceKm) return false;
    if (filters.dateListed && filters.dateListed !== 'any') {
      const hours = (now - new Date(product.createdAt).getTime()) / 3600_000;
      if (filters.dateListed === '24h' && hours > 24) return false;
      if (filters.dateListed === '7d' && hours > 24 * 7) return false;
      if (filters.dateListed === '30d' && hours > 24 * 30) return false;
    }
    return true;
  });
}

function sortProducts(items: Product[], sort: ProductFilters['sort'] = 'recommended'): Product[] {
  const copy = [...items];
  switch (sort) {
    case 'newest':
      return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case 'price-asc':
      return copy.sort((a, b) => a.price.amount - b.price.amount);
    case 'price-desc':
      return copy.sort((a, b) => b.price.amount - a.price.amount);
    case 'nearby':
      return copy.sort((a, b) => a.distanceKm - b.distanceKm);
    default:
      return copy.sort((a, b) => b.favoriteCount + b.views / 10 - (a.favoriteCount + a.views / 10));
  }
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    await delay();
    await db.hydrate();
    const favorites = new Set(db.data.favoriteIds);
    const result = sortProducts(applyFilters(db.data.products, filters), filters.sort).map((product) => ({
      ...product,
      isFavorite: favorites.has(product.id),
    }));
    return result;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    await delay(180);
    await db.hydrate();
    const product = db.data.products.find((item) => item.id === id);
    if (!product) return undefined;
    return { ...product, isFavorite: db.data.favoriteIds.includes(id) };
  },

  async getNearbyProducts(): Promise<Product[]> {
    return this.getProducts({ sort: 'nearby', maxDistanceKm: 15 });
  },

  async searchProducts(query: string, filters: ProductFilters = {}): Promise<Product[]> {
    return this.getProducts({ ...filters, query });
  },

  async getSuggestions(query: string): Promise<string[]> {
    await delay(120);
    await db.hydrate();
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const titles = db.data.products
      .map((item) => item.title)
      .filter((title) => title.toLowerCase().includes(q));
    const brands = db.data.products
      .map((item) => item.brand)
      .filter((brand): brand is string => Boolean(brand && brand.toLowerCase().includes(q)));
    return [...new Set([...titles, ...brands])].slice(0, 6);
  },
};
