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

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      category_id,
      name,
      slug,
      description,
      content,  // NEW
      price,
      badge,
      image_url,
      meta_title,  // NEW
      meta_description,  // NEW
      published_at,  // NEW
      is_featured,
      is_active,
      display_order
    } = body;

    // Validation
    if (!category_id || !name || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Thiếu thông tin bắt buộc',
          message: 'Vui lòng cung cấp category_id, name và slug'
        },
        { status: 400 }
      );
    }

    // Kiểm tra slug đã tồn tại chưa
    const checkSlug = await query(
      'SELECT id FROM products WHERE slug = $1',
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
      INSERT INTO products (
        category_id,
        name,
        slug,
        description,
        content,
        price,
        badge,
        image_url,
        meta_title,
        meta_description,
        published_at,
        is_featured,
        is_active,
        display_order,
        views_count,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 0, NOW(), NOW())
      RETURNING 
        id, category_id, name, slug, description, content, price, badge,
        image_url, meta_title, meta_description, published_at, is_featured, 
        is_active, display_order, views_count, created_at, updated_at
    `;

    const values = [
      parseInt(category_id),
      name.trim(),
      slug.trim().toLowerCase(),
      description?.trim() || null,
      content?.trim() || null,  // NEW
      price?.trim() || null,
      badge?.trim() || null,
      image_url?.trim() || null,
      meta_title?.trim() || name.trim(),  // NEW - default to name
      meta_description?.trim() || description?.trim() || null,  // NEW - default to description
      published_at ? new Date(published_at) : new Date(),  // NEW - default to now
      is_featured || false,
      is_active !== false,
      display_order || 0
    ];

    const result = await query(queryText, values);

    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Tạo sản phẩm thành công'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Error creating product:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra khi tạo sản phẩm',
        message: error.message
      },
      { status: 500 }
    );
  }
}