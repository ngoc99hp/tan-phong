import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { serialize } from 'cookie';

/**
 * POST /api/auth/logout
 * Đăng xuất và revoke refresh token
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

    // Nếu có refresh token, revoke nó
    if (refreshToken) {
      await query(
        'UPDATE refresh_tokens SET revoked = true WHERE token = $1',
        [refreshToken]
      );
    }

    // Tạo response
    const response = NextResponse.json({
      success: true,
      message: 'Đăng xuất thành công'
    });

    // Clear cookie
    response.headers.append(
      'Set-Cookie',
      serialize('refresh_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0, // Xóa cookie
        path: '/'
      })
    );

    return response;

  } catch (error) {
    console.error('❌ Logout error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra khi đăng xuất'
      },
      { status: 500 }
    );
  }
}