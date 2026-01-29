import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { verifyAuth } from '@/lib/auth';
import { query, Product } from '@/lib/db';
import ProductsManager from './ProductsManager';

async function getProducts(): Promise<Product[]> {
  try {
    const result = await query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function AdminPage() {
  const auth = await verifyAuth();
  
  if (!auth) {
    redirect('/admin/login');
  }

  const products = await getProducts();

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
            <p className="text-gray-600">Manage your digital products</p>
          </div>

          <ProductsManager initialProducts={products} />
        </div>
      </main>
    </>
  );
}
