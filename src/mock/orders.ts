import { money } from '@/utils/money';
import type { Order } from '@/types';

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();

export const orders: Order[] = [
  {
    id: 'ord_switch',
    productId: 'p_switch',
    buyerId: 'user_dara',
    sellerId: 'user_sokha',
    price: money(310),
    fulfillment: 'meetup',
    paymentMethod: 'cash',
    status: 'completed',
    meetupLocation: 'BKK1 park',
    createdAt: hoursAgo(90),
    updatedAt: hoursAgo(70),
  },
  {
    id: 'ord_watch',
    productId: 'p_watch',
    buyerId: 'user_sokha',
    sellerId: 'user_dara',
    price: money(160),
    fulfillment: 'meetup',
    paymentMethod: 'cash',
    status: 'payment-pending',
    meetupLocation: 'AEON Mall BKK1 · Station 04',
    createdAt: hoursAgo(8),
    updatedAt: hoursAgo(8),
  },
];
