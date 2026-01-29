// 'use client';

// import { useState } from 'react';
// import { Product } from '@/lib/db';
// import Image from 'next/image';

// interface ProductsManagerProps {
//   initialProducts: Product[];
// }

// export default function ProductsManager({ initialProducts }: ProductsManagerProps) {
//   const [products, setProducts] = useState(initialProducts);
//   const [showForm, setShowForm] = useState(false);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);

//   const handleAddNew = () => {
//     setEditingProduct(null);
//     setShowForm(true);
//   };

//   const handleEdit = (product: Product) => {
//     setEditingProduct(product);
//     setShowForm(true);
//   };

//   const handleDelete = async (productId: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;

//     try {
//       const response = await fetch(`/api/admin/products/${productId}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setProducts(products.filter(p => p.id !== productId));
//       } else {
//         alert('Failed to delete product');
//       }
//     } catch (error) {
//       alert('Error deleting product');
//     }
//   };

//   const handleToggleActive = async (productId: string, currentStatus: boolean) => {
//     try {
//       const response = await fetch(`/api/admin/products/${productId}/toggle`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ is_active: !currentStatus }),
//       });

//       if (response.ok) {
//         setProducts(products.map(p => 
//           p.id === productId ? { ...p, is_active: !currentStatus } : p
//         ));
//       } else {
//         alert('Failed to update product');
//       }
//     } catch (error) {
//       alert('Error updating product');
//     }
//   };

//   return (
//     <>
//       <div className="mb-6">
//         <button
//           onClick={handleAddNew}
//           className="btn-primary"
//         >
//           + Add New Product
//         </button>
//       </div>

//       {showForm && (
//         <ProductForm
//           product={editingProduct}
//           onClose={() => setShowForm(false)}
//           onSuccess={(product) => {
//             if (editingProduct) {
//               setProducts(products.map(p => p.id === product.id ? product : p));
//             } else {
//               setProducts([product, ...products]);
//             }
//             setShowForm(false);
//           }}
//         />
//       )}

