import jwt from 'jsonwebtoken';

// Secret keys - Nên lưu trong .env
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET

// Token expiration times
const ACCESS_TOKEN_EXPIRES = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES = '7d'; // 7 days

/**
 * Tạo Access Token (JWT)
 * @param {Object} payload - User data { id, username, role }
 * @returns {String} JWT token
 */
export function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
    issuer: 'tanphong-admin',
    audience: 'tanphong-api'
  });
}

/**
 * Tạo Refresh Token
 * @param {Object} payload - User data { id, username }
 * @returns {String} JWT token
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
    issuer: 'tanphong-admin',
    audience: 'tanphong-api'
  });
}

/**
 * Verify Access Token
 * @param {String} token 
 * @returns {Object|null} Decoded payload hoặc null nếu invalid
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET, {
      issuer: 'tanphong-admin',
      audience: 'tanphong-api'
    });
  } catch (error) {
    console.error('Access token verification failed:', error.message);
    return null;
  }
}

/**
 * Verify Refresh Token
 * @param {String} token 
 * @returns {Object|null} Decoded payload hoặc null nếu invalid
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET, {
      issuer: 'tanphong-admin',
      audience: 'tanphong-api'
    });
  } catch (error) {
    console.error('Refresh token verification failed:', error.message);
    return null;
  }
}

/**
 * Decode token không verify (để xem thông tin)
 * @param {String} token 
 * @returns {Object|null}
 */
export function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

/**
 * Kiểm tra token có hết hạn chưa
 * @param {String} token 
 * @returns {Boolean}
 */
export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  return Date.now() >= decoded.exp * 1000;
}