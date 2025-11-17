import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/products
 * Lấy danh sách sản phẩm với các tùy chọn filter
 * Query params:
 *   - category_id: Lọc theo danh mục
 *   - is_featured: Chỉ lấy sản phẩm nổi bật (true/false)
 *   - is_active: Chỉ lấy sản phẩm đang hoạt động (mặc định: true)
 *   - limit: Số lượng sản phẩm tối đa
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Lấy các query parameters
    const categoryId = searchParams.get('category_id');
    const isFeatured = searchParams.get('is_featured');
    const isActive = searchParams.get('is_active') !== 'false'; // Mặc định true
    const limit = searchParams.get('limit');

    // Xây dựng câu query động
    let queryText = `
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price,
        p.badge,
        p.image_url,
        p.is_featured,
        p.is_active,
        p.display_order,
        p.created_at,
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    // Thêm điều kiện is_active
    if (isActive) {
      queryText += ` AND p.is_active = $${paramCount}`;
      params.push(true);
      paramCount++;
    }

    // Thêm filter theo category_id
    if (categoryId) {
      queryText += ` AND p.category_id = $${paramCount}`;
      params.push(parseInt(categoryId));
      paramCount++;
    }

    // Thêm filter theo is_featured
    if (isFeatured === 'true') {
      queryText += ` AND p.is_featured = $${paramCount}`;
      params.push(true);
      paramCount++;
    }

    // Sắp xếp theo display_order và id
    queryText += ` ORDER BY c.display_order, p.display_order, p.id`;

    // Thêm limit nếu có
    if (limit) {
      queryText += ` LIMIT $${paramCount}`;
      params.push(parseInt(limit));
    }

    // Thực hiện query
    const result = await query(queryText, params);

    // Group products by category
    const productsByCategory = result.rows.reduce((acc, product) => {
      const categoryKey = product.category_id;
      
      if (!acc[categoryKey]) {
        acc[categoryKey] = {
          category: {
            id: product.category_id,
            name: product.category_name,
            slug: product.category_slug
          },
          products: []
        };
      }
      
      acc[categoryKey].products.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        badge: product.badge,
        image_url: product.image_url,
        is_featured: product.is_featured,
        is_active: product.is_active,
        display_order: product.display_order,
        created_at: product.created_at
      });
      
      return acc;
    }, {});

    // Chuyển object thành array
    const groupedData = Object.values(productsByCategory);

    return NextResponse.json({
      success: true,
      data: groupedData,
      total: result.rows.length,
      message: 'Lấy danh sách sản phẩm thành công'
    });

  } catch (error) {
    console.error('❌ Error fetching products:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra khi lấy danh sách sản phẩm',
        message: error.message
      },
      { status: 500 }
    );
  }
}