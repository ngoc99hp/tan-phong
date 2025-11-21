import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { serialize } from 'cookie';

/**
 * POST /api/auth/refresh
 * Làm mới access token bằng refresh token
 * Body: { refreshToken } hoặc từ cookie
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    
    // Lấy refresh token từ body hoặc cookie
    let refreshToken = body.refreshToken;
    
    if (!refreshToken) {
      const cookies = request.headers.get('cookie');
      if (cookies) {
        const cookieMap = Object.fromEntries(
          cookies.split('; ').map(c => c.split('='))
        );
        refreshToken = cookieMap.refresh_token;
      }
    }

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Refresh token không tồn tại'
        },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Refresh token không hợp lệ hoặc đã hết hạn'
        },
        { status: 401 }
      );
    }

    // Kiểm tra refresh token có trong database không
    const tokenResult = await query(
      `SELECT rt.id, rt.user_id, rt.revoked, u.username, u.role, u.is_active
       FROM refresh_tokens rt
       JOIN users u ON rt.user_id = u.id
       WHERE rt.token = $1 AND rt.expires_at > NOW()`,
      [refreshToken]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Refresh token không hợp lệ'
        },
        { status: 401 }
      );
    }

    const tokenData = tokenResult.rows[0];

    // Kiểm tra token có bị revoke không
    if (tokenData.revoked) {
      return NextResponse.json(
        {
          success: false,
          message: 'Refresh token đã bị thu hồi'
        },
        { status: 401 }
      );
    }

    // Kiểm tra user có active không
    if (!tokenData.is_active) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tài khoản đã bị vô hiệu hóa'
        },
        { status: 403 }
      );
    }

    // Tạo access token mới
    const newAccessToken = generateAccessToken({
      id: tokenData.user_id,
      username: tokenData.username,
      role: tokenData.role
    });

    // Tùy chọn: Tạo refresh token mới (rotate refresh token)
    const newRefreshToken = generateRefreshToken({
      id: tokenData.user_id,
      username: tokenData.username
    });

    // Lưu refresh token mới và revoke token cũ
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await query('BEGIN');
    
    // Revoke token cũ
    await query(
      'UPDATE refresh_tokens SET revoked = true WHERE id = $1',
      [tokenData.id]
    );
    
    // Insert token mới
    await query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) 
       VALUES ($1, $2, $3)`,
      [tokenData.user_id, newRefreshToken, expiresAt]
    );
    
    await query('COMMIT');

    // Tạo response
    const response = NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      message: 'Làm mới token thành công'
    });

    // Update cookie
    response.headers.append(
      'Set-Cookie',
      serialize('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      })
    );

    return response;

  } catch (error) {
    console.error('❌ Refresh token error:', error);
    
    // Rollback nếu có lỗi
    try {
      await query('ROLLBACK');
    } catch (e) {
      // Ignore rollback errors
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra khi làm mới token'
      },
      { status: 500 }
    );
  }
}