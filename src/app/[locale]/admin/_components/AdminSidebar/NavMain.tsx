"use client";

import React from "react";
import {
  SidebarGroup, SidebarMenu,
} from "@/components/ui/sidebar";
import { mainList } from "./constants/lists";
import NavLinkItem from "./NavLinkItem"

type LinkItem = {
    id: string
    name: string
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    route: string
    disabled?: boolean
}

export default function NavMain() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {mainList.map((item) => {
          return <NavLinkItem item={item as LinkItem} key={item.id} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
