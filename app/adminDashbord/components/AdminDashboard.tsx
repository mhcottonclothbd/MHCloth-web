"use client";

import {
  Archive,
  BarChart3,
  Home,
  Mail,
  Package,
  PieChart,
  Settings,
  ShoppingCart,
  Tag,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

/**
 * Admin Dashboard Component
 * Comprehensive dashboard for e-commerce store management
 */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data for dashboard metrics
  const metrics = {
    totalRevenue: 82650,
    totalOrders: 1645,
    revenueGrowth: 11,
    ordersGrowth: 8,
  };

  const salesData = {
    today: 23262.0,
    yesterday: 11135.0,
    thisMonth: 48135.0,
  };

  const topProducts = [
    {
      id: 1,
      name: "Air Jordan 8",
      sales: 156,
      image: "/assets/men-catagerory--icon/t-shirts.png",
    },
    {
      id: 2,
      name: "Air Jordan 5",
      sales: 142,
      image: "/assets/men-catagerory--icon/polo.jpg",
    },
    {
      id: 3,
      name: "Air Jordan 13",
      sales: 128,
      image: "/assets/men-catagerory--icon/jeans.jpg",
    },
    {
      id: 4,
      name: "Nike Air Max",
      sales: 115,
      image: "/assets/men-catagerory--icon/shorts.png",
    },
  ];

  const sidebarItems = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "products", name: "Products", icon: Package },
    { id: "offers", name: "Offers", icon: Tag },
    { id: "inventory", name: "Inventory", icon: Archive },
    { id: "orders", name: "Orders", icon: ShoppingCart },
    { id: "sales", name: "Sales", icon: PieChart },
    { id: "customers", name: "Customer", icon: Users },
    { id: "newsletter", name: "Newsletter", icon: Mail },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-emerald-300/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-emerald-500 font-bold text-xl">P</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Pixel</h1>
              <p className="text-emerald-100 text-sm">Commerce</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-white text-emerald-600 shadow-lg"
                    : "text-emerald-100 hover:bg-emerald-400/30 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              <p className="text-gray-600 mt-1">
                Welcome back! Here's what's happening with your store.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option>Jul 2023</option>
                <option>Aug 2023</option>
                <option>Sep 2023</option>
              </select>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 text-xl">💰</span>
                </div>
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />+
                  {metrics.revenueGrowth}%
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                <p className="text-gray-400 text-xs mb-2">Last 30 days</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${metrics.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🛒</span>
                </div>
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />+{metrics.ordersGrowth}
                  %
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Order</p>
                <p className="text-gray-400 text-xs mb-2">Last 30 days</p>
                <p className="text-3xl font-bold text-gray-900">
                  {metrics.totalOrders}
                </p>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">⭐</span>
                </div>
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +2.1%
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  Customer Satisfaction
                </p>
                <p className="text-gray-400 text-xs mb-2">Last 30 days</p>
                <p className="text-3xl font-bold text-gray-900">4.8</p>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-xl">📈</span>
                </div>
                <div className="flex items-center text-red-600 text-sm font-medium">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -0.5%
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Conversion Rate</p>
                <p className="text-gray-400 text-xs mb-2">Last 30 days</p>
                <p className="text-3xl font-bold text-gray-900">3.2%</p>
              </div>
            </div>
          </div>

          {/* Sales Analytics & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Analytics */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sales Analytic
                </h3>
                <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500">
                  <option>Jul 2023</option>
                </select>
              </div>

              {/* Sales Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {salesData.today.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Today</p>
                  <div className="flex items-center justify-center mt-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500">+5.2%</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {salesData.yesterday.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Yesterday</p>
                  <div className="flex items-center justify-center mt-1">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500">-2.1%</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {salesData.thisMonth.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">This Month</p>
                  <div className="flex items-center justify-center mt-1">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-500">+8.7%</span>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg flex items-center justify-center border border-emerald-100">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <p className="text-gray-600">Sales Analytics Chart</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Interactive chart would be displayed here
                  </p>
                </div>
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Top Selling Products
              </h3>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyNUMyMi43NjE0IDI1IDI1IDIyLjc2MTQgMjUgMjBDMjUgMTcuMjM4NiAyMi43NjE0IDE1IDIwIDE1QzE3LjIzODYgMTUgMTUgMTcuMjM4NiAxNSAyMEMxNSAyMi43NjE0IDE3LjIzODYgMjUgMjAgMjVaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMCAzMEgzMFYyN0MzMCAyNS4zNDMxIDI4LjY1NjkgMjQgMjcgMjRIMTNDMTEuMzQzMSAyNCAxMCAyNS4zNDMxIDEwIDI3VjMwWiIgZmlsbD0iIzlCOUJBMCIvPgo8L3N2Zz4K";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.sales} Sales
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full text-xs font-medium">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
