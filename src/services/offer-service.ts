import { CURRENT_USER_ID } from '@/mock/users';
import { db } from '@/services/db';
import { messageService } from '@/services/message-service';
import { createId, delay, nowIso } from '@/utils/id';
import type { Money, Offer, OfferStatus } from '@/types';

function appendHistory(offer: Offer, status: OfferStatus, amount: Money, message?: string): void {
  offer.history.push({
    id: createId('oe'),
    actorId: CURRENT_USER_ID,
    status,
    amount,
    message,
    createdAt: nowIso(),
  });
  offer.status = status;
  offer.amount = amount;
  offer.updatedAt = nowIso();
}

export const offerService = {
  async getOffers(): Promise<Offer[]> {
    await delay();
    await db.hydrate();
    return [...db.data.offers].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  },

  async getOfferById(id: string): Promise<Offer | undefined> {
    await delay(140);
    await db.hydrate();
    return db.data.offers.find((item) => item.id === id);
  },

  async createOffer(data: {
    productId: string;
    amount: Money;
    message?: string;
    conversationId?: string;
  }): Promise<Offer> {
    await delay(240);
    await db.hydrate();
    const product = db.data.products.find((item) => item.id === data.productId);
    if (!product) throw new Error('Product not found');
    const offer: Offer = {
      id: createId('o'),
      productId: data.productId,
      conversationId: data.conversationId,
      buyerId: CURRENT_USER_ID,
      sellerId: product.sellerId,
      amount: data.amount,
      message: data.message,
      status: 'pending',
      createdAt: nowIso(),
      updatedAt: nowIso(),
      history: [
        {
          id: createId('oe'),
          actorId: CURRENT_USER_ID,
          status: 'pending',
          amount: data.amount,
          message: data.message,
          createdAt: nowIso(),
        },
      ],
    };
    db.data.offers.unshift(offer);
    db.data.notifications.unshift({
      id: createId('n'),
      type: 'newOffer',
      title: 'New offer received',
      body: `${offer.amount.currency} ${offer.amount.amount}`,
      createdAt: nowIso(),
      read: false,
      productId: offer.productId,
      offerId: offer.id,
    });
    await messageService.sendMessage({
      conversationId: data.conversationId,
      productId: data.productId,
      recipientId: product.sellerId,
      text: data.message ?? `Offered ${offer.amount.currency} ${offer.amount.amount}`,
      kind: 'offer',
      offerId: offer.id,
    });
    db.persist();
    return offer;
  },

  async acceptOffer(id: string): Promise<Offer> {
    await delay(220);
    await db.hydrate();
    const offer = db.data.offers.find((item) => item.id === id);
    if (!offer) throw new Error('Offer not found');
    appendHistory(offer, 'accepted', offer.amount);
    db.persist();
    return offer;
  },

  async declineOffer(id: string): Promise<Offer> {
    await delay(180);
    await db.hydrate();
    const offer = db.data.offers.find((item) => item.id === id);
    if (!offer) throw new Error('Offer not found');
    appendHistory(offer, 'declined', offer.amount);
    db.persist();
    return offer;
  },

  async counterOffer(id: string, amount: Money, message?: string): Promise<Offer> {
    await delay(220);
    await db.hydrate();
    const offer = db.data.offers.find((item) => item.id === id);
    if (!offer) throw new Error('Offer not found');
    appendHistory(offer, 'countered', amount, message);
    db.persist();
    return offer;
  },
};
