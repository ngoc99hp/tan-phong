// src/app/api/products/slug/[slug]/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/products/slug/[slug]
 * Lấy chi tiết sản phẩm theo slug
 */
export async function GET(request, { params }) {
  try {
    const { slug } = params;

    const queryText = `
      SELECT 
        p.id,
        p.category_id,
        p.name,
        p.slug,
        p.description,
        p.content,
        p.price,
        p.badge,
        p.image_url,
        p.is_featured,
        p.is_active,
        p.display_order,
        p.views_count,
        p.meta_title,
        p.meta_description,
        p.published_at,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1 AND p.is_active = true
    `;

    const result = await query(queryText, [slug]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy sản phẩm',
          message: 'Sản phẩm không tồn tại hoặc đã bị ẩn'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Lấy thông tin sản phẩm thành công'
    });

  } catch (error) {
    console.error('❌ Error fetching product by slug:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra khi lấy thông tin sản phẩm',
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { slug } = params;

    const queryText = `
      UPDATE products 
      SET views_count = COALESCE(views_count, 0) + 1
      WHERE slug = $1 AND is_active = true
      RETURNING id, views_count
    `;

    const result = await query(queryText, [slug]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Sản phẩm không tồn tại'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: result.rows[0].id,
        views_count: result.rows[0].views_count
      },
      message: 'Cập nhật lượt xem thành công'
    });

  } catch (error) {
    console.error('❌ Error incrementing view count:', error);
    
    // Không trả lỗi để không ảnh hưởng UX
    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi khi cập nhật lượt xem'
      },
      { status: 500 }
    );
  }
}