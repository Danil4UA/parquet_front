import React from 'react';
import AdminSidebar from './_components/AdminSidebar/AdminSidebar';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}