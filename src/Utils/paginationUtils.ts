import { ReadonlyURLSearchParams } from "next/navigation";
import { ProductsSearchParams } from "@/types/products";

/**
 * Extracts pagination and filter parameters from URL search params
 * @param searchParams Next.js URL search params
 * @param pathname Current path for language extraction
 * @param category Current product category
 * @param defaultLimit Default number of items per page
 * @returns Object with all parameters needed for product fetching
 */
export function getProductsQueryParams(
  searchParams: ReadonlyURLSearchParams,
  pathname: string,
  category: string,
  defaultLimit = 20
): ProductsSearchParams {
  // Extract language from path
  const language = pathname.split("/")[1];
  
  // Get filter values from URL
  const search = searchParams.get("search") || "";
  const color = searchParams.get("color") || "";
  const type = searchParams.get("type") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || defaultLimit.toString());
  const sortBy = searchParams.get("sortBy") || "";

  
  return {
    category,
    search,
    color,
    type,
    language,
    page,
    limit,
    sortBy,
  };
}

/**
 * Creates the URL query string for pagination
 * @param params The current search parameters
 * @param newPage The page number to navigate to
 * @returns URL query string with updated page parameter
 */
export function createPaginationQueryString(
  params: ReadonlyURLSearchParams,
  newPage: number
): string {
  const newParams = new URLSearchParams(params.toString());
  newParams.set("page", newPage.toString());
  return newParams.toString();
}

/**
 * Calculates the total number of pages based on total items and items per page
 * @param totalItems Total number of items
 * @param itemsPerPage Number of items per page
 * @returns Total number of pages
 */
export function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  return Math.ceil(totalItems / itemsPerPage);
}

/**
 * Gets items range for current page (e.g., "Showing 1-16 of 100 products")
 * @param currentPage Current page number
 * @param itemsPerPage Items per page
 * @param totalItems Total items count
 * @returns Object with start and end item numbers
 */
export function getItemsRange(currentPage: number, itemsPerPage: number, totalItems: number): { start: number, end: number } {
  const start = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  
  return { start, end };
}