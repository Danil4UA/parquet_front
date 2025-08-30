export interface SidebarItemType {
  path: string;
  text: string;
  Icon?: string;
  exactMatch?: boolean
}

export const SidebarItemsList: SidebarItemType[] = [
  {
    path: "/",
    Icon: "",
    text: "home",
    exactMatch: true
  },
  {
    path: "/products/all",
    Icon: "",
    text: "catalog"
  },
  {
    path: "/products/laminate",
    Icon: "",
    text: "laminate"
  },
  {
    path: "/products/spc",
    Icon: "",
    text: "spc"
  },
  {
    path: "/products/wood",
    Icon: "",
    text: "wood"
  },
  {
    path: "/products/sales",
    Icon: "",
    text: "sales"
  },
  {
    path: "/products/panels",
    Icon: "",
    text: "panels"
  },
  {
    path: "/products/cladding",
    Icon: "",
    text: "cladding"
  },
  {
    path: "/products/cleaning",
    Icon: "",
    text: "cleaningProducts"
  },
  {
    path: "/contact",
    Icon: "",
    text: "contactUs",
    exactMatch: true
  },
];
