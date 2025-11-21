import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword } from '@/lib/bcrypt';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { serialize } from 'cookie';

/**
 * POST /api/auth/login
 * Đăng nhập admin với JWT & Database
 * Body: { username, password }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin'
        },
        { status: 400 }
      );
    }

    // Tìm user trong database
    const userQuery = `
      SELECT 
        id, username, password_hash, email, full_name, role, is_active
      FROM users 
      WHERE username = $1
    `;
    
    const result = await query(userQuery, [username]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không chính xác'
        },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Kiểm tra account có active không
    if (!user.is_active) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tài khoản đã bị vô hiệu hóa'
        },
        { status: 403 }
      );
    }

    // Verify password với bcrypt
    const isPasswordValid = await verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không chính xác'
        },
        { status: 401 }
      );
    }

    // Tạo JWT tokens
    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: user.id, username: user.username });

    // Lưu refresh token vào database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    await query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) 
       VALUES ($1, $2, $3)`,
      [user.id, refreshToken, expiresAt]
    );

    // Cập nhật last_login
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );

    // Xóa refresh tokens cũ đã hết hạn
    await query(
      'DELETE FROM refresh_tokens WHERE user_id = $1 AND expires_at < NOW()',
      [user.id]
    );

    // Tạo response với cookies
    const response = NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      },
      message: 'Đăng nhập thành công'
    });

    // Set HTTP-only cookies (bảo mật hơn localStorage)
    response.headers.append(
      'Set-Cookie',
      serialize('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      })
    );

    return response;

  } catch (error) {
    console.error('❌ Login error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra khi đăng nhập'
      },
      { status: 500 }
    );
  }
}