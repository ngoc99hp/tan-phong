import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/services
 * Lấy danh sách dịch vụ
 * Query params:
 *   - is_active: Chỉ lấy dịch vụ đang hoạt động (true/false, mặc định: true)
 *   - limit: Số lượng dịch vụ tối đa
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Lấy các query parameters
    const isActive = searchParams.get('is_active') !== 'false'; // Mặc định true
    const limit = searchParams.get('limit');

    // Xây dựng câu query
    let queryText = `
      SELECT 
        id,
        title,
        slug,
        description,
        icon,
        is_active,
        display_order,
        created_at
      FROM services
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    // Thêm điều kiện is_active
    if (isActive) {
      queryText += ` AND is_active = $${paramCount}`;
      params.push(true);
      paramCount++;
    }

    // Sắp xếp theo display_order và id
    queryText += ` ORDER BY display_order, id`;

    // Thêm limit nếu có
    if (limit) {
      queryText += ` LIMIT $${paramCount}`;
      params.push(parseInt(limit));
    }

    // Thực hiện query
    const result = await query(queryText, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      message: 'Lấy danh sách dịch vụ thành công'
    });

  } catch (error) {
    console.error('❌ Error fetching services:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra khi lấy danh sách dịch vụ',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/services/[slug]
 * Lấy chi tiết một dịch vụ theo slug
 * (Để dành cho tương lai nếu cần trang chi tiết dịch vụ)
 */
export async function getServiceBySlug(slug) {
  try {
    const queryText = `
      SELECT 
        id,
        title,
        slug,
        description,
        icon,
        is_active,
        display_order,
        created_at
      FROM services
      WHERE slug = $1 AND is_active = true
      LIMIT 1
    `;

    const result = await query(queryText, [slug]);

    if (result.rows.length === 0) {
      return {
        success: false,
        error: 'Không tìm thấy dịch vụ',
        data: null
      };
    }

    return {
      success: true,
      data: result.rows[0],
      message: 'Lấy thông tin dịch vụ thành công'
    };

  } catch (error) {
    console.error('❌ Error fetching service by slug:', error);
    return {
      success: false,
      error: 'Có lỗi xảy ra khi lấy thông tin dịch vụ',
      message: error.message
    };
  }
}