-- Check and add image columns to parts table
-- Run this in your Supabase SQL Editor

-- Check if columns already exist
DO $$
BEGIN
    -- Add images column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'parts' AND column_name = 'images'
    ) THEN
        ALTER TABLE parts ADD COLUMN images TEXT[] DEFAULT '{}';
        RAISE NOTICE 'Added images column to parts table';
    ELSE
        RAISE NOTICE 'images column already exists in parts table';
    END IF;

    -- Add primary_image_index column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'parts' AND column_name = 'primary_image_index'
    ) THEN
        ALTER TABLE parts ADD COLUMN primary_image_index INTEGER DEFAULT 0;
        RAISE NOTICE 'Added primary_image_index column to parts table';
    ELSE
        RAISE NOTICE 'primary_image_index column already exists in parts table';
    END IF;
END
$$;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'parts' 
AND column_name IN ('images', 'primary_image_index')
ORDER BY column_name;