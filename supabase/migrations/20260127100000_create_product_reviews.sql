-- Product Reviews Table Migration
-- This table stores product reviews submitted by customers

CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    pros TEXT[] DEFAULT '{}',
    cons TEXT[] DEFAULT '{}',
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    user_name TEXT,
    user_avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster product lookups
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);

-- Enable Row Level Security
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read reviews
CREATE POLICY "Reviews are viewable by everyone" ON product_reviews
    FOR SELECT USING (true);

-- Policy: Authenticated users can insert their own reviews
CREATE POLICY "Users can insert their own reviews" ON product_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON product_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" ON product_reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Function to update average rating on products (if you have a products table)
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- This function can be extended to update a cached rating on the product
    -- For now, we just update the updated_at timestamp
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp on review update
CREATE TRIGGER update_product_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_rating();

-- Grant permissions
GRANT ALL ON product_reviews TO authenticated;
GRANT SELECT ON product_reviews TO anon;
