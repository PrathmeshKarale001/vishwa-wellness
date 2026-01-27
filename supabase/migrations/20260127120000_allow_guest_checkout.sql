-- Migration: Allow guest checkout orders
-- This migration adds RLS policies that allow orders with null user_id (guest orders)

-- Drop existing insert policy for orders
DROP POLICY IF EXISTS "Authenticated users can create orders" ON orders;

-- Create new policy that allows both authenticated and guest orders
-- For authenticated users: user_id must match auth.uid()
-- For guests: user_id must be NULL (no auth.uid() present)
CREATE POLICY "Allow order creation"
  ON orders FOR INSERT
  WITH CHECK (
    -- Either authenticated user creating their own order
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR
    -- Or guest checkout (no user_id)
    (auth.uid() IS NULL AND user_id IS NULL)
    OR
    -- Or authenticated user doing guest checkout (rare but valid)
    (user_id IS NULL)
  );

-- Also allow guests to view their orders by order_number (for confirmation page)
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view orders"
  ON orders FOR SELECT
  USING (
    -- Authenticated users can see their own orders
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR
    -- Allow service role to access all (for API endpoints)
    (auth.jwt() ->> 'role' = 'service_role')
  );

-- Update order_items policy to allow inserts for guest orders
DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;
CREATE POLICY "Allow order items insertion"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (
        -- User's own order
        orders.user_id = auth.uid()
        OR
        -- Guest order (no user_id)
        orders.user_id IS NULL
      )
    )
  );

-- Update select policy for order_items
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Allow viewing order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND (
        orders.user_id = auth.uid()
        OR
        (auth.jwt() ->> 'role' = 'service_role')
      )
    )
  );
