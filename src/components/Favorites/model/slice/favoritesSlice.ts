import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/products";

const FAVORITES_KEY = "favorites";

const persist = (items: Product[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  }
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [] as Product[]
  },
  reducers: {
    setFavorites(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
    toggleFavorite(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const exists = state.items.some((item) => item._id === product._id);
      if (exists) {
        state.items = state.items.filter((item) => item._id !== product._id);
      } else {
        state.items.push(product);
      }
      persist(state.items);
    },
    removeFromFavorites(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item._id !== action.payload);
      persist(state.items);
    },
    clearFavorites(state) {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem(FAVORITES_KEY);
      }
    }
  }
});

export const { setFavorites, toggleFavorite, removeFromFavorites, clearFavorites } = favoritesSlice.actions;

export const selectFavorites = (state: { favorites: { items: Product[] } }) =>
  state.favorites.items;

export const selectTotalFavorites = (state: { favorites: { items: Product[] } }) =>
  state.favorites.items.length;

export const selectIsFavorited = (id: string) => (state: { favorites: { items: Product[] } }) =>
  state.favorites.items.some((item) => item._id === id);

export const favoritesReducer = favoritesSlice.reducer;
