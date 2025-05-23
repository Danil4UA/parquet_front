import { allOrdersQuery } from "@/constants/queryInfo";
import { OrdersSearchParams } from "@/types/orders";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";

export default function useGetAllOrdersQuery(
    session: Session | null, 
    params: OrdersSearchParams
) {
    return useQuery(allOrdersQuery(session, params))
}