# Database Schema Update for Image Support

## Issue

The parts management system now includes image upload functionality, but the database `parts` table doesn't have the required columns.

## Required Database Changes

### Add Image Columns to Parts Table

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Add images column (array of image URLs)
ALTER TABLE parts
ADD COLUMN images TEXT[] DEFAULT '{}';

-- Add primary image index column
ALTER TABLE parts
ADD COLUMN primary_image_index INTEGER DEFAULT 0;

-- Add optional columns for better part management
ALTER TABLE parts
ADD COLUMN part_number TEXT,
ADD COLUMN condition TEXT DEFAULT 'new' CHECK (condition IN ('new', 'used', 'refurbished')),
ADD COLUMN fitment_notes TEXT,
ADD COLUMN year_range TEXT,
ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for faster image queries
CREATE INDEX idx_parts_images ON parts USING GIN(images);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_parts_updated_at
    BEFORE UPDATE ON parts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Enable Row Level Security (RLS) for Images

```sql
-- Enable RLS if not already enabled
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to parts (for customers)
CREATE POLICY "Allow public read access to parts" ON parts
    FOR SELECT USING (true);

-- Allow admin write access (you'll need to adjust this based on your auth setup)
CREATE POLICY "Allow admin write access to parts" ON parts
    FOR ALL USING (
        -- Replace this condition with your admin check
        auth.role() = 'admin' OR
        EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
    );
```

## After Database Update

Once you've run the SQL commands above, uncomment these lines in `SimpleAdminDashboard.tsx` (around line 274-275):

```typescript
// In the partData object:
images: form.images,
primary_image_index: form.primary_image_index,
```

**IMPORTANT**: The image upload functionality has been updated to use Supabase Storage. Images will now be uploaded to your `part-images` bucket and the URLs will be stored in the database.

## Image Storage Setup (REQUIRED - Fix for RLS Policy Error)

**IMPORTANT**: If you're getting "new row violates row-level security policy" error, you need these storage policies:

```sql
-- Create a bucket for part images (if not already created)
INSERT INTO storage.buckets (id, name, public)
VALUES ('part-images', 'part-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to part images
CREATE POLICY "Public read access to part images" ON storage.objects
    FOR SELECT USING (bucket_id = 'part-images');

-- Allow authenticated users to upload images (TEMPORARY - for testing)
CREATE POLICY "Allow authenticated uploads to part images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'part-images' AND
        auth.role() = 'authenticated'
    );

-- Allow authenticated users to delete their uploads
CREATE POLICY "Allow authenticated delete of part images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'part-images' AND
        auth.role() = 'authenticated'
    );

-- For production, replace the above with admin-only policies:
-- CREATE POLICY "Admin upload access to part images" ON storage.objects
--     FOR INSERT WITH CHECK (
--         bucket_id = 'part-images' AND
--         EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
--     );
```

**Note**: The above policies allow any authenticated user to upload. For production, you should restrict this to admin users only.

## Current Status

✅ **UI Components**: Image upload and display components are ready  
✅ **Form Integration**: Admin dashboard form includes image upload  
✅ **Supabase Storage Integration**: Images now upload to Supabase Storage bucket  
✅ **Image Management**: Upload, delete, and primary image selection all work with storage  
⏳ **Database Schema**: Needs the SQL updates above to persist image URLs  
✅ **Image Storage**: Using Supabase Storage with public URLs

## Next Steps

1. **Run the SQL commands** above in Supabase to add image columns
2. **Uncomment the image fields** in the save operation in `SimpleAdminDashboard.tsx`
3. **Test the complete image workflow**: Upload → Storage → Database → Display

The image upload now works with Supabase Storage! Images are uploaded to your `part-images` bucket and will persist. You just need to update the database schema to save the URLs to the parts table.

## Troubleshooting Upload Issues

### "new row violates row-level security policy" Error

This means your storage bucket doesn't have the right policies. Run the SQL commands in the "Image Storage Setup" section above.

### Check Your Storage Setup

1. **Bucket exists**: Go to Supabase Dashboard → Storage → Check if `part-images` bucket exists
2. **Bucket is public**: The bucket should be marked as public for image URLs to work
3. **Policies exist**: Go to Storage → Policies → Check if upload/delete policies are created
4. **User is authenticated**: Make sure you're logged in as an admin user

### Alternative: Disable RLS (NOT RECOMMENDED for production)

If you want to quickly test without policies (NOT for production):

```sql
-- TEMPORARY: Disable RLS on storage.objects (NOT for production!)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```
