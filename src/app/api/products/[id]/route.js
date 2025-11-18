import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/products/[id]
 * Lấy thông tin chi tiết một sản phẩm
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const queryText = `
      SELECT 
        p.id,
        p.category_id,
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
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;

    const result = await query(queryText, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy sản phẩm',
          message: 'Sản phẩm không tồn tại trong hệ thống'
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
    console.error('❌ Error fetching product:', error);
    
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

/**
 * PUT /api/products/[id]
 * Cập nhật thông tin sản phẩm (Admin only)
 * Body: { category_id?, name?, slug?, description?, price?, badge?, image_url?, is_featured?, is_active?, display_order? }
 */
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      category_id,
      name,
      slug,
      description,
      price,
      badge,
      image_url,
      is_featured,
      is_active,
      display_order
    } = body;

    // Kiểm tra sản phẩm có tồn tại không
    const checkExist = await query(
      'SELECT id FROM products WHERE id = $1',
      [id]
    );

    if (checkExist.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy sản phẩm',
          message: 'Sản phẩm không tồn tại trong hệ thống'
        },
        { status: 404 }
      );
    }

    // Nếu có category_id mới, kiểm tra category có tồn tại không
    if (category_id !== undefined) {
      const checkCategory = await query(
        'SELECT id FROM categories WHERE id = $1',
        [category_id]
      );

      if (checkCategory.rows.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Danh mục không tồn tại',
            message: 'Category ID không hợp lệ'
          },
          { status: 400 }
        );
      }
    }

    // Nếu có slug mới, kiểm tra trùng lặp (trừ chính nó)
    if (slug !== undefined) {
      const checkSlug = await query(
        'SELECT id FROM products WHERE slug = $1 AND id != $2',
        [slug, id]
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
    }

    // Xây dựng câu UPDATE động
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (category_id !== undefined) {
      updates.push(`category_id = $${paramCount}`);
      values.push(category_id);
      paramCount++;
    }
    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name.trim());
      paramCount++;
    }
    if (slug !== undefined) {
      updates.push(`slug = $${paramCount}`);
      values.push(slug.trim().toLowerCase());
      paramCount++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description?.trim() || null);
      paramCount++;
    }
    if (price !== undefined) {
      updates.push(`price = $${paramCount}`);
      values.push(price?.trim() || null);
      paramCount++;
    }
    if (badge !== undefined) {
      updates.push(`badge = $${paramCount}`);
      values.push(badge?.trim() || null);
      paramCount++;
    }
    if (image_url !== undefined) {
      updates.push(`image_url = $${paramCount}`);
      values.push(image_url?.trim() || null);
      paramCount++;
    }
    if (is_featured !== undefined) {
      updates.push(`is_featured = $${paramCount}`);
      values.push(is_featured);
      paramCount++;
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      values.push(is_active);
      paramCount++;
    }
    if (display_order !== undefined) {
      updates.push(`display_order = $${paramCount}`);
      values.push(display_order);
      paramCount++;
    }

    if (updates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không có thông tin để cập nhật',
          message: 'Vui lòng cung cấp ít nhất một trường để cập nhật'
        },
        { status: 400 }
      );
    }

    // Thêm updated_at
    updates.push(`updated_at = NOW()`);
    values.push(id);

    const queryText = `
      UPDATE products
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING 
        id, category_id, name, slug, description, price, badge,
        image_url, is_featured, is_active, display_order, 
        created_at, updated_at
    `;

    const result = await query(queryText, values);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Cập nhật sản phẩm thành công'
    });

  } catch (error) {
    console.error('❌ Error updating product:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra khi cập nhật sản phẩm',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Xóa sản phẩm (Admin only)
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Kiểm tra sản phẩm có tồn tại không
    const checkExist = await query(
      'SELECT id, name FROM products WHERE id = $1',
      [id]
    );

    if (checkExist.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy sản phẩm',
          message: 'Sản phẩm không tồn tại trong hệ thống'
        },
        { status: 404 }
      );
    }

    // Xóa sản phẩm
    await query('DELETE FROM products WHERE id = $1', [id]);

    return NextResponse.json({
      success: true,
      data: { 
        id, 
        name: checkExist.rows[0].name,
        deleted: true 
      },
      message: 'Xóa sản phẩm thành công'
    });

  } catch (error) {
    console.error('❌ Error deleting product:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra khi xóa sản phẩm',
        message: error.message
      },
      { status: 500 }
    );
  }
}