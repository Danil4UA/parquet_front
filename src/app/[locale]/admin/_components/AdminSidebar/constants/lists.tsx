import RouteConstants from "@/constants/RouteConstants";
import {
  BriefcaseBusiness,
  House,
  Sparkles,
} from "lucide-react";

export const mainList = [
  {
    id: "main-1",
    name: "DashBoard",
    icon: House,
    route: RouteConstants.ADMIN_ROUTE,
  },
  {
    id: "main-2",
    name: "Products",
    icon: BriefcaseBusiness,
    route: RouteConstants.ADMIN_PRODUCTS,
  },
  {
    id: "main-3",
    name: "Orders",
    icon: BriefcaseBusiness,
    route: RouteConstants.ADMIN_ORDERS,
  },
  {
    id: "main-4",
    name: "Recommendations",
    icon: Sparkles,
    route: RouteConstants.ADMIN_SETTINGS,
  },
];
