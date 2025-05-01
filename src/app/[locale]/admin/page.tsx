"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, ShoppingCart, Plus, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";

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

  // Status badge styling helper
  const getStatusClasses = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Orders</h3>
                  <p className="text-2xl font-bold text-gray-800">{stats.orders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
                  <p className="text-2xl font-bold text-gray-800">₪{stats.revenue}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Order ID</th>
                      <th className="px-6 py-3 text-left">Customer</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right font-medium">{order.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-800">Quick Actions</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-4 px-4">
                  <Plus size={18} className="mr-3" />
                  <span>Add New Product</span>
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-left h-auto py-4 px-4">
                  <ShoppingCart size={18} className="mr-3" />
                  <span>View Recent Orders</span>
                </Button>
                
                <Button variant="outline" className="w-full justify-start text-left h-auto py-4 px-4">
                  <Clock size={18} className="mr-3" />
                  <span>Manage Inventory</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}