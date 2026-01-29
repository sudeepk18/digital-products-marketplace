import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { query } from '@/lib/db';
import DownloadButton from './DownloadButton';

async function getOrderByToken(token: string) {
  try {
    const result = await query(
      `SELECT o.*, p.title as product_title, p.file_url, p.file_type, p.cover_image_url
       FROM orders o
       JOIN products p ON o.product_id = p.id
       WHERE o.download_token = $1 AND o.payment_status = 'success'`,
      [token]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return null;
  }
}

export default async function DownloadPage({ params }: { params: { token: string } }) {
  const order = await getOrderByToken(params.token);

  if (!order) {
    notFound();
  }

  const maxDownloads = parseInt(process.env.MAX_DOWNLOADS_PER_ORDER || '3');
  const isExpired = order.download_expires_at && new Date(order.download_expires_at) < new Date();
  const downloadsRemaining = maxDownloads - order.download_count;
  const canDownload = !isExpired && downloadsRemaining > 0;

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-600">Thank you for your purchase</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">{order.product_title}</h2>
              <p className="text-white/80">Order ID: {order.id.slice(0, 8)}...</p>
            </div>

            <div className="p-8">
              {canDownload ? (
                <>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-green-600">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Ready to Download</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {downloadsRemaining} {downloadsRemaining === 1 ? 'download' : 'downloads'} remaining
                      </span>
                    </div>

                    <DownloadButton
                      token={params.token}
                      fileUrl={order.file_url}
                      productTitle={order.product_title}
                    />
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Download Link</p>
                        <p className="text-sm text-gray-600">
                          This link will expire on {new Date(order.download_expires_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Email Confirmation</p>
                        <p className="text-sm text-gray-600">
                          A confirmation email with the download link has been sent to <strong>{order.buyer_email}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isExpired ? 'Download Link Expired' : 'Download Limit Reached'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {isExpired
                      ? 'This download link has expired. Please contact support for assistance.'
                      : 'You have reached the maximum number of downloads for this order.'}
                  </p>
                  <a
                    href="mailto:support@example.com"
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Contact Support
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Store
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
