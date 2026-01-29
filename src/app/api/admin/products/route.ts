// import { NextRequest, NextResponse } from 'next/server';
// import { query } from '@/lib/db';
// import { verifyAuth } from '@/lib/auth';

// export async function GET(request: NextRequest) {
//   const auth = await verifyAuth();
//   if (!auth) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const result = await query('SELECT * FROM products ORDER BY created_at DESC');
//     return NextResponse.json({ products: result.rows });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
//   const auth = await verifyAuth();
//   if (!auth) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const body = await request.json();
//     const {
//       title,
//       description,
//       what_you_get,
//       cover_image_url,
//       price,
//       file_url,
//       auto_delivery,
//     } = body;

//     const result = await query(
//       `INSERT INTO products (
//         title, description, what_you_get, cover_image_url,
//         price, file_url, auto_delivery, is_active
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, true)
//       RETURNING *`,
//       [title, description, what_you_get, cover_image_url, price, file_url, auto_delivery]
//     );

//     return NextResponse.json({ product: result.rows[0] });
//   } catch (error) {
//     console.error('Product creation error:', error);
//     return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from 'next/server';
// import { query } from '@/lib/db';
// import { createClient } from '@supabase/supabase-js';

// // Initialize Supabase with Service Role Key to bypass storage RLS
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// export async function POST(request: NextRequest) {
//   try {
//     // Switch from .json() to .formData() to fix the SyntaxError
//     const data = await request.formData();
    
//     const title = data.get('title') as string;
//     const description = data.get('description') as string;
//     const price = parseFloat(data.get('price') as string);
//     const what_you_get = (data.get('what_you_get') as string).split('\n').filter(Boolean);
//     const auto_delivery = data.get('auto_delivery') === 'true';
    
//     const imageFile = data.get('image') as File;
//     const productFile = data.get('file') as File;

//     if (!title || !description || isNaN(price) || !imageFile || !productFile) {
//       return NextResponse.json({ error: 'Missing required fields or files' }, { status: 400 });
//     }

//     // 1. Upload Cover Image to 'product-image' bucket
//     const imagePath = `cover-${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`;
//     const { error: imageError } = await supabase.storage
//       .from('product-image')
//       .upload(imagePath, imageFile);

//     if (imageError) throw imageError;
//     const { data: { publicUrl: coverUrl } } = supabase.storage.from('product-image').getPublicUrl(imagePath);

//     // 2. Upload Product File to 'product-file' bucket
//     const filePath = `file-${Date.now()}-${productFile.name.replace(/\s+/g, '_')}`;
//     const { error: fileError } = await supabase.storage
//       .from('product-file')
//       .upload(filePath, productFile);

//     if (fileError) throw fileError;
//     const { data: { publicUrl: fileUrl } } = supabase.storage.from('product-file').getPublicUrl(filePath);

//     // 3. Insert into PostgreSQL Database
//     const result = await query(
//       `INSERT INTO products (
//         title, description, what_you_get, price, 
//         cover_image_url, file_url, auto_delivery, is_active
//       ) VALUES ($1, $2, $3, $4, $5, $6, $7, true) 
//       RETURNING *`,
//       [title, description, what_you_get, price, coverUrl, fileUrl, auto_delivery]
//     );

//     return NextResponse.json({ success: true, product: result.rows[0] });
//   } catch (error: any) {
//     console.error('Product creation error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to create product' },
//       { status: 500 }
//     );
//   }
// }

// // For fetching the list of products (used by Admin Dashboard)
// export async function GET() {
//   try {
//     const result = await query('SELECT * FROM products ORDER BY created_at DESC');
//     return NextResponse.json(result.rows);
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
//   }
// }

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.formData();

    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const price = parseFloat(data.get('price') as string);
    const what_you_get = (data.get('what_you_get') as string)
      .split('\n')
      .filter(Boolean);
    const auto_delivery = data.get('auto_delivery') === 'true';

    const imageFile = data.get('image') as File | null;
    const productFile = data.get('file') as File | null;

    const currentResult = await query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (currentResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const currentProduct = currentResult.rows[0];

    let coverUrl = currentProduct.cover_image_url;
    let fileUrl = currentProduct.file_url;

    if (imageFile && imageFile.size > 0) {
      const imagePath = `cover-${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`;

      const { error } = await supabase.storage
        .from('product-image')
        .upload(imagePath, imageFile);

      if (error) throw error;

      const { data } = supabase.storage
        .from('product-image')
        .getPublicUrl(imagePath);

      coverUrl = data.publicUrl;
    }

    if (productFile && productFile.size > 0) {
      const filePath = `file-${Date.now()}-${productFile.name.replace(/\s+/g, '_')}`;

      const { error } = await supabase.storage
        .from('product-file')
        .upload(filePath, productFile);

      if (error) throw error;

      const { data } = supabase.storage
        .from('product-file')
        .getPublicUrl(filePath);

      fileUrl = data.publicUrl;
    }

    const result = await query(
      `UPDATE products
       SET title = $1,
           description = $2,
           what_you_get = $3,
           price = $4,
           cover_image_url = $5,
           file_url = $6,
           auto_delivery = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        title,
        description,
        what_you_get,
        price,
        coverUrl,
        fileUrl,
        auto_delivery,
        id
      ]
    );

    return NextResponse.json({
      success: true,
      product: result.rows[0]
    });
  } catch (error: any) {
    console.error('Product update error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await query('DELETE FROM products WHERE id = $1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Product delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
