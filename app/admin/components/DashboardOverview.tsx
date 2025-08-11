"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi, isApiError } from "@/lib/services/api";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Eye,
  Filter,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Types for real data
interface RevenueData {
  name: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  trend: "up" | "down";
}

interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: string;
  time: string;
}

interface KPIData {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  loading?: boolean;
}

/**
 * KPI Card component for displaying key performance indicators
 */
function KPICard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
  loading = false,
}: KPICardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
          {description && <Skeleton className="h-3 w-40 mt-1" />}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          {trend === "up" ? (
            <ArrowUpRight className="h-3 w-3 text-green-500" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500" />
          )}
          <span
            className={cn(trend === "up" ? "text-green-500" : "text-red-500")}
          >
            {change}
          </span>
          <span>from last month</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Empty state component for when no data is available
 */
function EmptyState({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}

/**
 * Dashboard Overview component with analytics and KPIs
 * Features real-time metrics, interactive charts, and recent activity
 */
export function DashboardOverview() {
  const [timeRange, setTimeRange] = useState("7d");
  const [chartType, setChartType] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for real data
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [kpiData, setKpiData] = useState<KPIData[]>([]);

  /**
   * Load dashboard data from Supabase via backend API
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardApi.getDashboardData(timeRange);
      if (isApiError(response)) {
        throw new Error(response.error);
      }

      const payload = response?.data;
      if (!payload) {
        throw new Error("Invalid dashboard response");
      }

      const { kpis, revenueTimeseries, categoryDistribution, topProducts, recentOrders } = payload as any;

      setRevenueData((revenueTimeseries || []).map((d: any) => ({
        name: d.name,
        revenue: Number(d.revenue || 0),
        orders: Number(d.orders || 0),
        customers: Number(d.customers || 0),
      })));

      setCategoryData((categoryDistribution || []).map((c: any) => ({
        name: c.name,
        value: Number(c.value || 0),
        color: c.color || '#8884d8',
      })));

      setTopProducts((topProducts || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        sales: Number(p.sales || 0),
        revenue: Number(p.revenue || 0),
        trend: (p.trend || 'up') as 'up' | 'down',
      })));

      setRecentOrders((recentOrders || []).map((o: any) => ({
        id: o.id,
        customer: o.customer,
        amount: Number(o.amount || 0),
        status: o.status || 'pending',
        time: o.time,
      })));

      const revenueChange = Number(kpis?.changes?.revenueChangePct || 0);
      const ordersChange = Number(kpis?.changes?.ordersChangePct || 0);
      const activeOrdersChange = Number(kpis?.changes?.activeOrdersChangePct || 0);

      setKpiData([
        {
          title: 'Total Revenue',
          value: `৳${Number(kpis?.totalRevenue || 0).toLocaleString()}`,
          change: `${Math.abs(revenueChange).toFixed(1)}%`,
          trend: (revenueChange >= 0 ? 'up' : 'down') as 'up' | 'down',
          icon: DollarSign,
          description: 'Total revenue from all orders',
        },
        {
          title: 'Total Orders',
          value: String(kpis?.totalOrders || 0),
          change: `${Math.abs(ordersChange).toFixed(1)}%`,
          trend: (ordersChange >= 0 ? 'up' : 'down') as 'up' | 'down',
          icon: ShoppingCart,
          description: 'Total number of orders',
        },
        {
          title: 'Active Orders',
          value: String(kpis?.activeOrders || 0),
          change: `${Math.abs(activeOrdersChange).toFixed(1)}%`,
          trend: (activeOrdersChange >= 0 ? 'up' : 'down') as 'up' | 'down',
          icon: Package,
          description: 'Orders in progress',
        },
      ])
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard data load error:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load data when component mounts or timeRange changes
   */
  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  /**
   * Gets status badge color based on order status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Data</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadDashboardData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={loading}
          >
            <Filter className="h-4 w-4 mr-2" />
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? // Loading skeletons for KPI cards
            Array.from({ length: 4 }).map((_, index) => (
              <KPICard
                key={index}
                title=""
                value=""
                change=""
                trend="up"
                icon={DollarSign}
                loading={true}
              />
            ))
          : kpiData.length > 0
          ? // Real KPI data
            kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
                icon={kpi.icon}
                description={kpi.description}
              />
            ))
          : // Empty state for KPI cards
            Array.from({ length: 4 }).map((_, index) => (
              <KPICard
                key={index}
                title="No Data"
                value="--"
                change="--"
                trend="up"
                icon={DollarSign}
                description="No data available"
              />
            ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>
                  Monthly revenue and order trends
                </CardDescription>
              </div>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      chartType === "revenue" ? `৳${value}` : value,
                      name,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey={chartType}
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="No Revenue Data"
                description="No revenue data available for the selected time period."
                icon={TrendingUp}
              />
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Product category performance breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="No Category Data"
                description="No category sales data available for the selected time period."
                icon={Package}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Best performing products this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : topProducts && topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sales || 0} sales
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        ৳{(product.revenue || 0).toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-1">
                        {product.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Product Data"
                description="No top selling products data available for the selected time period."
                icon={Package}
              />
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest customer orders and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{order.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-medium text-sm">
                        ৳{(order.amount || 0).toLocaleString()}
                      </p>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs", getStatusColor(order.status))}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Order Data"
                description="No recent orders data available for the selected time period."
                icon={ShoppingCart}
              />
            )}
            <Button variant="outline" className="w-full mt-4">
              <Eye className="h-4 w-4 mr-2" />
              View All Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
