// src/app/api/products/[id]/route.js
// ============================================

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * GET /api/products/[id]
 * Lấy thông tin chi tiết một sản phẩm
 */
export async function GET(request, { params }) {
  try {
    // FIX 1: Unwrap params Promise với await
    const resolvedParams = await params;
    const { id } = resolvedParams;

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
        p.meta_title,
        p.meta_description,
        p.published_at,
        p.is_featured,
        p.is_active,
        p.display_order,
        p.views_count,
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
 * Cập nhật thông tin sản phẩm
 */
export async function PUT(request, { params }) {
  try {
    // FIX 2: Unwrap params Promise
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const body = await request.json();
    const {
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
      display_order
    } = body;

    console.log('📝 Updating product:', id, body);

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

    // Validate category_id nếu có
    if (category_id !== undefined && category_id !== null && category_id !== '') {
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

    // Kiểm tra slug trùng lặp (trừ chính nó)
    if (slug !== undefined && slug !== null && slug !== '') {
      const checkSlug = await query(
        'SELECT id FROM products WHERE slug = $1 AND id != $2',
        [slug.trim().toLowerCase(), id]
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

    // FIX 3: Xây dựng câu UPDATE động - chỉ update các field được gửi lên
    const updates = [];
    const values = [];
    let paramCount = 1;

    // Category ID
    if (category_id !== undefined) {
      updates.push(`category_id = $${paramCount}`);
      values.push(category_id ? parseInt(category_id) : null);
      paramCount++;
    }
    
    // Name
    if (name !== undefined && name !== null) {
      updates.push(`name = $${paramCount}`);
      values.push(name.trim());
      paramCount++;
    }
    
    // Slug
    if (slug !== undefined && slug !== null) {
      updates.push(`slug = $${paramCount}`);
      values.push(slug.trim().toLowerCase());
      paramCount++;
    }
    
    // Description
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description ? description.trim() : null);
      paramCount++;
    }
    
    // Content (Rich Text Editor)
    if (content !== undefined) {
      updates.push(`content = $${paramCount}`);
      values.push(content ? content.trim() : null);
      paramCount++;
    }
    
    // Price
    if (price !== undefined) {
      updates.push(`price = $${paramCount}`);
      values.push(price ? price.trim() : null);
      paramCount++;
    }
    
    // Badge
    if (badge !== undefined) {
      updates.push(`badge = $${paramCount}`);
      values.push(badge ? badge.trim() : null);
      paramCount++;
    }
    
    // Image URL
    if (image_url !== undefined) {
      updates.push(`image_url = $${paramCount}`);
      values.push(image_url ? image_url.trim() : null);
      paramCount++;
    }
    
    // Meta Title
    if (meta_title !== undefined) {
      updates.push(`meta_title = $${paramCount}`);
      values.push(meta_title ? meta_title.trim() : null);
      paramCount++;
    }
    
    // Meta Description
    if (meta_description !== undefined) {
      updates.push(`meta_description = $${paramCount}`);
      values.push(meta_description ? meta_description.trim() : null);
      paramCount++;
    }
    
    // Published At
    if (published_at !== undefined) {
      updates.push(`published_at = $${paramCount}`);
      // FIX 4: Xử lý date đúng cách
      if (published_at && published_at !== '') {
        values.push(new Date(published_at));
      } else {
        values.push(null);
      }
      paramCount++;
    }
    
    // Is Featured
    if (is_featured !== undefined) {
      updates.push(`is_featured = $${paramCount}`);
      values.push(Boolean(is_featured));
      paramCount++;
    }
    
    // Is Active
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      values.push(Boolean(is_active));
      paramCount++;
    }
    
    // Display Order
    if (display_order !== undefined) {
      updates.push(`display_order = $${paramCount}`);
      values.push(display_order ? parseInt(display_order) : 0);
      paramCount++;
    }

    // FIX 5: Phải có ít nhất 1 trường để update
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

    // Always update updated_at
    updates.push(`updated_at = NOW()`);
    
    // FIX 6: ID phải là tham số cuối cùng
    values.push(id);

    const queryText = `
      UPDATE products
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING 
        id, category_id, name, slug, description, content,
        price, badge, image_url, meta_title, meta_description,
        published_at, is_featured, is_active, display_order,
        views_count, created_at, updated_at
    `;

    console.log('🔍 Query:', queryText);
    console.log('🔍 Values:', values);

    const result = await query(queryText, values);

    console.log('✅ Update result:', result.rows[0]);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Cập nhật sản phẩm thành công'
    });

  } catch (error) {
    console.error('❌ Error updating product:', error);
    console.error('Stack:', error.stack);
    
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
 * Xóa sản phẩm
 */
export async function DELETE(request, { params }) {
  try {
    // FIX 7: Unwrap params
    const resolvedParams = await params;
    const { id } = resolvedParams;

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