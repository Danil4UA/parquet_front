import RouteConstants from "@/constants/RouteConstants";
import {
  BriefcaseBusiness,
  House,
  Images,
  Sparkles,
  Camera,
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
  {
    id: "main-5",
    name: "Homepage",
    icon: Images,
    route: RouteConstants.ADMIN_HOMEPAGE,
  },
  {
    id: "main-6",
    name: "Visualizer",
    icon: Camera,
    route: RouteConstants.ADMIN_VISUALIZER,
  },
];
