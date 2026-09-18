import { CURRENT_USER_ID } from '@/mock/users';
import { db } from '@/services/db';
import { createId, delay, nowIso } from '@/utils/id';
import type { Review, User } from '@/types';

export const userService = {
  async getUserById(id: string): Promise<User | undefined> {
    await delay(160);
    await db.hydrate();
    return db.data.users.find((user) => user.id === id);
  },

  async getCurrentUser(): Promise<User | undefined> {
    return this.getUserById(CURRENT_USER_ID);
  },

  async getReviews(userId: string): Promise<Review[]> {
    await delay(160);
    await db.hydrate();
    return db.data.reviews.filter((review) => review.targetId === userId);
  },

  async submitReview(input: { targetId: string; productId?: string; rating: number; text: string }): Promise<Review> {
    await delay(240);
    await db.hydrate();
    const review: Review = {
      id: createId('r'),
      authorId: CURRENT_USER_ID,
      targetId: input.targetId,
      productId: input.productId,
      rating: input.rating,
      text: input.text,
      createdAt: nowIso(),
    };
    db.data.reviews.unshift(review);
    const target = db.data.users.find((user) => user.id === input.targetId);
    if (target) {
      const reviews = db.data.reviews.filter((item) => item.targetId === input.targetId);
      target.reviewCount = reviews.length;
      target.rating = Math.round((reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length) * 10) / 10;
    }
    db.persist();
    return review;
  },

  async updateProfile(patch: Partial<User>): Promise<User> {
    await delay(220);
    await db.hydrate();
    const index = db.data.users.findIndex((user) => user.id === CURRENT_USER_ID);
    db.data.users[index] = { ...db.data.users[index], ...patch };
    db.persist();
    return db.data.users[index];
  },

  async followSeller(id: string): Promise<void> {
    await db.hydrate();
    if (!db.data.followedSellerIds.includes(id)) {
      db.data.followedSellerIds.push(id);
      db.persist();
    }
  },

  async unfollowSeller(id: string): Promise<void> {
    await db.hydrate();
    db.data.followedSellerIds = db.data.followedSellerIds.filter((item) => item !== id);
    db.persist();
  },

  async isFollowing(id: string): Promise<boolean> {
    await db.hydrate();
    return db.data.followedSellerIds.includes(id);
  },

  async blockUser(id: string): Promise<void> {
    await db.hydrate();
    if (!db.data.blockedUserIds.includes(id)) {
      db.data.blockedUserIds.push(id);
      db.persist();
    }
  },
};
