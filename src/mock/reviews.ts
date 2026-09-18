import type { Review } from '@/types';

export const reviews: Review[] = [
  {
    id: 'r1',
    authorId: 'user_dara',
    targetId: 'user_sokha',
    productId: 'p_switch',
    rating: 5,
    text: 'Smooth meetup in BKK1. Switch was exactly as described.',
    createdAt: new Date(Date.now() - 68 * 3600_000).toISOString(),
  },
  {
    id: 'r2',
    authorId: 'user_lina',
    targetId: 'user_dara',
    productId: 'p_iphone15',
    rating: 5,
    text: 'Met Sophea at AEON BKK1 Station 04. Escrow officer helped check the camera. Highly recommended.',
    createdAt: new Date(Date.now() - 48 * 3600_000).toISOString(),
  },
  {
    id: 'r3',
    authorId: 'user_mina',
    targetId: 'user_rith',
    productId: 'p_bicycle',
    rating: 4,
    text: 'Bike rides well. Pickup took a little longer than planned.',
    createdAt: new Date(Date.now() - 120 * 3600_000).toISOString(),
  },
  {
    id: 'r4',
    authorId: 'user_rith',
    targetId: 'user_dara',
    productId: 'p_macbook',
    rating: 5,
    text: 'Smooth negotiation and honest seller. Fast response and will definitely buy again.',
    createdAt: new Date(Date.now() - 168 * 3600_000).toISOString(),
  },
  {
    id: 'r5',
    authorId: 'user_vichea',
    targetId: 'user_dara',
    productId: 'p_speaker',
    rating: 5,
    text: 'Original accessories, fast handover near Brown Coffee. Escrow made it easy.',
    createdAt: new Date(Date.now() - 504 * 3600_000).toISOString(),
  },
];