//       <div className="bg-white rounded-xl shadow-soft overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Product
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Price
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {products.map((product) => (
//               <tr key={product.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex items-center">
//                     <div className="h-12 w-12 flex-shrink-0 relative rounded-lg overflow-hidden">
//                       <Image
//                         src={product.cover_image_url}
//                         alt={product.title}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="ml-4">
//                       <div className="text-sm font-medium text-gray-900">{product.title}</div>
//                       <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">₹{product.price.toLocaleString('en-IN')}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <button
//                     onClick={() => handleToggleActive(product.id, product.is_active)}
//                     className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       product.is_active
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-gray-100 text-gray-800'
//                     }`}
//                   >
//                     {product.is_active ? 'Active' : 'Inactive'}
//                   </button>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
//                   <button
//                     onClick={() => handleEdit(product)}
//                     className="text-indigo-600 hover:text-indigo-900"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(product.id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

// function ProductForm({ product, onClose, onSuccess }: any) {
//   const [formData, setFormData] = useState({
//     title: product?.title || '',
//     description: product?.description || '',
//     what_you_get: product?.what_you_get?.join('\n') || '',
//     price: product?.price || '',
//     cover_image_url: product?.cover_image_url || '',
//     file_url: product?.file_url || '',
//     auto_delivery: product?.auto_delivery ?? true,
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const url = product
//         ? `/api/admin/products/${product.id}`
//         : '/api/admin/products';
      
//       const method = product ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...formData,
//           what_you_get: formData.what_you_get.split('\n').filter(Boolean),
//           price: parseFloat(formData.price),
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         onSuccess(data.product);
//       } else {
//         alert('Failed to save product');
//       }
//     } catch (error) {
//       alert('Error saving product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//       <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-2xl font-bold">
//             {product ? 'Edit Product' : 'Add New Product'}
//           </h2>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Product Title *
//             </label>
//             <input
//               type="file"
//               required
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               className="input-field"
//               placeholder="My Amazing eBook"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Description *
//             </label>
//             <textarea
//               required
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               className="input-field"
//               rows={3}
//               placeholder="A detailed description of your product..."
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               What You'll Get (one per line) *
//             </label>
//             <textarea
//               required
//               value={formData.what_you_get}
//               onChange={(e) => setFormData({ ...formData, what_you_get: e.target.value })}
//               className="input-field"
//               rows={5}
//               placeholder="150+ pages of content&#10;Lifetime access&#10;Money-back guarantee"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Price (INR) *
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               required
//               value={formData.price}
//               onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//               className="input-field"
//               placeholder="499"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Cover Image URL *
//             </label>
//             <input
//               type="url"
//               required
//               value={formData.cover_image_url}
//               onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
//               className="input-field"
//               placeholder="https://example.com/image.jpg"
//             />
//             <p className="text-xs text-gray-500 mt-1">Upload to Cloudinary or use direct URL</p>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Product File URL *
//             </label>
//             <input
//               type="url"
//               required
//               value={formData.file_url}
//               onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
//               className="input-field"
//               placeholder="https://example.com/product.pdf"
//             />
//             <p className="text-xs text-gray-500 mt-1">Secure download URL for your digital product</p>
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="auto_delivery"
//               checked={formData.auto_delivery}
//               onChange={(e) => setFormData({ ...formData, auto_delivery: e.target.checked })}
//               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//             />
//             <label htmlFor="auto_delivery" className="ml-2 block text-sm text-gray-700">
//               Enable auto-delivery after payment
//             </label>
//           </div>

//           <div className="flex space-x-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 btn-primary disabled:opacity-50"
//             >
//               {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 btn-secondary"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { Product } from '@/lib/db';
import Image from 'next/image';

interface ProductsManagerProps {
  initialProducts: Product[];
}

export default function ProductsManager({ initialProducts }: ProductsManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, is_active: !currentStatus } : p
        ));
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      alert('Error updating product');
    }
  };

  return (
    <>
      <div className="mb-6">
        <button
          onClick={handleAddNew}
          className="btn-primary"
        >
          + Add New Product
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSuccess={(product) => {
            if (editingProduct) {
              setProducts(products.map(p => p.id === product.id ? product : p));
            } else {
              setProducts([product, ...products]);
            }
            setShowForm(false);
          }}
        />
      )}

      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0 relative rounded-lg overflow-hidden">
                      <Image
                        src={product.cover_image_url}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹{product.price.toLocaleString('en-IN')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(product.id, product.is_active)}
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ProductForm({ product, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    what_you_get: product?.what_you_get?.join('\n') || '',
    price: product?.price || '',
    auto_delivery: product?.auto_delivery ?? true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products';
      
      const method = product ? 'PUT' : 'POST';

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price.toString());
      data.append('what_you_get', formData.what_you_get);
      data.append('auto_delivery', formData.auto_delivery.toString());

      if (imageFile) data.append('image', imageFile);
      if (productFile) data.append('file', productFile);

      const response = await fetch(url, {
        method,
        body: data, // Browser automatically sets multipart/form-data boundary
      });

      if (response.ok) {
        const result = await response.json();
        onSuccess(result.product || result);
      } else {
        alert('Failed to save product');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-grow">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="e.g., Advanced React Guide"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (INR) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="499"
              />
            </div>
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="auto_delivery"
                checked={formData.auto_delivery}
                onChange={(e) => setFormData({ ...formData, auto_delivery: e.target.checked })}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="auto_delivery" className="ml-3 text-sm font-medium text-gray-700">
                Auto-delivery after payment
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              rows={3}
              placeholder="Describe your product..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What You'll Get (one per line) *
            </label>
            <textarea
              required
              value={formData.what_you_get}
              onChange={(e) => setFormData({ ...formData, what_you_get: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              rows={4}
              placeholder="Feature 1&#10;Feature 2"
            />
          </div>

          {/* Local File Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Cover Image {product ? '(Optional)' : '*'}
              </label>
              <input
                type="file"
                accept="image/*"
                required={!product}
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Product File {product ? '(Optional)' : '*'}
              </label>
              <input
                type="file"
                required={!product}
                onChange={(e) => setProductFile(e.target.files?.[0] || null)}
                className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex space-x-4 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all"
          >
            {loading ? 'Processing...' : (product ? 'Save Changes' : 'Create Product')}
          </button>
        </div>
      </div>
    </div>
  );
}
