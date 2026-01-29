import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export interface CreateOrderParams {
  amount: number; // in paise
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(params: CreateOrderParams) {
  try {
    const order = await razorpay.orders.create({
      amount: params.amount,
      currency: params.currency || 'INR',
      receipt: params.receipt || `receipt_${Date.now()}`,
      notes: params.notes || {},
    });
    return order;
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    throw new Error('Failed to create payment order');
  }
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

export function verifyWebhookSignature(
  webhookBody: string,
  webhookSignature: string
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(webhookBody)
    .digest('hex');
  return expectedSignature === webhookSignature;
}

export async function getPaymentDetails(paymentId: string) {
  try {
    return await razorpay.payments.fetch(paymentId);
  } catch (error) {
    console.error('Failed to fetch payment details:', error);
    throw error;
  }
}
