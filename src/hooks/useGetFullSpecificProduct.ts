import { getFullProduct } from "@/constants/queryInfo";
import { useQuery } from "@tanstack/react-query";

export default function useGetFullSpecificProduct(session, productId){
    return useQuery(getFullProduct(session, productId))
}