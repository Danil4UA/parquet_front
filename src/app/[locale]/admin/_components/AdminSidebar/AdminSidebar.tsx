// src/app/admin/_components/AdminSidebar.tsx
"use client";
import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const pathname = usePathname();
  const language = pathname.split("/")[1];
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = `/${language}/login`;
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2>Effect Parquet</h2>}
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className={pathname === '/admin' ? 'active' : ''}>
            <Link href="/admin" title="Dashboard">
              <Package size={20} />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li className={pathname.startsWith('/admin/products') ? 'active' : ''}>
            <Link href="/admin/products" title="Products">
              <ShoppingBag size={20} />
              {!collapsed && <span>Products</span>}
            </Link>
          </li>
          {/* <li className={pathname.startsWith('/admin/users') ? 'active' : ''}>
            <Link href="/admin/users" title="Users">
              <Users size={20} />
              {!collapsed && <span>Users</span>}
            </Link>
          </li> */}
          <li className={pathname.startsWith('/admin/settings') ? 'active' : ''}>
            <Link href="/admin/settings" title="Settings">
              <Settings size={20} />
              {!collapsed && <span>Settings</span>}
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button 
          className="logout-button" 
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;