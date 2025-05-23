import { FullProductResponse, Product, ProductsSearchParams, ProductsWithPagination } from "@/types/products";
import { AxiosResponse } from "axios";
import { UseQueryOptions } from "@tanstack/react-query";
import reactQueryFetchFunction from "@/Utils/reactQueryFetchFunction";
import productsServices from "@/services/productsServices";
import GlobalConstants from "./GlobalConstants";
import { allCategoryProductsKey, allProductsKey, ownUserInfoKey, fullProductKey, allOrdersQueryKey } from "./queryKey";
import userServices from "@/services/userServices";
import { User } from "@/types/user";
import { Session } from "next-auth";
import OrderService from "@/services/orderServices";
import { OrdersSearchParams, OrdersWithPagination } from "@/types/orders";

export function allProducts():
UseQueryOptions<AxiosResponse<Product[]>> {
  return {
    queryKey: [allProductsKey],
    queryFn: () => reactQueryFetchFunction<Product[]>(
      productsServices.getAllProducts,
      [],
    ),
    staleTime: GlobalConstants.DROPDOWN_CACHE_TIME,
  };
}

export function allProductsByCategory(params: ProductsSearchParams):
UseQueryOptions<AxiosResponse<ProductsWithPagination>> {
  return {
    queryKey: [allCategoryProductsKey, params],
    queryFn: () => reactQueryFetchFunction<ProductsWithPagination>(
      productsServices.getProductsByCategory,
      [],
      params,
    ),
    staleTime: GlobalConstants.DROPDOWN_CACHE_TIME,
  };
}

export function getFullProduct(session: any, productId: string):
UseQueryOptions<AxiosResponse<FullProductResponse>> {
  return {
    queryKey: [fullProductKey, productId],
    queryFn: () => reactQueryFetchFunction<FullProductResponse>(
      productsServices.getFullProduct,
      [],
      session,
      productId,
    ),
    enabled: !!session?.accessToken,
    staleTime: GlobalConstants.DROPDOWN_CACHE_TIME,
  };
}

export function getOwnUserInfoQuery(session: any):
  UseQueryOptions<AxiosResponse<User>> {
  return {
    queryKey: [ownUserInfoKey],
    queryFn: () => reactQueryFetchFunction<User>(
      userServices.getUser,
      [],
      session,
    ),
    enabled: !!session?.accessToken,
    staleTime: GlobalConstants.DROPDOWN_CACHE_TIME,
  };
}

export function allOrdersQuery(session: Session | null, params: OrdersSearchParams):
UseQueryOptions<AxiosResponse<OrdersWithPagination>> {
  return {
    queryKey: [allOrdersQueryKey, params],
    queryFn: () => reactQueryFetchFunction<OrdersWithPagination>(
      OrderService.getAllOrders,
      [],
      session,
      params,
    ),
    enabled: !!session?.accessToken,
    staleTime: GlobalConstants.DROPDOWN_CACHE_TIME,
  };
}


