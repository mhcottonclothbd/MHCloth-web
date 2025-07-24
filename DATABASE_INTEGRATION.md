# Dashboard Database Integration Guide

This document explains how the dashboard has been configured to work with dynamic data from a database and how to integrate it with your preferred database solution.

## Current Implementation

The dashboard now supports:
- **Dynamic order data** from database queries
- **Empty states** for new users with no orders
- **Real-time statistics** calculated from user order history
- **Type-safe interfaces** for all data structures

## File Structure

```
app/dashboard/
├── page.tsx                    # Server component that fetches data
├── widget/
│   └── DashboardContent.tsx    # Client component that displays data
lib/
└── database.ts                 # Database utility functions
```

## Key Features

### 1. Empty State for New Users
- New users see a clean dashboard with zero stats
- "No orders yet" message with call-to-action to start shopping
- All statistics show 0 values appropriately

### 2. Dynamic Order Display
- Recent orders section shows actual user order history
- Orders are sorted by date (most recent first)
- Status badges with appropriate colors
- Proper date formatting

### 3. Calculated Statistics
- **Total Orders**: Count of all user orders
- **Total Spent**: Sum of all order totals
- **Active Orders**: Orders with 'processing' or 'shipped' status
- **Loyalty Points**: Calculated based on spending (customizable logic)

## Database Integration Steps

### Option 1: Using Prisma (Recommended)

1. **Install Prisma**:
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

2. **Define Order Schema** (`prisma/schema.prisma`):
   ```prisma
   model Order {
     id          String   @id @default(cuid())
     orderNumber String   @unique
     userId      String
     status      OrderStatus
     total       Float
     items       Int
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   
   enum OrderStatus {
     PROCESSING
     SHIPPED
     DELIVERED
     CANCELLED
   }
   ```

3. **Update Database Functions** (`lib/database.ts`):
   ```typescript
   import { PrismaClient } from '@prisma/client'
   
   const prisma = new PrismaClient()
   
   export async function getUserOrders(userId: string): Promise<Order[]> {
     const orders = await prisma.order.findMany({
       where: { userId },
       orderBy: { createdAt: 'desc' }
     })
     
     return orders.map(order => ({
       id: order.id,
       orderNumber: order.orderNumber,
       date: order.createdAt.toISOString(),
       status: order.status.toLowerCase(),
       total: order.total,
       items: order.items,
       createdAt: order.createdAt.toISOString(),
       userId: order.userId
     }))
   }
   ```

### Option 2: Using MongoDB

1. **Install MongoDB Driver**:
   ```bash
   npm install mongodb
   ```

2. **Update Database Functions**:
   ```typescript
   import { MongoClient } from 'mongodb'
   
   const client = new MongoClient(process.env.MONGODB_URI!)
   
   export async function getUserOrders(userId: string): Promise<Order[]> {
     await client.connect()
     const db = client.db('your-database-name')
     const orders = await db.collection('orders')
       .find({ userId })
       .sort({ createdAt: -1 })
       .toArray()
     
     return orders
   }
   ```

### Option 3: Using Supabase

1. **Install Supabase Client**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Update Database Functions**:
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   
   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   )
   
   export async function getUserOrders(userId: string): Promise<Order[]> {
     const { data: orders } = await supabase
       .from('orders')
       .select('*')
       .eq('user_id', userId)
       .order('created_at', { ascending: false })
     
     return orders || []
   }
   ```

## Environment Variables

Add these to your `.env.local` file:

```env
# Database Configuration
DATABASE_URL="your-database-connection-string"

# For Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# For MongoDB
MONGODB_URI="your-mongodb-connection-string"
```

## Customization Options

### Loyalty Points Calculation
Modify the `calculateDashboardStats` function in `lib/database.ts`:

```typescript
export function calculateDashboardStats(orders: Order[]): DashboardStats {
  // Custom loyalty points logic
  const basePoints = Math.floor(totalSpent) // 1 point per dollar
  const tierBonus = totalOrders >= 20 ? 1000 : totalOrders >= 10 ? 500 : 0
  const loyaltyPoints = basePoints + tierBonus
  
  return { /* ... */ }
}
```

### Order Status Mapping
Customize status display in `DashboardContent.tsx`:

```typescript
status={order.status === 'shipped' ? 'In Transit' : 
       order.status === 'delivered' ? 'Delivered' :
       order.status === 'processing' ? 'Processing' : 'Cancelled'}
```

## Testing

1. **New User Experience**: Sign up with a new account to see empty dashboard
2. **Existing User**: Add sample orders to database to test populated dashboard
3. **Error Handling**: Test with database connection issues

## Performance Considerations

- **Caching**: Consider implementing Redis caching for frequently accessed data
- **Pagination**: For users with many orders, implement pagination
- **Indexing**: Ensure database indexes on `userId` and `createdAt` fields
- **Loading States**: Add loading skeletons for better UX

## Next Steps

1. Choose and implement your preferred database solution
2. Create order management API endpoints
3. Add order creation functionality to your checkout process
4. Implement order status updates
5. Add more detailed order views
6. Consider adding order filtering and search functionality

## Support

For questions about the dashboard implementation, refer to:
- `app/dashboard/page.tsx` - Server-side data fetching
- `app/dashboard/widget/DashboardContent.tsx` - Client-side rendering
- `lib/database.ts` - Database utility functions