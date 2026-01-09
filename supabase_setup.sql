-- Create a table for orders
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  commune TEXT NOT NULL,
  address TEXT NOT NULL,
  delivery_type TEXT NOT NULL, -- 'home' or 'office'
  product_price NUMERIC NOT NULL,
  delivery_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' -- 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert orders (customers)
CREATE POLICY "Allow public inserts" ON orders FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to read/update (admin)
CREATE POLICY "Allow auth select" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
