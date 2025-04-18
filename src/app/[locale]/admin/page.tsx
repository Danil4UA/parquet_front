"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, ShoppingCart, Plus, Clock } from 'lucide-react';
import './dashboard.css';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState({
    totalProducts: 120,
    orders: 34,
    users: 256,
    revenue: '24,500'
  });
  
  // Simulate loading of dashboard data
  useEffect(() => {
    const loadDashboard = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(loadDashboard);
  }, []);
  
  const recentOrders = [
    { id: 'ORD-1234', customer: 'David Cohen', date: '2023-04-10', status: 'Completed', total: '₪1,240' },
    { id: 'ORD-1233', customer: 'Sarah Levi', date: '2023-04-09', status: 'Processing', total: '₪850' },
    { id: 'ORD-1232', customer: 'Moshe Goldberg', date: '2023-04-08', status: 'Completed', total: '₪2,100' },
    { id: 'ORD-1231', customer: 'Rachel Klein', date: '2023-04-07', status: 'Shipped', total: '₪920' },
    { id: 'ORD-1230', customer: 'Daniel Rubin', date: '2023-04-06', status: 'Completed', total: '₪1,560' }
  ];
  
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your admin dashboard</p>
      </div>
      
      {isLoading ? (
        <div className="loading-indicator">Loading dashboard data...</div>
      ) : (
        <>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon product-icon">
                <ShoppingBag size={24} />
              </div>
              <div className="stat-content">
                <h3>Total Products</h3>
                <p className="stat-value">{stats.totalProducts}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon order-icon">
                <ShoppingCart size={24} />
              </div>
              <div className="stat-content">
                <h3>Orders</h3>
                <p className="stat-value">{stats.orders}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon revenue-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <h3>Revenue</h3>
                <p className="stat-value">₪{stats.revenue}</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-sections">
            <div className="dashboard-section recent-orders">
              <div className="section-header">
                <h2>Recent Orders</h2>
                <button className="view-all-button">View All</button>
              </div>
              
              <div className="section-content">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.date}</td>
                        <td>
                          <span className={`status-badge status-${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="dashboard-section quick-actions">
              <div className="section-header">
                <h2>Quick Actions</h2>
              </div>
              
              <div className="quick-actions-grid">
                <button className="action-card">
                  <Plus size={20} />
                  <span>Add New Product</span>
                </button>
                
                <button className="action-card">
                  <ShoppingCart size={20} />
                  <span>View Recent Orders</span>
                </button>
                
                <button className="action-card">
                  <Clock size={20} />
                  <span>Manage Inventory</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}