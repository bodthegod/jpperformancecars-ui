-- Add quantity column to parts table
-- This script adds inventory management capability to track stock levels

-- Check if quantity column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'parts' 
        AND column_name = 'quantity'
    ) THEN
        ALTER TABLE parts ADD COLUMN quantity INTEGER DEFAULT 0;
        
        -- Update existing parts to have quantity 1 if they are in_stock
        UPDATE parts 
        SET quantity = 1 
        WHERE availability = 'in_stock' AND quantity = 0;
        
        -- Set quantity 0 for out_of_stock items
        UPDATE parts 
        SET quantity = 0 
        WHERE availability = 'out_of_stock';
        
        RAISE NOTICE 'Quantity column added to parts table';
    ELSE
        RAISE NOTICE 'Quantity column already exists in parts table';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'parts' 
AND column_name = 'quantity'
ORDER BY column_name; 