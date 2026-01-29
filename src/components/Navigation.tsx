'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600" />
            <span className="text-xl font-bold gradient-text">DigitalStore</span>
          </Link>

          <div className="flex items-center space-x-6">
            {isAdmin ? (
              <>
                <Link
                  href="/admin"
                  className={`font-medium transition-colors ${
                    pathname === '/admin'
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  Products
                </Link>
                <Link
                  href="/admin/orders"
                  className={`font-medium transition-colors ${
                    pathname === '/admin/orders'
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  Orders
                </Link>
                <Link
                  href="/admin/logout"
                  className="font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={`font-medium transition-colors ${
                    pathname === '/'
                      ? 'text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  Products
                </Link>
                <Link
                  href="/admin/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
