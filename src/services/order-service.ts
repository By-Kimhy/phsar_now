import { CURRENT_USER_ID } from '@/mock/users';
import { db } from '@/services/db';
import { createId, delay, nowIso } from '@/utils/id';
import type { FulfillmentMethod, Order, TransactionStatus } from '@/types';

export const orderService = {
  async getOrders(): Promise<Order[]> {
    await delay();
    await db.hydrate();
    return [...db.data.orders].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  },

  async getOrderById(id: string): Promise<Order | undefined> {
    await delay(160);
    await db.hydrate();
    return db.data.orders.find((item) => item.id === id);
  },

  async createOrder(data: {
    productId: string;
    offerId?: string;
    fulfillment: FulfillmentMethod;
    paymentMethod: Order['paymentMethod'];
    meetupLocation?: string;
  }): Promise<Order> {
    await delay(360);
    await db.hydrate();
    const product = db.data.products.find((item) => item.id === data.productId);
    if (!product) throw new Error('Product not found');
    const offer = data.offerId ? db.data.offers.find((item) => item.id === data.offerId) : undefined;
    const order: Order = {
      id: createId('ord'),
      productId: product.id,
      buyerId: CURRENT_USER_ID,
      sellerId: product.sellerId,
      offerId: data.offerId,
      price: offer?.amount ?? product.price,
      fulfillment: data.fulfillment,
      paymentMethod: data.paymentMethod,
      status: 'payment-pending',
      meetupLocation: data.meetupLocation,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    db.data.orders.unshift(order);
    product.status = 'sold';
    db.persist();
    return order;
  },

  async updateStatus(id: string, status: TransactionStatus): Promise<Order> {
    await delay(200);
    await db.hydrate();
    const order = db.data.orders.find((item) => item.id === id);
    if (!order) throw new Error('Order not found');
    order.status = status;
    order.updatedAt = nowIso();
    db.persist();
    return order;
  },
};

export const paymentService = {
  async chargeMock(): Promise<{ ok: true; reference: string }> {
    await delay(500);
    return { ok: true, reference: createId('pay') };
  },
};

export const transactionService = {
  timeline(status: TransactionStatus): { key: TransactionStatus; label: string; done: boolean }[] {
    const steps: { key: TransactionStatus; label: string }[] = [
      { key: 'offer-sent', label: 'Offer sent' },
      { key: 'offer-accepted', label: 'Offer accepted' },
      { key: 'payment-pending', label: 'Payment escrow locked' },
      { key: 'preparing', label: 'Meetup hub confirmed' },
      { key: 'delivery', label: 'In-person handover' },
      { key: 'completed', label: 'Escrow release & review' },
    ];
    if (status === 'cancelled') {
      return [
        ...steps.map((step) => ({ ...step, done: false })),
        { key: 'cancelled', label: 'Cancelled', done: true },
      ];
    }
    const order = steps.findIndex((step) => step.key === status);
    return steps.map((step, index) => ({ ...step, done: index <= order }));
  },
};
