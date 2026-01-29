import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { verifyAuth } from '@/lib/auth';
import { query } from '@/lib/db';

async function getOrders() {
  try {
    const result = await query(
      `SELECT o.*, p.title as product_title, p.price, p.cover_image_url
       FROM orders o
       JOIN products p ON o.product_id = p.id
       ORDER BY o.created_at DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export default async function OrdersPage() {
  const auth = await verifyAuth();
  
  if (!auth) {
    redirect('/admin/login');
  }

  const orders = await getOrders();

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
            <p className="text-gray-600">View and manage all orders</p>
          </div>

          <div className="bg-white rounded-xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Downloads
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    orders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">{order.product_title}</div>
                              <div className="text-gray-500 text-xs">ID: {order.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{order.buyer_name}</div>
                            <div className="text-gray-500">{order.buyer_email}</div>
                            {order.buyer_phone && (
                              <div className="text-gray-500 text-xs">{order.buyer_phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{order.amount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-gray-500">{order.currency}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.payment_status === 'success'
                                ? 'bg-green-100 text-green-800'
                                : order.payment_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                          <div className="text-xs">
                            {new Date(order.created_at).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.download_count} / {process.env.MAX_DOWNLOADS_PER_ORDER || 3}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {orders.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Total Orders: {orders.length} | 
              Successful: {orders.filter((o: any) => o.payment_status === 'success').length} | 
              Revenue: ₹{orders
                .filter((o: any) => o.payment_status === 'success')
                .reduce((sum: number, o: any) => sum + parseFloat(o.amount), 0)
                .toLocaleString('en-IN')}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
