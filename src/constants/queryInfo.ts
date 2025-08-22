import { DashboardStats, FullProductResponse, Product, ProductByCategory, ProductsSearchParams, ProductsWithPagination } from "@/types/products";
import { AxiosResponse } from "axios";
import { UseQueryOptions } from "@tanstack/react-query";
import reactQueryFetchFunction from "@/Utils/reactQueryFetchFunction";
import productsServices from "@/services/productsServices";
import GlobalConstants from "./GlobalConstants";
import { allCategoryProductsKey, allProductsKey, ownUserInfoKey, fullProductKey, allOrdersQueryKey, allProductsByCategoryQueryKey, allOrderStatusesDistributionQueryKey, allOrdersTimelineQueryKey, allDashboardStatsQueryKey, allReviewsQueryKey } from "./queryKey";
import userServices from "@/services/userServices";
import { User } from "@/types/user";
import { Session } from "next-auth";
import OrderService from "@/services/orderServices";
import { OrdersSearchParams, OrderStatusDistribution, OrdersWithPagination, OrderTimeline, OrderTimeLineParams } from "@/types/orders";
import GoogleService from "@/services/googleServices";
import { ReviewsResponse } from "@/types/reviews";

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

export function allProductsByCategoryQuery(session: Session | null):
UseQueryOptions<AxiosResponse<ProductByCategory[]>> {
  return {
    queryKey: [allProductsByCategoryQueryKey],
    queryFn: () => reactQueryFetchFunction<ProductByCategory[]>(
      productsServices.getAllProductsByCategory,
      [],
      session,
    ),
    enabled: !!session?.accessToken,
    staleTime: GlobalConstants.DROPDOWN_CACHE_TIME,
  };
}

export function allOrderStatusesDistributionQuery(session: Session | null):
UseQueryOptions<AxiosResponse<OrderStatusDistribution[]>> {
  return {
    queryKey: [allOrderStatusesDistributionQueryKey],
    queryFn: () => reactQueryFetchFunction<OrderStatusDistribution[]>(
      OrderService.getAllOrderStatusesDistribution,
      [],
      session,
    ),
    enabled: !!session?.accessToken,
    staleTime: GlobalConstants.DROPDOWN_CACHE_TIME,
  };
}

export function allOrdersTimelineQuery(
  session: Session | null, 
  params: OrderTimeLineParams,
):
UseQueryOptions<AxiosResponse<OrderTimeline[]>> {
  return {
    queryKey: [allOrdersTimelineQueryKey, params],
    queryFn: () => reactQueryFetchFunction<OrderTimeline[]>(
      OrderService.getAllOrdersTimeline,
      [],
      session,
      params,
    ),
    enabled: !!session?.accessToken,
    staleTime: GlobalConstants.DROPDOWN_CACHE_TIME,
  };
}

export function allDashboardStatsQuery(
  session: Session | null,
):
UseQueryOptions<AxiosResponse<DashboardStats>> {
  return {
    queryKey: [allDashboardStatsQueryKey],
    queryFn: () => reactQueryFetchFunction<DashboardStats>(
      productsServices.getAllDashboardStats,
      [],
      session,
    ),
    enabled: !!session?.accessToken,
    staleTime: GlobalConstants.DROPDOWN_CACHE_TIME,
  };
}

export function allReviewsQuery(lng?: string):
UseQueryOptions<AxiosResponse<ReviewsResponse>> {
  return {
    queryKey: [allReviewsQueryKey, lng],
    queryFn: () => reactQueryFetchFunction<ReviewsResponse>(
      GoogleService.getAllReviews,
      [],
      lng,
    ),
    staleTime: GlobalConstants.DROPDOWN_CACHE_TIME,
  };
}

export function allProductsByCategoryInfinite(
  params: Omit<ProductsSearchParams, 'page'>
) {
  return {
    queryKey: [allCategoryProductsKey, params],
    queryFn: ({ pageParam = 1 }) => reactQueryFetchFunction<ProductsWithPagination>(
      productsServices.getProductsByCategory,
      [],
      { ...params, page: pageParam },
    ),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data;
      return pagination.page < pagination.pages ? pagination.page + 1 : undefined;
    },
    staleTime: GlobalConstants.DROPDOWN_CACHE_TIME,
    initialPageParam: 1,
  };
}