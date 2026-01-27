-- Create product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    review_text TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reviews
CREATE POLICY "Anyone can read reviews"
    ON product_reviews
    FOR SELECT
    USING (true);

-- Allow authenticated users to create reviews
CREATE POLICY "Authenticated users can create reviews"
    ON product_reviews
    FOR INSERT
    TO authenticated WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own reviews
CREATE POLICY "Users can update their own reviews"
    ON product_reviews
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own reviews
CREATE POLICY "Users can delete their own reviews"
    ON product_reviews
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER product_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_reviews_updated_at();

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Create index for wishlist
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON wishlist_items(product_id);

-- Enable RLS for wishlist
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users can read their own wishlist
CREATE POLICY "Users can read own wishlist"
    ON wishlist_items
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can add to their wishlist
CREATE POLICY "Users can add to wishlist"
    ON wishlist_items
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can remove from their wishlist
CREATE POLICY "Users can remove from wishlist"
    ON wishlist_items
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
