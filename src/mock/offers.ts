import { money } from '@/utils/money';
import type { Offer } from '@/types';

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();

export const offers: Offer[] = [
  {
    id: 'o_iphone',
    productId: 'p_iphone15',
    conversationId: 'c_iphone',
    buyerId: 'user_sokha',
    sellerId: 'user_dara',
    amount: money(720),
    message: 'Cash meetup at Aeon Mall today.',
    status: 'countered',
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(0.5),
    history: [
      {
        id: 'oe1',
        actorId: 'user_sokha',
        status: 'pending',
        amount: money(680),
        message: 'Would you take $680?',
        createdAt: hoursAgo(5),
      },
      {
        id: 'oe2',
        actorId: 'user_dara',
        status: 'countered',
        amount: money(720),
        message: 'Lowest is $720.',
        createdAt: hoursAgo(0.5),
      },
    ],
  },
  {
    id: 'o_ipad',
    productId: 'p_ipad',
    conversationId: 'c_ipad',
    buyerId: 'user_mina',
    sellerId: 'user_sokha',
    amount: money(400),
    status: 'pending',
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
    history: [
      {
        id: 'oe3',
        actorId: 'user_mina',
        status: 'pending',
        amount: money(400),
        createdAt: hoursAgo(2),
      },
    ],
  },
];
