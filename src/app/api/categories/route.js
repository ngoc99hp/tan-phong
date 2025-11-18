import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/categories
 * Lấy danh sách tất cả danh mục sản phẩm
 * Query params:
 *   - limit: Số lượng categories tối đa
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    // Xây dựng câu query
    let queryText = `
      SELECT 
        id,
        name,
        slug,
        description,
        icon,
        display_order,
        created_at
      FROM categories
      ORDER BY display_order, id
    `;

    const params = [];

    // Thêm limit nếu có
    if (limit) {
      queryText += ` LIMIT $1`;
      params.push(parseInt(limit));
    }

    // Thực hiện query
    const result = await query(queryText, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      message: 'Lấy danh sách danh mục thành công'
    });

  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra khi lấy danh sách danh mục',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Tạo danh mục mới (Admin only)
 * Body: { name, slug, description?, icon?, display_order? }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, description, icon, display_order } = body;

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Thiếu thông tin bắt buộc',
          message: 'Vui lòng cung cấp tên và slug cho danh mục'
        },
        { status: 400 }
      );
    }

    // Kiểm tra slug đã tồn tại chưa
    const checkSlug = await query(
      'SELECT id FROM categories WHERE slug = $1',
      [slug]
    );

    if (checkSlug.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slug đã tồn tại',
          message: 'Slug này đã được sử dụng, vui lòng chọn slug khác'
        },
        { status: 409 }
      );
    }

    // Insert vào database
    const queryText = `
      INSERT INTO categories (
        name,
        slug,
        description,
        icon,
        display_order,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, name, slug, description, icon, display_order, created_at
    `;

    const values = [
      name.trim(),
      slug.trim().toLowerCase(),
      description?.trim() || null,
      icon?.trim() || null,
      display_order || 0
    ];

    const result = await query(queryText, values);

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Tạo danh mục thành công'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Error creating category:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra khi tạo danh mục',
        message: error.message
      },
      { status: 500 }
    );
  }
}