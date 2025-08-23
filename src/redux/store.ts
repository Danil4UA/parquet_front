import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { cartReducer } from "@/components/Cart/model/slice/cartSlice";
import { productsReducer } from "@/components/Products/model/productsSlice"
import { navbarReducer } from "@/components/Navbar/model/navbarSlice"

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    navbar: navbarReducer, 
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
