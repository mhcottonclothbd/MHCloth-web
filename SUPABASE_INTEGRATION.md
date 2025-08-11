# Supabase Integration Setup Guide

This guide will help you set up the complete product upload & display system with Supabase integration.

## Prerequisites

1. A Supabase account (free tier available)
2. Node.js 18+ installed
3. Next.js project set up

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project
3. Note down your project URL and API keys

## Step 2: Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Next.js
NEXT_TELEMETRY_DISABLED=1
```

## Step 3: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Apply the migration (already automated via MCP): products, product_images, indexes, RLS, and `is_admin()`.
4. Ensure policies match:

```sql
-- Products
CREATE POLICY "Public can read active products" ON public.products FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Product images
CREATE POLICY "Public can read product images" ON public.product_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.products pr WHERE pr.id = product_images.product_id AND pr.status = 'active')
);
CREATE POLICY "Admins can manage product images" ON public.product_images FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
```

## Step 4: Configure Storage

1. In your Supabase dashboard, go to Storage
2. Create a new bucket called `product-images`
3. Set the bucket to public
4. Configure the following storage policies:

```sql
CREATE POLICY "Public can read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins can manage product images" ON storage.objects FOR ALL USING (public.is_admin() AND bucket_id = 'product-images') WITH CHECK (public.is_admin() AND bucket_id = 'product-images');
```

## Step 5: Install Dependencies

```bash
npm install @supabase/supabase-js zod
```

## Step 6: Test the Integration

1. Start your development server:

```bash
npm run dev
```

2. Create a local admin session cookie (dev only):

```bash
curl -X POST http://localhost:3000/api/admin/sessions -H 'Content-Type: application/json' -d '{"token":"dev"}'
```

3. Navigate to `/admin/products` to access product management
4. Try creating a new product with images
5. Check that products appear on the shop page

## Features Implemented

### ✅ Database Schema

- Products table with comprehensive fields
- Categories and subcategories tables
- Orders and order items tables
- Proper indexing for performance
- Full-text search capabilities

### ✅ API Routes

- `POST /api/products` - Create products with image upload
- `GET /api/products` - Fetch products with filtering
- `PUT /api/products/[id]` - Update products
- `DELETE /api/products/[id]` - Delete products
- `DELETE /api/products/bulk` - Bulk operations

### ✅ Image Upload

- Drag & drop image upload
- Multiple image support (up to 5 images)
- Automatic upload to Supabase Storage
- Image optimization and CDN integration
- Automatic cleanup on product deletion

### ✅ Product Management

- Enhanced admin dashboard
- Real-time form validation
- Bulk operations (delete, update status)
- Product search and filtering
- Inventory management

### ✅ Product Display

- Responsive product grid
- Product cards with pricing and badges
- Category-based filtering
- Search functionality
- Wishlist and cart integration

### ✅ Real-time Updates

- Products automatically appear on website
- No manual refresh required
- Optimized loading states

## File Structure

```
├── app/
│   ├── api/
│   │   └── products/
│   │       ├── route.ts              # Main products API
│   │       ├── [id]/route.ts         # Individual product API
│   │       └── bulk/route.ts         # Bulk operations API
│   ├── admin/
│   │   └── components/
│   │       └── ProductManagement.tsx # Enhanced admin interface
│   └── shop/
│       └── page.tsx                  # Updated shop page
├── components/
│   ├── ProductCard.tsx               # Product display card
│   ├── ProductGrid.tsx               # Product grid component
│   ├── ProductFilters.tsx            # Filtering component
│   ├── ProductSearch.tsx             # Search component
│   └── ShopHero.tsx                  # Shop hero section
├── lib/
│   ├── supabase.ts                   # Supabase client configuration
│   └── services/
│       └── product-service.ts        # Product service layer
├── scripts/
│   └── setup-database.sql            # Database schema
└── types/
    └── index.ts                      # TypeScript types
```

## Usage Examples

### Creating a Product

```typescript
import { createProduct } from "@/lib/services/product-service";

const formData = new FormData();
formData.append("name", "Premium T-Shirt");
formData.append("description", "High-quality cotton t-shirt");
formData.append("price", "29.99");
formData.append("category", "mens");
// Add images
formData.append("images", imageFile);

const result = await createProduct(formData);
```

### Fetching Products

```typescript
import { fetchProducts } from "@/lib/services/product-service";

// Get all products
const allProducts = await fetchProducts();

// Get featured products
const featuredProducts = await fetchProducts({ is_featured: true });

// Get products by category
const mensProducts = await fetchProducts({ category: "mens" });
```

### Using Product Components

```tsx
import { ProductGrid } from '@/components/ProductGrid';

// Display featured products
<ProductGrid filters={{ is_featured: true }} />

// Display products with custom filters
<ProductGrid
  filters={{
    category: 'mens',
    min_price: 20,
    max_price: 100
  }}
/>
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**

   - Ensure `.env.local` is in the project root
   - Restart the development server after adding variables

2. **Image Upload Fails**

   - Check Supabase Storage bucket permissions
   - Verify storage policies are correctly set
   - Check file size limits (default 5MB)

3. **Database Connection Issues**

   - Verify Supabase URL and keys are correct
   - Check if database schema is properly set up
   - Ensure RLS policies allow necessary operations

4. **Products Not Appearing**
   - Check product status (should be 'active')
   - Verify category and subcategory relationships
   - Check for any validation errors in the console

### Performance Optimization

1. **Image Optimization**

   - Images are automatically optimized by Supabase
   - Consider implementing lazy loading for large grids
   - Use appropriate image formats (WebP for better compression)

2. **Database Performance**

   - Indexes are automatically created for common queries
   - Use pagination for large product lists
   - Implement caching for frequently accessed data

3. **API Optimization**
   - Use bulk operations for multiple products
   - Implement proper error handling
   - Add request rate limiting if needed

## Security Considerations

1. **API Security**

   - Service role key should only be used server-side
   - Implement proper validation for all inputs
   - Use RLS policies for data access control

2. **Image Security**

   - Validate file types and sizes
   - Implement virus scanning if needed
   - Use secure URLs for image access

3. **Data Protection**
   - Encrypt sensitive data
   - Implement proper backup strategies
   - Follow GDPR compliance if applicable

## Next Steps

1. **Authentication Integration**

   - Add user authentication for admin access
   - Implement role-based access control
   - Add user-specific features (wishlist, orders)

2. **Advanced Features**

   - Product reviews and ratings
   - Advanced search with filters
   - Product recommendations
   - Inventory tracking
   - Order management system

3. **Performance Enhancements**
   - Implement caching strategies
   - Add CDN for global image delivery
   - Optimize database queries
   - Add real-time notifications

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify Supabase dashboard for any issues
3. Check the network tab for failed API requests
4. Review the database logs in Supabase

For additional help, refer to:

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
