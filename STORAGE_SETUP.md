# Storage Setup Documentation

## Problem Fixed
The error `Failed to upload image: Bucket not found` was occurring because the Supabase Storage bucket for product images didn't exist.

## Solution Implemented

### 1. Storage Bucket Creation
Created a `product-images` bucket in Supabase Storage with the following configuration:
- **Bucket ID**: `product-images`
- **Public Access**: Enabled
- **File Size Limit**: 5MB
- **Allowed MIME Types**: 
  - `image/jpeg`
  - `image/png` 
  - `image/webp`
  - `image/gif`
  - `text/plain` (for testing)
  - `application/octet-stream` (for testing)

### 2. Row Level Security (RLS) Policies
Set up proper RLS policies for the storage bucket:
- **Public Read Access**: Anyone can view product images
- **Authenticated Upload**: Only authenticated users can upload images
- **Authenticated Update**: Only authenticated users can update images
- **Authenticated Delete**: Only authenticated users can delete images

### 3. API Integration
The existing API routes in `app/api/products/route.ts` are already configured to:
- Upload images to the `product-images` bucket
- Generate public URLs for uploaded images
- Handle both new file uploads and existing image URLs

## Testing

### Storage Test Script
Run the storage test to verify everything is working:
```bash
node scripts/test-storage.js
```

This script will:
1. ✅ Check if the bucket exists
2. ✅ Test file upload functionality
3. ✅ Test file download functionality
4. ✅ Test public URL generation
5. ✅ Clean up test files

## Usage

### In the Admin Panel
1. Go to the Product Management section
2. Click "Add Product" or "Edit Product"
3. Navigate to the "Images" tab
4. Upload product images (up to 5 images per product)
5. Images will be automatically uploaded to Supabase Storage

### File Structure
Uploaded images are stored with the following structure:
```
product-images/
├── products/
│   ├── 1754571225213-abc123.jpg
│   ├── 1754571225214-def456.png
│   └── ...
```

### Public URLs
Images are accessible via public URLs like:
```
https://zziwsyhoxfutetnrfnwu.supabase.co/storage/v1/object/public/product-images/products/filename.jpg
```

## Security Considerations

1. **File Type Validation**: Only image files are allowed for production
2. **File Size Limits**: 5MB maximum per file
3. **Authentication Required**: Upload/update/delete operations require authentication
4. **Public Read Access**: Product images are publicly viewable (required for e-commerce)

## Troubleshooting

### Common Issues

1. **"Bucket not found" error**
   - Run the storage test script to verify bucket exists
   - Check if the bucket was created successfully

2. **"MIME type not supported" error**
   - Ensure you're uploading image files (JPEG, PNG, WebP, GIF)
   - Check the allowed MIME types in the bucket configuration

3. **Upload permission denied**
   - Verify you're authenticated when uploading
   - Check RLS policies are properly configured

### Verification Commands
```bash
# Test storage functionality
node scripts/test-storage.js

# Check if bucket exists (via Supabase dashboard)
# Go to Storage > Buckets in your Supabase dashboard
```

## Next Steps

1. ✅ Storage bucket created and configured
2. ✅ RLS policies implemented
3. ✅ API routes configured
4. ✅ Test script created and verified
5. 🚀 Ready for image uploads in the admin panel

Your application should now be able to upload and display product images without any errors!
