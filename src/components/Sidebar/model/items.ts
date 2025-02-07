export interface SidebarItemType {
  path: string;
  text: string;
  Icon?: string;
}

export const SidebarItemsList: SidebarItemType[] = [
  {
    path: "/",
    Icon: "",
    text: "home"
  },
  {
    path: "/products/all",
    Icon: "",
    text: "catalog"
  },
  {
    path: "/products/flooring",
    Icon: "",
    text: "flooring"
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
    path: "/products/thresholds",
    Icon: "",
    text: "thresholds"
  },
  {
    path: "/products/cladding",
    Icon: "",
    text: "cladding"
  }
];
