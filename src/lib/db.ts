import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const pool = getPool();
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Product types
export interface Product {
  id: string;
  title: string;
  description: string;
  what_you_get: string[];
  cover_image_url: string;
  price: number;
  file_url: string | null;
  file_type: string | null;
  auto_delivery: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: string;
  product_id: string;
  buyer_email: string;
  buyer_name: string | null;
  buyer_phone: string | null;
  amount: number;
  currency: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  payment_status: 'pending' | 'success' | 'failed';
  download_token: string;
  download_count: number;
  download_expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: Date;
}
