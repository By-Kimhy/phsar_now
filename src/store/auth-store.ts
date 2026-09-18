import { create } from 'zustand';

import { authService } from '@/services/auth-service';
import type { User } from '@/types';

type AuthState = {
  user: User | null;
  hydrated: boolean;
  loading: boolean;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string) => Promise<void>;
  completeProfile: (patch: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hydrated: false,
  loading: false,
  hydrate: async () => {
    const user = await authService.getSession();
    set({ user, hydrated: true });
  },
  login: async (email, password) => {
    set({ loading: true });
    const user = await authService.login(email, password);
    set({ user, loading: false });
  },
  register: async (name, email, phone) => {
    set({ loading: true });
    const user = await authService.register(name, email, phone);
    set({ user, loading: false });
  },
  completeProfile: async (patch) => {
    const user = await authService.completeProfile(patch);
    set({ user });
  },
  logout: async () => {
    await authService.logout();
    set({ user: null });
  },
}));
