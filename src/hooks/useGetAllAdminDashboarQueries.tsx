import { allDashboardStatsQuery, allOrderStatusesDistributionQuery, allOrdersTimelineQuery, allProductsByCategoryQuery } from "@/constants/queryInfo"
import { OrderTimeLineParams } from "@/types/orders"
import { useQueries } from "@tanstack/react-query"
import { Session } from "next-auth"

export default function useGetAllAdminDashboardQueries (
    session: Session | null,
    params: OrderTimeLineParams,
) {
    return useQueries({
        queries: [
            allProductsByCategoryQuery(session),
            allOrderStatusesDistributionQuery(session),
            allOrdersTimelineQuery(session, params),
            allDashboardStatsQuery(session)
        ]
    })
}