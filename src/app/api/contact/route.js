import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

/**
 * POST /api/contact
 * Tạo contact form submission mới
 * Body: { name, email, phone, subject?, message }
 */
export async function POST(request) {
  try {
    // Lấy dữ liệu từ request body
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Thiếu thông tin bắt buộc',
          message: 'Vui lòng điền đầy đủ: Họ tên, Email, Số điện thoại và Nội dung tin nhắn'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email không hợp lệ',
          message: 'Vui lòng nhập địa chỉ email đúng định dạng'
        },
        { status: 400 }
      );
    }

    // Validate phone format (Vietnamese phone number)
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        {
          success: false,
          error: 'Số điện thoại không hợp lệ',
          message: 'Vui lòng nhập số điện thoại Việt Nam hợp lệ'
        },
        { status: 400 }
      );
    }

    // Lấy thông tin từ request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Insert vào database
    const queryText = `
      INSERT INTO contacts (
        name, 
        email, 
        phone, 
        subject, 
        message, 
        status, 
        ip_address, 
        user_agent,
        created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id, name, email, phone, subject, created_at
    `;

    const values = [
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      subject?.trim() || null,
      message.trim(),
      'new', // Status mặc định
      ipAddress,
      userAgent
    ];

    const result = await query(queryText, values);

    // Trả về response thành công
    return NextResponse.json(
      {
        success: true,
        data: result.rows[0],
        message: 'Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Error creating contact:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra khi gửi thông tin',
        message: 'Vui lòng thử lại sau hoặc liên hệ trực tiếp qua hotline'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * Lấy danh sách contact submissions (Admin only - cần auth sau này)
 * Query params:
 *   - status: Filter theo trạng thái (new, processing, completed)
 *   - limit: Số lượng records
 *   - offset: Phân trang
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Xây dựng query
    let queryText = `
      SELECT 
        id,
        name,
        email,
        phone,
        subject,
        message,
        status,
        created_at
      FROM contacts
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    // Filter theo status
    if (status && ['new', 'processing', 'completed'].includes(status)) {
      queryText += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    // Sắp xếp theo thời gian mới nhất
    queryText += ` ORDER BY created_at DESC`;

    // Pagination
    queryText += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // Đếm tổng số records
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM contacts 
      WHERE 1=1 ${status ? `AND status = '${status}'` : ''}
    `;
    const countResult = await query(countQuery);
    const total = parseInt(countResult.rows[0].total);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      message: 'Lấy danh sách liên hệ thành công'
    });

  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra khi lấy danh sách liên hệ',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/contact/[id]
 * Cập nhật status của contact (Admin only - cần auth sau này)
 */
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Thiếu thông tin',
          message: 'Vui lòng cung cấp id và status'
        },
        { status: 400 }
      );
    }

    // Validate status
    if (!['new', 'processing', 'completed'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Status không hợp lệ',
          message: 'Status phải là: new, processing hoặc completed'
        },
        { status: 400 }
      );
    }

    const queryText = `
      UPDATE contacts 
      SET status = $1 
      WHERE id = $2
      RETURNING id, name, email, status, created_at
    `;

    const result = await query(queryText, [status, id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Không tìm thấy liên hệ',
          message: 'ID không tồn tại trong hệ thống'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Cập nhật trạng thái thành công'
    });

  } catch (error) {
    console.error('❌ Error updating contact status:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra khi cập nhật',
        message: error.message
      },
      { status: 500 }
    );
  }
}