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
    path: "/products/all",
    Icon: "",
    text: "catalog"
  }
];
