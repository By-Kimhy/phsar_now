import type { CategoryId } from '@/types';

export const APP_NAME = 'PhsarNow';
export const APP_TAGLINE = 'Buy and sell around you';
export const DEFAULT_LOCATION = 'Phnom Penh';
export const OTP_CODE = '123456';
export const DEFAULT_CURRENCY = 'USD' as const;
export const KHR_PER_USD = 4100;
export const SEARCH_DEBOUNCE_MS = 280;
export const PAGE_SIZE = 12;

export const QUICK_REPLIES = [
  'Where can we meet?',
  'Can I inspect before paying?',
  'Is this still available?',
  'Can I see more photos?',
] as const;

export const CATEGORIES: {
  id: CategoryId;
  label: string;
  icon: 'phone-portrait-outline' | 'shirt-outline' | 'car-outline' | 'home-outline' | 'sparkles-outline' | 'basketball-outline' | 'book-outline' | 'watch-outline' | 'ellipsis-horizontal';
}[] = [
  { id: 'electronics', label: 'Electronics', icon: 'phone-portrait-outline' },
  { id: 'fashion', label: 'Fashion', icon: 'shirt-outline' },
  { id: 'vehicles', label: 'Vehicles', icon: 'car-outline' },
  { id: 'home', label: 'Home', icon: 'home-outline' },
  { id: 'beauty', label: 'Beauty', icon: 'sparkles-outline' },
  { id: 'sports', label: 'Sports', icon: 'basketball-outline' },
  { id: 'books', label: 'Books', icon: 'book-outline' },
  { id: 'accessories', label: 'Accessories', icon: 'watch-outline' },
  { id: 'more', label: 'More', icon: 'ellipsis-horizontal' },
];

export const CONDITIONS = [
  { id: 'new', label: 'Brand New' },
  { id: 'like-new', label: 'Like New' },
  { id: 'good', label: 'Good' },
  { id: 'fair', label: 'Fair' },
] as const;

export const TRENDING_SEARCHES = [
  'Sony A7IV',
  'Fujifilm X100V Silver',
  'Canon 24-70mm',
  'DJI Mini 4 Pro',
  'GoPro Hero 12',
  'Leica Q3',
];
