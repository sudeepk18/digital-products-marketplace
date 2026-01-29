import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { query, Product } from '@/lib/db';
import BuyButton from './BuyButton';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const result = await query(
      'SELECT * FROM products WHERE id = $1 AND is_active = true',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <a
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </a>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
              <Image
                src={product.cover_image_url}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Product Details */}
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {product.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="bg-white rounded-xl p-6 shadow-soft mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  What You'll Get
                </h2>
                <ul className="space-y-3">
                  {product.what_you_get.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price and Buy Button */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-white/80 text-sm mb-1">One-time payment</p>
                    <p className="text-5xl font-bold text-white">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-white/80 text-right">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Instant delivery</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Secure payment</span>
                    </div>
                  </div>
                </div>

                <BuyButton productId={product.id} price={product.price} title={product.title} />

                <p className="text-white/70 text-xs text-center mt-4">
                  Powered by Razorpay • All major payment methods accepted
                </p>
              </div>

              {/* Additional Info */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    After successful payment, you'll receive instant access to download your product. 
                    A download link will also be sent to your email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
