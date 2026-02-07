-- RedVelvet E-commerce Database Schema
-- Execute este SQL no Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    referencia VARCHAR(100) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    tamanhos TEXT[], -- Array de tamanhos disponíveis
    imagem_url TEXT,
    iva DECIMAL(5,2) DEFAULT 23.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    morada TEXT,
    codigo_postal VARCHAR(10),
    cidade VARCHAR(100),
    pais VARCHAR(100) DEFAULT 'Portugal',
    historico_compras UUID[], -- Array de order IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    numero_pedido VARCHAR(50) UNIQUE NOT NULL,
    lista_produtos JSONB NOT NULL, -- Array de produtos com quantidade
    subtotal DECIMAL(10,2) NOT NULL,
    custo_envio DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    metodo_pagamento VARCHAR(50),
    endereco_envio JSONB,
    data_pagamento TIMESTAMP WITH TIME ZONE,
    data_envio TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comentario TEXT,
    aprovado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cliente_id, produto_id)
);

-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT,
    imagem_url TEXT,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wishlist table
CREATE TABLE wishlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cliente_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    produto_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cliente_id, produto_id)
);

-- Insert default categories
INSERT INTO categories (nome, slug, descricao, ordem) VALUES
('Decoração', 'decoracao', 'Elementos únicos para decorar o seu espaço', 1),
('Velas', 'velas', 'Velas aromáticas e decorativas', 2),
('Roupa', 'roupa', 'Peças elegantes e exclusivas', 3);

-- Insert sample products
INSERT INTO products (codigo, referencia, nome, descricao, categoria, preco, stock, tamanhos, imagem_url, iva) VALUES
('V001', 'VL-LAV-001', 'Vela Aromática Lavanda', 'Vela artesanal com aroma relaxante de lavanda, perfeita para criar um ambiente acolhedor.', 'Velas', 24.90, 100, NULL, '/images/vela-lavanda.jpg', 23.00),
('D001', 'DE-CAN-001', 'Candeeiro Minimalista', 'Candeeiro de design minimalista em madeira e metal, ideal para qualquer espaço.', 'Decoração', 89.90, 50, NULL, '/images/candeeiro-minimalista.jpg', 23.00),
('R001', 'RO-BLU-001', 'Blusa Elegante', 'Blusa em seda natural com corte elegante, disponível em várias cores.', 'Roupa', 129.90, 75, ARRAY['S', 'M', 'L', 'XL'], '/images/blusa-elegante.jpg', 23.00),
('V002', 'VL-ROS-002', 'Vela Aromática Rosas', 'Vela com aroma suave de rosas, ideal para um ambiente romântico.', 'Velas', 29.90, 80, NULL, '/images/vela-rosas.jpg', 23.00),
('D002', 'DE-VAS-002', 'Vaso Decorativo Cerâmica', 'Vaso de cerâmica feito à mão, perfeito para flores ou como peça decorativa.', 'Decoração', 45.00, 60, NULL, '/images/vaso-ceramica.jpg', 23.00),
('R002', 'RO-CAL-002', 'Calças de Linho', 'Calças confortáveis em linho, ideais para o verão.', 'Roupa', 79.90, 90, ARRAY['S', 'M', 'L'], '/images/calcas-linho.jpg', 23.00);

-- Create indexes for better performance
CREATE INDEX idx_products_categoria ON products(categoria);
CREATE INDEX idx_products_preco ON products(preco);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_orders_cliente_id ON orders(cliente_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_reviews_produto_id ON reviews(produto_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_wishlist_cliente_id ON wishlist(cliente_id);
CREATE INDEX idx_wishlist_produto_id ON wishlist(produto_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Products: Everyone can read, only authenticated users can modify
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products are editable by authenticated users" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Customers: Users can only see their own data
CREATE POLICY "Customers can view own profile" ON customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers can update own profile" ON customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Customers can insert own profile" ON customers FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Orders: Users can only see their own orders
CREATE POLICY "Customers can view own orders" ON orders FOR SELECT USING (
    cliente_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);
CREATE POLICY "Customers can create own orders" ON orders FOR INSERT WITH CHECK (
    cliente_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

-- Reviews: Users can only see and create their own reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create own reviews" ON reviews FOR INSERT WITH CHECK (
    cliente_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);
CREATE POLICY "Customers can update own reviews" ON reviews FOR UPDATE USING (
    cliente_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);

-- Categories: Everyone can read
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Categories are editable by authenticated users" ON categories FOR ALL USING (auth.role() = 'authenticated');

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