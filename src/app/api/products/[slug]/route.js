import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    const result = await query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, c.icon as category_icon
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1 AND p.is_active = true
      LIMIT 1
    `, [slug]);
    
    if (!result || result.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Không tìm thấy sản phẩm' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Product Detail API Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Không thể tải thông tin sản phẩm' 
      },
      { status: 500 }
    );
  }
}