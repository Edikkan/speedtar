-- Speedtar Database Initialization Script
-- PostgreSQL 15

-- Create database (run this as postgres superuser)
-- CREATE DATABASE speedtar;

-- Connect to speedtar database
\c speedtar;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar TEXT,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    compare_price DECIMAL(10, 2) CHECK (compare_price >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    images TEXT[],
    featured_image TEXT,
    sku VARCHAR(100) UNIQUE,
    weight DECIMAL(8, 2),
    dimensions JSONB,
    tags TEXT[],
    attributes JSONB,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50) NOT NULL,
    payment_id VARCHAR(255),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_cost DECIMAL(10, 2) DEFAULT 0 CHECK (shipping_cost >= 0),
    tax DECIMAL(10, 2) DEFAULT 0 CHECK (tax >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    tracking_number VARCHAR(100),
    notes TEXT,
    paid_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)
);

-- Cart table (for persistent cart)
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    items JSONB DEFAULT '[]',
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value >= 0),
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipping methods table
CREATE TABLE IF NOT EXISTS shipping_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    estimated_days INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_payment ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_methods_updated_at BEFORE UPDATE ON shipping_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: Admin@123)
-- This is a bcrypt hash of 'Admin@123'
INSERT INTO users (first_name, last_name, email, password, role, is_active)
VALUES (
    'Admin',
    'User',
    'admin@speedtar.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G',
    'admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert default shipping methods
INSERT INTO shipping_methods (name, description, price, estimated_days, is_active)
VALUES 
    ('Standard Shipping', 'Delivery within 5-7 business days', 5.99, 7, true),
    ('Express Shipping', 'Delivery within 2-3 business days', 14.99, 3, true),
    ('Free Shipping', 'Free delivery on orders over $50', 0.00, 7, true)
ON CONFLICT DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, slug, description, is_active)
VALUES 
    ('Electronics', 'electronics', 'Latest gadgets and electronic devices', true),
    ('Fashion', 'fashion', 'Clothing, shoes, and accessories', true),
    ('Home & Living', 'home-living', 'Furniture and home decor', true),
    ('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', true),
    ('Books', 'books', 'Physical and digital books', true),
    ('Health & Beauty', 'health-beauty', 'Personal care and wellness products', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories for Electronics
INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 
    'Smartphones',
    'smartphones',
    'Mobile phones and accessories',
    id,
    true
FROM categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 
    'Laptops',
    'laptops',
    'Notebooks and laptop accessories',
    id,
    true
FROM categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, is_active)
SELECT 
    'Audio',
    'audio',
    'Headphones, speakers, and audio equipment',
    id,
    true
FROM categories WHERE slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, price, compare_price, stock, category_id, images, featured_image, sku, is_featured, is_active, tags)
SELECT 
    'Wireless Bluetooth Headphones',
    'wireless-bluetooth-headphones',
    'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    79.99,
    129.99,
    50,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    'AUDIO-001',
    true,
    true,
    ARRAY['headphones', 'bluetooth', 'wireless', 'audio']
FROM categories c WHERE c.slug = 'audio'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_price, stock, category_id, images, featured_image, sku, is_featured, is_active, tags)
SELECT 
    'Smart Fitness Watch',
    'smart-fitness-watch',
    'Track your health and fitness with this advanced smartwatch featuring heart rate monitoring.',
    149.99,
    199.99,
    30,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    'ELEC-002',
    true,
    true,
    ARRAY['smartwatch', 'fitness', 'health', 'wearable']
FROM categories c WHERE c.slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, stock, category_id, images, featured_image, sku, is_active, tags)
SELECT 
    'Cotton Crew Neck T-Shirt',
    'cotton-crew-neck-tshirt',
    'Comfortable 100% cotton t-shirt available in multiple colors.',
    24.99,
    100,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    'FASH-001',
    true,
    ARRAY['tshirt', 'cotton', 'clothing', 'casual']
FROM categories c WHERE c.slug = 'fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_price, stock, category_id, images, featured_image, sku, is_featured, is_active, tags)
SELECT 
    'Modern Desk Lamp',
    'modern-desk-lamp',
    'LED desk lamp with adjustable brightness and color temperature.',
    45.99,
    59.99,
    25,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'],
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
    'HOME-001',
    true,
    true,
    ARRAY['lamp', 'lighting', 'desk', 'home']
FROM categories c WHERE c.slug = 'home-living'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, stock, category_id, images, featured_image, sku, is_active, tags)
SELECT 
    'Yoga Mat Premium',
    'yoga-mat-premium',
    'Non-slip eco-friendly yoga mat with carrying strap.',
    35.99,
    40,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'],
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    'SPORT-001',
    true,
    ARRAY['yoga', 'fitness', 'exercise', 'mat']
FROM categories c WHERE c.slug = 'sports-outdoors'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, stock, category_id, images, featured_image, sku, is_active, tags)
SELECT 
    'Bestseller Novel Collection',
    'bestseller-novel-collection',
    'Collection of 5 bestselling fiction novels.',
    49.99,
    20,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'],
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    'BOOK-001',
    true,
    ARRAY['books', 'fiction', 'bestseller', 'reading']
FROM categories c WHERE c.slug = 'books'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_price, stock, category_id, images, featured_image, sku, is_featured, is_active, tags)
SELECT 
    'Organic Skincare Set',
    'organic-skincare-set',
    'Complete skincare routine with natural organic ingredients.',
    89.99,
    120.00,
    15,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'],
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    'BEAUTY-001',
    true,
    true,
    ARRAY['skincare', 'organic', 'beauty', 'natural']
FROM categories c WHERE c.slug = 'health-beauty'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, stock, category_id, images, featured_image, sku, is_active, tags)
SELECT 
    'Running Shoes Pro',
    'running-shoes-pro',
    'Lightweight running shoes with advanced cushioning technology.',
    119.99,
    35,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    'SPORT-002',
    true,
    ARRAY['shoes', 'running', 'sports', 'footwear']
FROM categories c WHERE c.slug = 'sports-outdoors'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, stock, category_id, images, featured_image, sku, is_active, tags)
SELECT 
    'Laptop Backpack',
    'laptop-backpack',
    'Water-resistant backpack with padded laptop compartment.',
    54.99,
    60,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    'FASH-002',
    true,
    ARRAY['backpack', 'laptop', 'bag', 'travel']
FROM categories c WHERE c.slug = 'fashion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, compare_price, stock, category_id, images, featured_image, sku, is_featured, is_active, tags)
SELECT 
    'Portable Bluetooth Speaker',
    'portable-bluetooth-speaker',
    'Waterproof portable speaker with 360-degree sound.',
    59.99,
    79.99,
    45,
    c.id,
    ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'],
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
    'AUDIO-002',
    true,
    true,
    ARRAY['speaker', 'bluetooth', 'portable', 'audio']
FROM categories c WHERE c.slug = 'audio'
ON CONFLICT (slug) DO NOTHING;

-- Insert sample coupon
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, is_active, starts_at, expires_at)
VALUES (
    'WELCOME20',
    '20% off your first order',
    'percentage',
    20.00,
    50.00,
    50.00,
    1000,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '1 year'
) ON CONFLICT (code) DO NOTHING;

INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, is_active, starts_at, expires_at)
VALUES (
    'SAVE10',
    '$10 off orders over $100',
    'fixed',
    10.00,
    100.00,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '1 year'
) ON CONFLICT (code) DO NOTHING;

-- Grant privileges (adjust username as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO speedtar_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO speedtar_user;
