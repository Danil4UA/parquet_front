"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFavorites } from "./model/slice/favoritesSlice";

const FavoritesLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites");
      if (saved) {
        try {
          dispatch(setFavorites(JSON.parse(saved)));
        } catch {
          localStorage.removeItem("favorites");
        }
      }
    }
  }, [dispatch]);

  return null;
};

export default FavoritesLoader;
