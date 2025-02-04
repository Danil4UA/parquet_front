"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCollapsedСart } from "@/components/Cart/model/slice/cartSlice";
import Cart from "@/components/Cart/ui/Cart/Cart";

export default function ClientCart() {
  const dispatch = useDispatch();
  const collapsedCart = useSelector((state: RootState) => state.cart.isCollapsedCart);

  return <Cart collapsed={collapsedCart} onClose={() => dispatch(setCollapsedСart(true))} />;
}
