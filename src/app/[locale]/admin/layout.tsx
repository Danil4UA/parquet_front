"use client";

import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from './_components/AdminSidebar/AdminSidebar';

function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className={`
        relative
        w-full
        transition-[width] 
        duration-200 
        ease-linear
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