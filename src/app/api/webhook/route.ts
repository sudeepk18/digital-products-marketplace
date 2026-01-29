export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { sendDownloadEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    console.log('Webhook received:', event);

    // Handle payment events
    switch (event) {
      case 'payment.captured':
      case 'payment.authorized': {
        const payment = payload.payload.payment.entity;
        const orderId = payment.order_id;
        const paymentId = payment.id;

        // Update order status
        const updateResult = await query(
          `UPDATE orders 
           SET payment_status = 'success',
               razorpay_payment_id = $1,
               updated_at = CURRENT_TIMESTAMP
           WHERE razorpay_order_id = $2
           RETURNING *`,
          [paymentId, orderId]
        );

        if (updateResult.rows.length > 0) {
          const order = updateResult.rows[0];

          // Get product details
          const productResult = await query(
            'SELECT * FROM products WHERE id = $1',
            [order.product_id]
          );

          const product = productResult.rows[0];

          // Send download email if auto-delivery is enabled
          if (product.auto_delivery) {
            try {
              const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/download/${order.download_token}`;
              await sendDownloadEmail({
                to: order.buyer_email,
                productTitle: product.title,
                downloadUrl,
                buyerName: order.buyer_name,
              });
              console.log('Download email sent for order:', order.id);
            } catch (emailError) {
              console.error('Email sending failed (non-critical):', emailError);
            }
          }
        }

        break;
      }

      case 'payment.failed': {
        const payment = payload.payload.payment.entity;
        const orderId = payment.order_id;

        await query(
          `UPDATE orders 
           SET payment_status = 'failed',
               updated_at = CURRENT_TIMESTAMP
           WHERE razorpay_order_id = $1`,
          [orderId]
        );

        console.log('Payment failed for order:', orderId);
        break;
      }

      default:
        console.log('Unhandled webhook event:', event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhook signature verification
