import AsyncStorage from '@react-native-async-storage/async-storage';

import { CURRENT_USER_ID, currentUser } from '@/mock/users';
import { delay } from '@/utils/id';
import type { User } from '@/types';

const AUTH_KEY = 'phsarnow.auth.user';

export const authService = {
  async getSession(): Promise<User | null> {
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  },

  async login(_email: string, _password: string): Promise<User> {
    await delay(400);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
    return currentUser;
  },

  async register(name: string, email: string, phone: string): Promise<User> {
    await delay(450);
    const user: User = {
      ...currentUser,
      id: CURRENT_USER_ID,
      name,
      email,
      phone,
    };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  async verifyOtp(code: string): Promise<boolean> {
    await delay(280);
    return code === '123456';
  },

  async completeProfile(patch: Partial<User>): Promise<User> {
    await delay(280);
    const session = (await this.getSession()) ?? currentUser;
    const user = { ...session, ...patch };
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_KEY);
  },
};
