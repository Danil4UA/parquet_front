"use client";

import { useQuery } from "@tanstack/react-query";
import { allProductsByCategory } from "@/constants/queryInfo";

export default function useSalesAvailable(language: string) {
  const { data, isPending } = useQuery(
    allProductsByCategory({ category: "sales", language, page: 1, limit: 1 })
  );

  const total = data?.data?.pagination?.total ?? 0;

  return {
    salesAvailable: isPending ? true : total > 0,
    isPending
  };
}
