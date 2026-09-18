import type { ChatMessage, Conversation } from '@/types';

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();

export const conversations: Conversation[] = [
  {
    id: 'c_iphone',
    productId: 'p_iphone15',
    buyerId: 'user_sokha',
    sellerId: 'user_dara',
    lastMessage: 'I can do $720 if we meet today.',
    lastMessageAt: hoursAgo(0.4),
    unreadCount: 2,
  },
  {
    id: 'c_honda',
    productId: 'p_honda',
    buyerId: 'user_sokha',
    sellerId: 'user_rith',
    lastMessage: 'Is this still available?',
    lastMessageAt: hoursAgo(4),
    unreadCount: 0,
  },
  {
    id: 'c_ipad',
    productId: 'p_ipad',
    buyerId: 'user_mina',
    sellerId: 'user_sokha',
    lastMessage: 'Can I see more photos?',
    lastMessageAt: hoursAgo(1.2),
    unreadCount: 1,
  },
];

export const messages: ChatMessage[] = [
  {
    id: 'm1',
    conversationId: 'c_iphone',
    senderId: 'user_sokha',
    kind: 'text',
    text: 'Hi, is the iPhone still available?',
    createdAt: hoursAgo(6),
  },
  {
    id: 'm2',
    conversationId: 'c_iphone',
    senderId: 'user_dara',
    kind: 'text',
    text: 'Yes, still available. Battery is 97%.',
    createdAt: hoursAgo(5.8),
  },
  {
    id: 'm3',
    conversationId: 'c_iphone',
    senderId: 'user_sokha',
    kind: 'text',
    text: 'Can you lower the price?',
    createdAt: hoursAgo(5.5),
  },
  {
    id: 'm4',
    conversationId: 'c_iphone',
    senderId: 'user_dara',
    kind: 'offer',
    offerId: 'o_iphone',
    text: 'Countered at $720',
    createdAt: hoursAgo(0.5),
  },
  {
    id: 'm5',
    conversationId: 'c_iphone',
    senderId: 'user_dara',
    kind: 'text',
    text: 'I can do $720 if we meet today.',
    createdAt: hoursAgo(0.4),
  },
  {
    id: 'm6',
    conversationId: 'c_honda',
    senderId: 'user_sokha',
    kind: 'text',
    text: 'Is this still available?',
    createdAt: hoursAgo(4),
  },
  {
    id: 'm7',
    conversationId: 'c_ipad',
    senderId: 'user_mina',
    kind: 'text',
    text: 'Hi Sokha, I like your iPad.',
    createdAt: hoursAgo(2),
  },
  {
    id: 'm8',
    conversationId: 'c_ipad',
    senderId: 'user_mina',
    kind: 'text',
    text: 'Can I see more photos?',
    createdAt: hoursAgo(1.2),
  },
];
