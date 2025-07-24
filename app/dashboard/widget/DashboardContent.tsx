'use client'

import { motion } from 'framer-motion'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { 
  ShoppingBag, 
  Settings, 
  Package, 
  CreditCard, 
  MapPin,
  Bell,
  Star,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import Button from '@/components/Button'
import type { Order, DashboardStats } from '@/lib/database'

// Serialized user type for client components
interface SerializedUser {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddresses: {
    emailAddress: string
    id: string
  }[]
  imageUrl: string
  createdAt: number
  lastSignInAt: number | null
}

// Using Order and DashboardStats from database types

interface DashboardContentProps {
  user: SerializedUser
  orders: Order[]
  stats: DashboardStats
}

/**
 * Dashboard content component for authenticated users
 * Features account overview, quick actions, and recent activity
 */
export default function DashboardContent({ user, orders, stats }: DashboardContentProps) {
  const firstName = user.firstName || 'User'
  const email = user.emailAddresses[0]?.emailAddress || ''
  const hasOrders = orders.length > 0
  const recentOrders = orders.slice(0, 3) // Show only 3 most recent orders
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {firstName}!
          </h1>
          <p className="text-gray-600">
            Manage your account and track your orders
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10'
              }
            }}
          />
        </div>
      </motion.div>
      
      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <QuickStatCard
          icon={<ShoppingBag className="w-6 h-6" />}
          title="Total Orders"
          value={stats.totalOrders.toString()}
          subtitle="All time"
          color="bg-blue-500"
        />
        
        <QuickStatCard
          icon={<CreditCard className="w-6 h-6" />}
          title="Total Spent"
          value={`£${stats.totalSpent.toFixed(2)}`}
          subtitle="All time"
          color="bg-purple-500"
        />
        
        <QuickStatCard
          icon={<Star className="w-6 h-6" />}
          title="Loyalty Points"
          value={stats.loyaltyPoints.toString()}
          subtitle="Available to use"
          color="bg-yellow-500"
        />
        
        <QuickStatCard
          icon={<Package className="w-6 h-6" />}
          title="Active Orders"
          value={stats.activeOrders.toString()}
          subtitle="In progress"
          color="bg-green-500"
        />
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickActionButton
                  icon={<ShoppingBag className="w-5 h-5" />}
                  title="Continue Shopping"
                  description="Browse our latest products"
                  href="/shop"
                />
                
                <QuickActionButton
                  icon={<Package className="w-5 h-5" />}
                  title="Track Orders"
                  description="Check your order status"
                  href="/dashboard/orders"
                />
                

                
                <QuickActionButton
                  icon={<Settings className="w-5 h-5" />}
                  title="Account Settings"
                  description="Update your preferences"
                  href="/dashboard/settings"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Account Overview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Account Overview</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Payment Methods</p>
                    <p className="text-sm text-gray-500">2 cards saved</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Addresses</p>
                    <p className="text-sm text-gray-500">3 addresses saved</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-500">Email & SMS enabled</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Manage Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link href="/dashboard/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {hasOrders ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <RecentOrderItem
                    key={order.id}
                    orderNumber={order.orderNumber}
                    date={new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                    status={order.status === 'shipped' ? 'In Transit' : 
                           order.status === 'delivered' ? 'Delivered' :
                           order.status === 'processing' ? 'Processing' : 'Cancelled'}
                    total={`£${order.total_amount.toFixed(2)}`}
                    items={typeof order.items === 'number' ? order.items : order.items.length}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">Start shopping to see your order history here.</p>
                <Link href="/">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

/**
 * Quick stat card component
 */
function QuickStatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color 
}: {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
  color: string
}) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
          <div className={`${color} text-white p-3 rounded-lg`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Quick action button component
 */
function QuickActionButton({
  icon,
  title,
  description,
  href
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href}>
      <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer">
        <div className="flex items-start space-x-3">
          <div className="text-gray-600">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}

/**
 * Recent order item component
 */
function RecentOrderItem({
  orderNumber,
  date,
  status,
  total,
  items
}: {
  orderNumber: string
  date: string
  status: string
  total: string
  items: number
}) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'in transit':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">{orderNumber}</h4>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{date} • {items} item{items > 1 ? 's' : ''}</span>
          <span className="font-medium text-gray-900">{total}</span>
        </div>
      </div>
    </div>
  )
}