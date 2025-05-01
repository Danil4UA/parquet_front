"use client";

import React from "react";
// import Image from "next/image";
import RouteConstants from "@/constants/RouteConstants";
import Link from "next/link";
import {
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

export default function NavHeader() {
  const { isMobile, state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="hover:bg-transparent"
        >
          <Link href={RouteConstants.ADMIN_ROUTE}>
            {state === "expanded" || isMobile
              // ? <Image src="/logo" alt="Effect Parquet" width={145} height={32} />
              // : <Image src="/logo" alt="Logo" width={32} height={32} />
            }
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
