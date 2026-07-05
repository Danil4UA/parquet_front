"use client";

import React, { useEffect } from 'react';
import { signOut, useSession } from "next-auth/react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import AdminSidebar from './_components/AdminSidebar/AdminSidebar';
import setupAxiosAuthRefresh from "@/lib/setupAxiosAuthRefresh";

setupAxiosAuthRefresh();

// If the refresh token was revoked/expired, the session carries an error —
// force a clean re-login instead of letting API calls fail with 401s.
function SessionErrorGuard() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session?.error]);

  return null;
}

function MainContent({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();

  return (
    <div 
      className={`
        bg-gray-50
        relative
        w-full
        transition-[width] 
        duration-200 
        ease-linear
        ${state === "expanded" ? "md:w-[calc(100%-theme(spacing.64))]" : "md:w-[calc(100%-theme(spacing.12))]"}
      `}
    >
      <div className="absolute top-0 left-0 h-full">
        <SidebarTrigger className="sticky top-0 left-0" />
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({ 
  children 
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SessionErrorGuard />
      <AdminSidebar />
      <MainContent>{children}</MainContent>
    </SidebarProvider>
  );
}