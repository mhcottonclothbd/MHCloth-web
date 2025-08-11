# Database Setup Instructions

## Problem
The application is showing the error: `Could not find the table 'public.products' in the schema cache`

This means the database tables haven't been created yet.

## Solution

### Step 1: Set up the Database Schema

You have two options:

#### Option A: Manual Setup (Recommended)
1. Go to your Supabase project dashboard:
   https://supabase.com/dashboard/project/zziwsyhoxfutetnrfnwu
2. Navigate to **SQL Editor** (in the left sidebar)
3. Copy the SQL content from `scripts/setup-database.sql`
4. Paste it into the SQL editor
5. Click **"Run"** to execute the SQL

#### Option B: Use Supabase CLI
1. Initialize Supabase in this project: `supabase init`
2. Link to your project: `supabase link --project-ref zziwsyhoxfutetnrfnwu`
3. Apply the schema: `supabase db push`

### Step 2: Add Sample Data (Optional)

After setting up the schema, you can add sample products:

```bash
node scripts/add-sample-data.js
```

This will add 8 sample products to test the application.

### Step 3: Test the Setup

Run the test script to verify everything is working:

```bash
node scripts/apply-schema.js
```

This will show you the SQL content and instructions.

## What the Setup Creates

The database setup script creates:

- **products** table - Main product catalog
- **categories** table - Product categories (Men's, Women's, Kids')
- **subcategories** table - Subcategories (T-Shirts, Shirts, etc.)
- **orders** table - Customer orders
- **order_items** table - Individual items in orders
- Indexes for better performance
- Triggers for automatic timestamp updates
- Sample categories and subcategories

## Troubleshooting

If you encounter issues:

1. **Check environment variables**: Make sure `.env.local` has the correct Supabase credentials
2. **Verify connection**: Run `node scripts/apply-schema.js` to test the connection
3. **Check Supabase dashboard**: Ensure your project is active and accessible
4. **Review SQL errors**: If SQL execution fails, check the error messages in the Supabase dashboard

## Next Steps

After successful setup:
1. Your application should load products without errors
2. You can add real products through the admin interface
3. The e-commerce functionality should work properly
