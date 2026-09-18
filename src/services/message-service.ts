import { CURRENT_USER_ID } from '@/mock/users';
import { db } from '@/services/db';
import { createId, delay, nowIso } from '@/utils/id';
import type { ChatMessage, Conversation } from '@/types';

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    await delay();
    await db.hydrate();
    return [...db.data.conversations].sort(
      (a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt),
    );
  },

  async getConversation(id: string): Promise<Conversation | undefined> {
    await delay(120);
    await db.hydrate();
    return db.data.conversations.find((item) => item.id === id);
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    await delay(160);
    await db.hydrate();
    return db.data.messages
      .filter((item) => item.conversationId === conversationId)
      .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
  },

  async sendMessage(data: {
    conversationId?: string;
    productId: string;
    recipientId: string;
    text?: string;
    imageUri?: string;
    kind?: ChatMessage['kind'];
    offerId?: string;
    latitude?: number;
    longitude?: number;
  }): Promise<{ conversation: Conversation; message: ChatMessage }> {
    await delay(180);
    await db.hydrate();
    let conversation = data.conversationId
      ? db.data.conversations.find((item) => item.id === data.conversationId)
      : db.data.conversations.find(
          (item) =>
            item.productId === data.productId &&
            [item.buyerId, item.sellerId].includes(CURRENT_USER_ID) &&
            [item.buyerId, item.sellerId].includes(data.recipientId),
        );

    if (!conversation) {
      const product = db.data.products.find((item) => item.id === data.productId);
      conversation = {
        id: createId('c'),
        productId: data.productId,
        buyerId: CURRENT_USER_ID,
        sellerId: product?.sellerId ?? data.recipientId,
        lastMessage: data.text ?? 'New message',
        lastMessageAt: nowIso(),
        unreadCount: 0,
      };
      db.data.conversations.unshift(conversation);
    }

    const message: ChatMessage = {
      id: createId('m'),
      conversationId: conversation.id,
      senderId: CURRENT_USER_ID,
      kind: data.kind ?? (data.imageUri ? 'image' : 'text'),
      text: data.text,
      imageUri: data.imageUri,
      offerId: data.offerId,
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: nowIso(),
    };
    db.data.messages.push(message);
    conversation.lastMessage = data.text ?? (data.imageUri ? 'Sent a photo' : 'New message');
    conversation.lastMessageAt = message.createdAt;
    db.persist();
    return { conversation, message };
  },

  async markRead(conversationId: string): Promise<void> {
    await db.hydrate();
    const conversation = db.data.conversations.find((item) => item.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      db.persist();
    }
  },
};
