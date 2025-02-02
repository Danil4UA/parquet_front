"use client"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCart } from "@/components/Cart/model/slice/cartSlice";

const CartLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        dispatch(setCart(JSON.parse(savedCart)));
      }
    }
  }, [dispatch]);

  return null;
};

export default CartLoader;