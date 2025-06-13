"use client";

import React from 'react';
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import AdminSidebar from './_components/AdminSidebar/AdminSidebar';

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
      <AdminSidebar />
      <MainContent>{children}</MainContent>
    </SidebarProvider>
  );
}