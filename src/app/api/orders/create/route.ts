import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createRazorpayOrder } from '@/lib/razorpay';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, buyerEmail, buyerName, buyerPhone } = body;

    if (!productId || !buyerEmail || !buyerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get product details
    const productResult = await query(
      'SELECT * FROM products WHERE id = $1 AND is_active = true',
      [productId]
    );

    if (productResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = productResult.rows[0];
    const amountInPaise = Math.round(product.price * 100);

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        productId: product.id,
        productTitle: product.title,
        buyerEmail,
      },
    });

    // Calculate download expiry
    const expiryHours = parseInt(process.env.DOWNLOAD_LINK_EXPIRY_HOURS || '48');
    const downloadExpiresAt = new Date();
    downloadExpiresAt.setHours(downloadExpiresAt.getHours() + expiryHours);

    // Create order in database
    const orderResult = await query(
      `INSERT INTO orders (
        product_id, buyer_email, buyer_name, buyer_phone,
        amount, currency, razorpay_order_id,
        payment_status, download_expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`,
      [
        productId,
        buyerEmail,
        buyerName,
        buyerPhone || null,
        product.price,
        'INR',
        razorpayOrder.id,
        'pending',
        downloadExpiresAt,
      ]
    );

    return NextResponse.json({
      orderId: orderResult.rows[0].id,
      razorpayOrderId: razorpayOrder.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: 'INR',
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
