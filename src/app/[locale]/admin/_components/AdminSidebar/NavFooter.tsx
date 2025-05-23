"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck, ChevronsUpDown, LogOut, User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import RouteConstants from "@/constants/RouteConstants";
import useGetOwnUserInfoQuery from "@/hooks/useGetOwnUserInfoQuery";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function NavFooter() {
  const { data: session } = useSession();
  const { isMobile } = useSidebar();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userData = useGetOwnUserInfoQuery(session);

  async function handleSignOut() {
    try {
      await signOut({ redirect: false });
      queryClient.clear();

      router.push(RouteConstants.HOMEPAGE_ROUTE);
    } catch (error) {
      console.log("error", error)
    }
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground my-3 data-[active=true]:bg-sidebar-accent data-[active=true]:text-white py-1 h-10"
              >
                <User />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {userData.isLoading ? <LoadingSpinner size="small" />
                    : (
                      <>
                        <span className="truncate font-semibold">{userData.data?.data.name}</span>
                        <span className="truncate text-xs">{userData.data?.data.email}</span>
                      </>
                    )}
                </div>
                <ChevronsUpDown className="ml-auto !size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="end"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <User />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    {userData.isLoading ? <LoadingSpinner size="small" />
                      : (
                        <>
                          <span className="truncate font-semibold">{userData.data?.data.name}</span>
                          <span className="truncate text-xs">{userData.data?.data.email}</span>
                        </>
                      )}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleSignOut()}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
