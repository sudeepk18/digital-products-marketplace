-- Database Schema for Digital Products Marketplace

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    what_you_get TEXT[] NOT NULL, -- Array of bullet points
    cover_image_url TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    file_url TEXT, -- Cloudinary URL or file path
    file_type VARCHAR(50), -- pdf, zip, link
    auto_delivery BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    buyer_email VARCHAR(255) NOT NULL,
    buyer_name VARCHAR(255),
    buyer_phone VARCHAR(20),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(500),
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, success, failed
    download_token UUID DEFAULT uuid_generate_v4(),
    download_count INTEGER DEFAULT 0,
    download_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX idx_orders_download_token ON orders(download_token);
CREATE INDEX idx_orders_buyer_email ON orders(buyer_email);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample admin user (password: admin123)
-- You should change this password immediately after first login
INSERT INTO admin_users (email, password_hash, name)
VALUES ('kharvisudi@gmail.com', '$2a$10$8bndFA1EcYA3.ENwaoXWpuALEodcVVBJjqVgMOxJPMF5cwReLK/wG', 'sudeep');

-- Note: Generate proper password hash using bcryptjs in Node.js:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('your-password', 10);
