-- Adicionar tabela de favoritos ao Supabase
-- Execute este SQL no Supabase SQL Editor

-- Create wishlist table
CREATE TABLE wishlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cliente_id, produto_id)
);

-- Create indexes for better performance
CREATE INDEX idx_wishlist_cliente_id ON wishlist(cliente_id);
CREATE INDEX idx_wishlist_produto_id ON wishlist(produto_id);

-- Enable Row Level Security (RLS)
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Wishlist: Users can only manage their own wishlist
CREATE POLICY "Customers can view own wishlist" ON wishlist FOR SELECT USING (
    cliente_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);
CREATE POLICY "Customers can add to own wishlist" ON wishlist FOR INSERT WITH CHECK (
    cliente_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);
CREATE POLICY "Customers can remove from own wishlist" ON wishlist FOR DELETE USING (
    cliente_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);
