-- Add slug column to parts table for SEO-friendly URLs
-- This script adds SEO optimization capability to parts

-- Check if slug column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'parts'
        AND column_name = 'slug'
    ) THEN
        ALTER TABLE parts ADD COLUMN slug TEXT;
        
        -- Create a unique index on slug for fast lookups
        CREATE UNIQUE INDEX IF NOT EXISTS idx_parts_slug ON parts(slug);
        
        -- Generate slugs for existing parts
        UPDATE parts 
        SET slug = LOWER(
            REGEXP_REPLACE(
                REGEXP_REPLACE(
                    REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'),
                    '\s+', '-', 'g'
                ),
                '-+', '-', 'g'
            )
        )
        WHERE slug IS NULL;
        
        -- Make slug column NOT NULL after populating
        ALTER TABLE parts ALTER COLUMN slug SET NOT NULL;
        
        RAISE NOTICE 'Slug column added to parts table with existing data migrated';
    ELSE
        RAISE NOTICE 'Slug column already exists in parts table';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'parts'
AND column_name = 'slug'
ORDER BY column_name; 