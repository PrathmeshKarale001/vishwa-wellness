-- Migration: Enhance reviews table for admin moderation
-- This migration adds moderation columns and admin RLS policies

-- Add status column (replacing is_approved boolean approach)
DO $$ 
BEGIN
    -- Add status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' AND column_name = 'status'
    ) THEN
        ALTER TABLE reviews ADD COLUMN status TEXT DEFAULT 'pending' 
            CHECK (status IN ('pending', 'approved', 'rejected', 'flagged'));
        
        -- Migrate existing is_approved data
        UPDATE reviews SET status = 'approved' WHERE is_approved = true;
        UPDATE reviews SET status = 'pending' WHERE is_approved = false OR is_approved IS NULL;
    END IF;

    -- Add moderation_notes column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' AND column_name = 'moderation_notes'
    ) THEN
        ALTER TABLE reviews ADD COLUMN moderation_notes TEXT;
    END IF;

    -- Add moderated_by column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' AND column_name = 'moderated_by'
    ) THEN
        ALTER TABLE reviews ADD COLUMN moderated_by UUID REFERENCES auth.users(id);
    END IF;

    -- Add moderated_at column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' AND column_name = 'moderated_at'
    ) THEN
        ALTER TABLE reviews ADD COLUMN moderated_at TIMESTAMPTZ;
    END IF;

    -- Add user_name column if not exists (for display without join)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' AND column_name = 'user_name'
    ) THEN
        ALTER TABLE reviews ADD COLUMN user_name TEXT;
    END IF;
END $$;

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Drop existing policies if they exist (to recreate)
DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON reviews;

-- Admin can view ALL reviews (including pending/rejected)
CREATE POLICY "Admins can view all reviews"
    ON reviews
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role IN ('admin', 'super_admin', 'staff')
        )
    );

-- Admin can update any review (for moderation)
CREATE POLICY "Admins can update reviews"
    ON reviews
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role IN ('admin', 'super_admin')
        )
    );

-- Admin can delete reviews
CREATE POLICY "Admins can delete reviews"
    ON reviews
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role IN ('admin', 'super_admin')
        )
    );

-- Public can only view approved reviews
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON reviews;
CREATE POLICY "Anyone can read approved reviews"
    ON reviews
    FOR SELECT
    USING (status = 'approved');

-- Users can view their own reviews (any status)
DROP POLICY IF EXISTS "Users can view own reviews" ON reviews;
CREATE POLICY "Users can view own reviews"
    ON reviews
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
