import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItemType = {
  _id: string;
  name: string;
  model: string;
  boxCoverage?: number;
  quantity: number;
  price: string;
  images: string[];
  description: string;
  category: string;
  stock: number;
  discount?: number;
  isAvailable: boolean;
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [] as CartItemType[],
    isCollapsedCart: true
  },
  reducers: {
    setCollapsedСart(state, action: PayloadAction<boolean>) {
      state.isCollapsedCart = action.payload;
    },
    setCart(state, action: PayloadAction<CartItemType[]>) {
      state.cartItems = action.payload;
    },
    addToCart(state, action: PayloadAction<CartItemType>) {
      const item = action.payload;
      const existingItem = state.cartItems.find((cartItem) => cartItem._id === item._id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },
    updateQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      const item = state.cartItems.find((cartItem) => cartItem._id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },
    clearCart(state) {
      state.cartItems = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
    }
  }
});

export const { setCart, addToCart, removeFromCart, updateQuantity, clearCart, setCollapsedСart } = cartSlice.actions;

export const selectTotalItems = (state: { cart: { cartItems: CartItemType[] } }) =>
  state.cart.cartItems.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state: { cart: { cartItems: CartItemType[] } }) =>
  state.cart.cartItems.reduce((total, item) => {
    const priceWithDiscount = item.discount ? parseFloat(item.price) * (1 - item.discount / 100) : parseFloat(item.price);
    return Number((total + priceWithDiscount * item.quantity).toFixed());
  }, 0);
export const cartReducer = cartSlice.reducer;
