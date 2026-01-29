'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/db';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card group overflow-hidden animate-fade-in">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
        <Image
          src={product.cover_image_url}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
        {product.title}
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {product.description}
      </p>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold gradient-text">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
