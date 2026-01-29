import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = await verifyAuth();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await query('SELECT * FROM products ORDER BY created_at DESC');
    return NextResponse.json({ products: result.rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      what_you_get,
      cover_image_url,
      price,
      file_url,
      auto_delivery,
    } = body;

    const result = await query(
      `INSERT INTO products (
        title, description, what_you_get, cover_image_url,
        price, file_url, auto_delivery, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING *`,
      [title, description, what_you_get, cover_image_url, price, file_url, auto_delivery]
    );

    return NextResponse.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Product creation error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
