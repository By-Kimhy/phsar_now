export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters: unknown) => ['products', 'list', filters] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    nearby: ['products', 'nearby'] as const,
    search: (query: string, filters: unknown) => ['products', 'search', query, filters] as const,
  },
  users: {
    detail: (id: string) => ['users', id] as const,
    reviews: (id: string) => ['users', id, 'reviews'] as const,
  },
  listings: {
    mine: (status?: string) => (status ? (['listings', 'mine', status] as const) : (['listings', 'mine'] as const)),
  },
  messages: {
    conversations: ['conversations'] as const,
    thread: (id: string) => ['messages', id] as const,
  },
  offers: {
    all: ['offers'] as const,
    detail: (id: string) => ['offers', id] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (id: string) => ['orders', id] as const,
  },
  notifications: ['notifications'] as const,
  favorites: ['favorites'] as const,
};
