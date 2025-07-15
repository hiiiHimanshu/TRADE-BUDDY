import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stock, User, Trade } from './types';
import { initialStocks } from './mockData';

interface StoreState {
  stocks: Stock[];
  user: User | null;
  trades: Trade[];
  isConnected: boolean;
  updateStocks: (stocks: Stock[]) => void;
  setUser: (user: User | null) => void;
  addTrade: (trade: Trade) => void;
  setConnectionStatus: (status: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      stocks: initialStocks,
      user: null,
      trades: [],
      isConnected: true,
      updateStocks: (stocks) => set({ stocks }),
      setUser: (user) => set({ user }),
      addTrade: (trade) =>
        set((state) => ({ trades: [...state.trades, trade] })),
      setConnectionStatus: (status) => set({ isConnected: status }),
    }),
    {
      name: 'statuswebsite',
      partialize: (state) => ({
        // only persist these fields
        user: state.user,
        trades: state.trades,
      }),
    }
  )
);
