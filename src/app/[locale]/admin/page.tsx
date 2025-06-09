"use client";

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Plus,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useRouter } from 'next/navigation';

const mockOrdersData = [
  { date: '2024-01-01', orders: 12 },
  { date: '2024-01-02', orders: 8 },
  { date: '2024-01-03', orders: 15 },
  { date: '2024-01-04', orders: 10 },
  { date: '2024-01-05', orders: 18 },
  { date: '2024-01-06', orders: 14 },
  { date: '2024-01-07', orders: 22 }
];

const mockOrderStatusData = [
  { name: 'Pending', value: 15, color: '#f59e0b' },
  { name: 'Completed', value: 35, color: '#22c55e' },
  { name: 'Canceled', value: 8, color: '#ef4444' }
];

const mockCategoryData = [
  { category: 'Laminate', count: 28 },
  { category: 'SPC', count: 22 },
  { category: 'Wood', count: 18 },
  { category: 'Sales', count: 15 },
  { category: 'Panels', count: 12 },
  { category: 'Cladding', count: 8 },
  { category: 'Cleaning Products', count: 5 }
];

export default function AdminDashboard() {
  const router = useRouter();

  // Здесь будут ваши API вызовы
  // const { data: statsData } = useGetDashboardStats();
  // const { data: ordersData } = useGetOrdersStats();
  // const { data: categoriesData } = useGetProductsByCategory();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Heres your store overview.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleNavigate('/admin/products/add-product')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">58</div>
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +3 this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">35</div>
            <p className="text-xs text-green-600">60.3% success rate</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">15</div>
            <p className="text-xs text-orange-600">Need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">108</div>
            <p className="text-xs text-gray-500">Across all categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Timeline */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-gray-900">Orders This Week</CardTitle>
            <CardDescription>Daily orders for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockOrdersData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-gray-900">Order Status</CardTitle>
            <CardDescription>Current order status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockOrderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockOrderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products by Category */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-gray-900">Products by Category</CardTitle>
            <CardDescription>Number of products in each category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCategoryData.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'][index] }}
                    />
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(item.count / Math.max(...mockCategoryData.map(d => d.count))) * 100}%`,
                          backgroundColor: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'][index]
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8 text-right">{item.count}</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total Products:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {mockCategoryData.reduce((sum, item) => sum + item.count, 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => handleNavigate('/admin/products')} 
              variant="outline" 
              className="w-full justify-start gap-3 h-12 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              <Package className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">View All Products</div>
                <div className="text-xs text-gray-500">Manage your inventory</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => handleNavigate('/admin/orders')} 
              variant="outline" 
              className="w-full justify-start gap-3 h-12 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
            >
              <ShoppingCart className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">View All Orders</div>
                <div className="text-xs text-gray-500">Process and track orders</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => handleNavigate('/admin/products/add-product')} 
              variant="outline" 
              className="w-full justify-start gap-3 h-12 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
            >
              <Plus className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Add New Product</div>
                <div className="text-xs text-gray-500">Create a new product listing</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}