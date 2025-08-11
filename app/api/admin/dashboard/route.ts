import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

type TimeRange = '7d' | '30d' | '90d' | '1y'

function getDateRange(timeRange: TimeRange): { start: Date; end: Date; bucket: 'day' | 'week' | 'month' } {
  const end = new Date()
  const start = new Date(end)
  let bucket: 'day' | 'week' | 'month' = 'day'

  switch (timeRange) {
    case '7d':
      start.setDate(end.getDate() - 7)
      bucket = 'day'
      break
    case '30d':
      start.setDate(end.getDate() - 30)
      bucket = 'week'
      break
    case '90d':
      start.setDate(end.getDate() - 90)
      bucket = 'week'
      break
    case '1y':
      start.setFullYear(end.getFullYear() - 1)
      bucket = 'month'
      break
    default:
      start.setDate(end.getDate() - 7)
      bucket = 'day'
  }

  return { start, end, bucket }
}

function computeChangePercent(current: number, previous: number): number {
  if (!previous) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Server not configured with SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = (searchParams.get('timeRange') as TimeRange) || '7d'

    const { start, end, bucket } = getDateRange(timeRange)
    const rangeMs = end.getTime() - start.getTime()
    const prevStart = new Date(start.getTime() - rangeMs)
    const prevEnd = new Date(start)

    const startISO = start.toISOString()
    const endISO = end.toISOString()
    const prevStartISO = prevStart.toISOString()
    const prevEndISO = prevEnd.toISOString()

    // Fetch metrics in parallel
    const [metricsRes, prevMetricsRes, timeseriesRes, categoriesRes, topProductsRes, recentOrdersRes] = await Promise.all([
      supabaseAdmin.rpc('get_dashboard_metrics', { start_date: startISO, end_date: endISO }),
      supabaseAdmin.rpc('get_dashboard_metrics', { start_date: prevStartISO, end_date: prevEndISO }),
      supabaseAdmin.rpc('get_revenue_timeseries', { start_date: startISO, end_date: endISO, bucket }),
      supabaseAdmin.rpc('get_category_sales', { start_date: startISO, end_date: endISO }),
      supabaseAdmin.rpc('get_top_products', { start_date: startISO, end_date: endISO, limit_count: 5 }),
      supabaseAdmin.rpc('get_recent_orders', { limit_count: 5 }),
    ])

    // Handle errors
    const maybeError = [metricsRes, prevMetricsRes, timeseriesRes, categoriesRes, topProductsRes, recentOrdersRes].find(r => r.error)
    if (maybeError?.error) {
      throw new Error((maybeError.error as any).message || String(maybeError.error))
    }

    const metrics = (metricsRes.data?.[0] || { total_orders: 0, active_orders: 0, total_revenue: 0 }) as { total_orders: number; active_orders: number; total_revenue: number }
    const prevMetrics = (prevMetricsRes.data?.[0] || { total_orders: 0, active_orders: 0, total_revenue: 0 }) as { total_orders: number; active_orders: number; total_revenue: number }

    const kpiChanges = {
      revenueChangePct: computeChangePercent(Number(metrics.total_revenue || 0), Number(prevMetrics.total_revenue || 0)),
      ordersChangePct: computeChangePercent(Number(metrics.total_orders || 0), Number(prevMetrics.total_orders || 0)),
      activeOrdersChangePct: computeChangePercent(Number(metrics.active_orders || 0), Number(prevMetrics.active_orders || 0)),
    }

    const revenueTimeseries = (timeseriesRes.data || []).map((row: any) => ({
      name: row.name,
      revenue: Number(row.revenue || 0),
      orders: Number(row.orders || 0),
      customers: Number(row.customers || 0),
    }))

    // Category distribution → percent share
    const rawCategories = (categoriesRes.data || []) as { name: string; revenue: number }[]
    const totalCategoryRevenue = rawCategories.reduce((sum, c) => sum + Number(c.revenue || 0), 0)
    const COLORS = ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#06B6D4', '#F43F5E', '#22C55E']
    const categoryDistribution = rawCategories.map((c, idx) => ({
      name: c.name,
      value: totalCategoryRevenue > 0 ? Math.round((Number(c.revenue) / totalCategoryRevenue) * 100) : 0,
      color: COLORS[idx % COLORS.length],
    }))

    const topProducts = (topProductsRes.data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      sales: Number(p.sales || 0),
      revenue: Number(p.revenue || 0),
      trend: 'up' as const, // Basic indicator; precise trend requires additional data
    }))

    const recentOrders = (recentOrdersRes.data || []).map((o: any) => ({
      id: o.order_number || o.id,
      customer: o.customer_name || 'Unknown',
      amount: Number(o.total_amount || 0),
      status: o.status || 'pending',
      time: o.created_at,
    }))

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          totalRevenue: Number(metrics.total_revenue || 0),
          totalOrders: Number(metrics.total_orders || 0),
          activeOrders: Number(metrics.active_orders || 0),
          changes: kpiChanges,
        },
        revenueTimeseries,
        categoryDistribution,
        topProducts,
        recentOrders,
      },
    })
  } catch (error) {
    console.error('Error in GET /api/admin/dashboard:', error)
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Failed to load dashboard' }, { status: 500 })
  }
}


