import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  username: string;
  role: string;
};

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) =>
        set({
          user
        }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      version: 1,
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          if (!item) return null;

          const parsed = JSON.parse(item);
          const now = Date.now();
          const oneDay = 1000 * 60 * 60 * 24;
          if (now - parsed.timestamp > oneDay) {
            localStorage.removeItem(name);
            return null;
          }

          return parsed.state ?? null;
        },
        setItem: (name, value) => {
          const wrapped = {
            state: value,
            timestamp: Date.now(),
          };
          localStorage.setItem(name, JSON.stringify(wrapped));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
