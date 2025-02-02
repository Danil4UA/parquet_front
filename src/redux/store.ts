import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { cartReducer } from "@/components/Cart/model/slice/cartSlice";
import {productsReducer} from "@/components/Products/model/productsSlice"
const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
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
