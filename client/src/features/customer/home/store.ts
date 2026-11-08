import { create } from "zustand";
import type { CustomerHomeResponse } from "./types";
import { getCustomerHomeDataOverview } from "./api";

const fallbackData: CustomerHomeResponse = {
  banners: [],
  categories: [],
  recentProducts: [],
  coupons: [],
};

type CustomerHomeStore = {
  data: CustomerHomeResponse;
  loading: boolean;
  loadHome: () => Promise<void>;
  clear: () => void;
};

export const useCustomerHomeStore = create<CustomerHomeStore>((set) => ({
  loading: true,
  data: fallbackData,
  loadHome: async () => {
    try {
      set({ loading: true });

      const response = await getCustomerHomeDataOverview();

      set({
        data: response ?? fallbackData,
        loading: false,
      });
    } catch (error) {
      console.error(error);
    }
  },
  clear: () => {
    set({ data: fallbackData, loading: true });
  },
}));
