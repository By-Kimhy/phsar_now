export type CurrencyCode = 'USD' | 'KHR';

export type Money = {
  amount: number;
  currency: CurrencyCode;
};

export type ProductCondition = 'new' | 'like-new' | 'good' | 'fair';

export type ListingStatus = 'active' | 'pending' | 'sold' | 'draft' | 'expired';

export type OfferStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'countered'
  | 'expired'
  | 'cancelled';

export type TransactionStatus =
  | 'offer-sent'
  | 'offer-accepted'
  | 'payment-pending'
  | 'preparing'
  | 'delivery'
  | 'completed'
  | 'cancelled';

export type FulfillmentMethod = 'meetup' | 'delivery';

export type NotificationType =
  | 'message'
  | 'newOffer'
  | 'offerAccepted'
  | 'counterOffer'
  | 'productSold'
  | 'priceDrop'
  | 'savedSearch'
  | 'listingActivity'
  | 'transactionUpdate';

export type CategoryId =
  | 'electronics'
  | 'fashion'
  | 'vehicles'
  | 'home'
  | 'beauty'
  | 'sports'
  | 'books'
  | 'accessories'
  | 'more';

export type User = {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  location: string;
  verified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  rating: number;
  reviewCount: number;
  listingsCount: number;
  soldCount: number;
  buyerRating: number;
  completedTransactions: number;
  responseRate: number;
  memberSince: string;
  bio?: string;
};

export type Seller = User & {
  followed?: boolean;
};

export type Product = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  images: string[];
  price: Money;
  negotiable: boolean;
  condition: ProductCondition;
  category: CategoryId;
  brand?: string;
  location: string;
  distanceKm: number;
  createdAt: string;
  specs: Record<string, string>;
  tags: string[];
  views: number;
  favoriteCount: number;
  messageCount: number;
  status: ListingStatus;
  isFavorite?: boolean;
};

export type Listing = Product;

export type Conversation = {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

export type ChatMessageKind = 'text' | 'image' | 'offer' | 'location' | 'system';

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  kind: ChatMessageKind;
  text?: string;
  imageUri?: string;
  offerId?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
};

export type OfferEvent = {
  id: string;
  actorId: string;
  status: OfferStatus;
  amount: Money;
  message?: string;
  createdAt: string;
};

export type Offer = {
  id: string;
  productId: string;
  conversationId?: string;
  buyerId: string;
  sellerId: string;
  amount: Money;
  message?: string;
  status: OfferStatus;
  history: OfferEvent[];
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  offerId?: string;
  price: Money;
  fulfillment: FulfillmentMethod;
  paymentMethod: 'cash' | 'bank-transfer' | 'card';
  status: TransactionStatus;
  meetupLocation?: string;
  createdAt: string;
  updatedAt: string;
};

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  productId?: string;
  conversationId?: string;
  offerId?: string;
  orderId?: string;
};

export type Review = {
  id: string;
  authorId: string;
  targetId: string;
  productId?: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type FavoriteCollection = {
  id: string;
  name: string;
  productIds: string[];
  createdAt: string;
};

export type SavedSearch = {
  id: string;
  query: string;
  filters: ProductFilters;
  createdAt: string;
};

export type ProductFilters = {
  query?: string;
  category?: CategoryId | 'all';
  minPrice?: number;
  maxPrice?: number;
  currency?: CurrencyCode;
  location?: string;
  condition?: ProductCondition | 'all';
  conditions?: ProductCondition[];
  brand?: string;
  maxDistanceKm?: number;
  dateListed?: 'any' | '24h' | '7d' | '30d';
  sort?: ProductSort;
};

export type ProductSort =
  | 'recommended'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'nearby';

export type ProductSection = {
  id: string;
  title: string;
  productIds: string[];
};

export type ListingSuggestion = {
  title: string;
  category: CategoryId;
  description: string;
  tags: string[];
  brand?: string;
};

export type ReportReason =
  | 'spam'
  | 'scam'
  | 'prohibited'
  | 'offensive'
  | 'counterfeit'
  | 'other';

export type ThemePreference = 'system' | 'light' | 'dark';
