import { allProductsByCategory } from "@/constants/queryInfo";
import { ProductsSearchParams } from "@/types/products";
import { useQuery } from "@tanstack/react-query";

export default function useGetAllProductsByCategory(params: ProductsSearchParams ){
    return useQuery(allProductsByCategory(params))
}