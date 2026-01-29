import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { query, Product } from '@/lib/db';

async function getActiveProducts(): Promise<Product[]> {
  try {
    const result = await query(
      'SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
                Premium Digital Products
                <span className="block gradient-text mt-2">Delivered Instantly</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Discover high-quality digital products crafted to help you grow and succeed.
                Instant access. Secure delivery. No subscriptions.
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600">Check back soon for new digital products!</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">All Products</h2>
                <p className="text-gray-600">
                  {products.length} {products.length === 1 ? 'product' : 'products'} available
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600" />
                <span className="text-xl font-bold gradient-text">DigitalStore</span>
              </div>
              <p className="text-gray-600 mb-4">
                Premium digital products with instant delivery
              </p>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} DigitalStore. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
