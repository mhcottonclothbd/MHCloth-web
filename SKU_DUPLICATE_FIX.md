# SKU Duplicate Issue - Fixed!

## Problem
The error `duplicate key value violates unique constraint "products_sku_key"` occurred when trying to create a product with an SKU that already exists in the database.

## Root Cause
The `products` table has a unique constraint on the `sku` field, which prevents duplicate SKUs. When you try to create a product with an existing SKU, PostgreSQL throws this error.

## Solutions Implemented

### 1. ✅ **Auto-SKU Generation Function**
Created a database function `generate_unique_sku()` that:
- Generates unique SKUs based on category prefix
- Handles existing SKUs by appending numbers
- Uses timestamp and random strings for uniqueness
- Falls back to simple generation if database function fails

### 2. ✅ **API-Level SKU Handling**
Updated the API route (`app/api/products/route.ts`) to:
- Auto-generate SKUs when none is provided
- Check for existing SKUs and generate unique alternatives
- Handle duplicate SKU errors gracefully

### 3. ✅ **Frontend Improvements**
Enhanced the product form to:
- Show better error messages for duplicate SKUs
- Add an "Auto-Generate" button for SKUs
- Provide helpful placeholder text
- Validate SKU format (optional)

### 4. ✅ **SKU Validation**
Added client-side validation:
- SKU format validation (uppercase letters, numbers, hyphens, underscores)
- Better error messages
- Auto-generation suggestions

## Current SKU Patterns

Based on the database check, here are the existing SKU patterns:

- **MENS**: `MENS-TS-001`, `MENS-FS-001`, `MENS-DJ-001`, `MS-001`
- **WOMENS**: `WOMENS-BL-001`, `WOMENS-SD-001`, `WOMENS-CP-001`
- **KIDS**: `KIDS-HD-001`, `KIDS-FT-001`

## How to Use

### Option 1: Auto-Generate SKU (Recommended)
1. Leave the SKU field empty
2. The system will automatically generate a unique SKU
3. Format: `{CATEGORY}-{TIMESTAMP}-{RANDOM}`

### Option 2: Manual SKU Entry
1. Enter a custom SKU
2. If it's duplicate, the system will auto-generate a unique version
3. Example: `MENS-TS-001` → `MENS-TS-001-1`

### Option 3: Use Auto-Generate Button
1. Click the "Auto-Generate" button next to the SKU field
2. A unique SKU will be generated immediately

## SKU Generation Rules

### Format
- **Category Prefix**: First 3 letters of category (MENS, WOMENS, KIDS)
- **Timestamp**: Current timestamp for uniqueness
- **Random String**: 6-character random string
- **Example**: `MENS-1754571225213-abc123`

### Validation
- Only uppercase letters, numbers, hyphens, and underscores allowed
- Must be unique across all products
- Cannot be empty

## Troubleshooting

### Check Existing SKUs
Run the SKU check script:
```bash
node scripts/check-skus.js
```

### Common Issues

1. **"SKU already exists" error**
   - Solution: Leave SKU empty or use Auto-Generate button
   - The system will create a unique version automatically

2. **Invalid SKU format**
   - Use only uppercase letters, numbers, hyphens, and underscores
   - Example: `MENS-TSHIRT-001` ✅
   - Example: `mens tshirt 001` ❌

3. **Empty SKU field**
   - The system will auto-generate a unique SKU
   - No action needed

## Testing

### Test Auto-Generation
1. Go to Admin Panel → Product Management
2. Click "Add Product"
3. Leave SKU field empty
4. Fill other required fields
5. Submit the form
6. Check that a unique SKU was generated

### Test Duplicate Handling
1. Try to create a product with existing SKU (e.g., `MENS-TS-001`)
2. The system should generate a unique version (e.g., `MENS-TS-001-1`)

## Database Function Details

The `generate_unique_sku()` function:
- Takes category prefix and optional base SKU
- Checks for existing SKUs in the database
- Generates unique alternatives if needed
- Uses timestamp and random strings for uniqueness
- Has fallback mechanisms for error handling

## Next Steps

1. ✅ SKU auto-generation implemented
2. ✅ Duplicate handling added
3. ✅ Frontend improvements completed
4. ✅ Error messages enhanced
5. 🚀 Ready for production use

Your application should now handle SKU duplicates gracefully and provide a smooth user experience for product creation!
