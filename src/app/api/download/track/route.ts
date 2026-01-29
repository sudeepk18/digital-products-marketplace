import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 400 }
      );
    }

    // Increment download count
    const result = await query(
      `UPDATE orders 
       SET download_count = download_count + 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE download_token = $1 AND payment_status = 'success'
       RETURNING download_count`,
      [token]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      downloadCount: result.rows[0].download_count,
    });
  } catch (error) {
    console.error('Download tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}
