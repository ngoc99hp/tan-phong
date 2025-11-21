import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt';

/**
 * Middleware xác thực cho API routes
 * @param {Request} request 
 * @returns {Object|NextResponse} User data hoặc error response
 */
export async function authenticateRequest(request) {
  try {
    // Lấy token từ Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không tìm thấy token xác thực'
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Bỏ "Bearer "

    // Verify token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Token không hợp lệ hoặc đã hết hạn'
        },
        { status: 401 }
      );
    }

    // Return user data
    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };

  } catch (error) {
    console.error('Authentication error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi xác thực'
      },
      { status: 500 }
    );
  }
}

/**
 * Wrapper HOC để protect API routes
 * @param {Function} handler - API route handler
 * @returns {Function} Protected handler
 */
export function withAuth(handler) {
  return async (request, context) => {
    const user = await authenticateRequest(request);
    
    // Nếu user là NextResponse (error), return nó
    if (user instanceof NextResponse) {
      return user;
    }
    
    // Attach user to request
    request.user = user;
    
    // Call original handler
    return handler(request, context);
  };
}

/**
 * Check role authorization
 * @param {Object} user 
 * @param {String|Array} allowedRoles 
 * @returns {Boolean}
 */
export function hasRole(user, allowedRoles) {
  if (!user || !user.role) return false;
  
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(user.role);
  }
  
  return user.role === allowedRoles;
}