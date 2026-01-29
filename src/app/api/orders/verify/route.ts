import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { sendDownloadEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update order status
    const updateResult = await query(
      `UPDATE orders 
       SET payment_status = 'success',
           razorpay_payment_id = $1,
           razorpay_signature = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND razorpay_order_id = $4
       RETURNING *`,
      [razorpayPaymentId, razorpaySignature, orderId, razorpayOrderId]
    );

    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = updateResult.rows[0];

    // Get product details
    const productResult = await query(
      'SELECT * FROM products WHERE id = $1',
      [order.product_id]
    );

    const product = productResult.rows[0];

    // Send download email (optional - won't fail if email service is not configured)
    if (product.auto_delivery) {
      try {
        const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/download/${order.download_token}`;
        await sendDownloadEmail({
          to: order.buyer_email,
          productTitle: product.title,
          downloadUrl,
          buyerName: order.buyer_name,
        });
      } catch (emailError) {
        console.error('Email sending failed (non-critical):', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      downloadToken: order.download_token,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
