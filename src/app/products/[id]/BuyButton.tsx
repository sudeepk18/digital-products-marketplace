'use client';

import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BuyButtonProps {
  productId: string;
  price: number;
  title: string;
}

export default function BuyButton({ productId, price, title }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleBuyClick = () => {
    setShowForm(true);
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buyerEmail || !buyerName) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create order on backend
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          buyerEmail,
          buyerName,
          buyerPhone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: orderData.razorpayKeyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'DigitalStore',
          description: title,
          order_id: orderData.razorpayOrderId,
          prefill: {
            name: buyerName,
            email: buyerEmail,
            contact: buyerPhone,
          },
          theme: {
            color: '#6366f1',
          },
          handler: async function (response: any) {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/orders/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              const result = await verifyResponse.json();
              // Redirect to success page with download link
              window.location.href = `/download/${result.downloadToken}`;
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
      };

      script.onerror = () => {
        alert('Failed to load payment gateway. Please try again.');
        setLoading(false);
      };
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={handleBuyClick}
        className="w-full py-4 bg-white text-indigo-600 font-bold text-lg rounded-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
      >
        Buy Now
      </button>
    );
  }

  return (
    <form onSubmit={handlePurchase} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Your Name *"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white/50 transition-colors"
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Your Email *"
          value={buyerEmail}
          onChange={(e) => setBuyerEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white/50 transition-colors"
        />
      </div>
      <div>
        <input
          type="tel"
          placeholder="Phone Number (optional)"
          value={buyerPhone}
          onChange={(e) => setBuyerPhone(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-white/50 transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-white text-indigo-600 font-bold text-lg rounded-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          'Proceed to Payment'
        )}
      </button>
      <button
        type="button"
        onClick={() => setShowForm(false)}
        className="w-full py-2 text-white/70 hover:text-white text-sm transition-colors"
      >
        Cancel
      </button>
    </form>
  );
}
