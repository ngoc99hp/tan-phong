'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Thời gian refresh token trước khi hết hạn (5 phút)
const REFRESH_BEFORE_EXPIRY = 5 * 60 * 1000; // 5 minutes
// Access token expires sau 15 phút
const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 minutes

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function refresh access token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update tokens
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('token_timestamp', Date.now().toString());
        
        console.log('✅ Token refreshed successfully');
        return true;
      } else {
        throw new Error(data.message || 'Failed to refresh token');
      }
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      
      // Clear tokens và redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('token_timestamp');
      
      return false;
    }
  };

  // Check if token needs refresh
  const shouldRefreshToken = () => {
    const timestamp = localStorage.getItem('token_timestamp');
    if (!timestamp) return true;
    
    const elapsed = Date.now() - parseInt(timestamp);
    const timeUntilExpiry = ACCESS_TOKEN_LIFETIME - elapsed;
    
    // Refresh nếu còn 5 phút hoặc ít hơn
    return timeUntilExpiry <= REFRESH_BEFORE_EXPIRY;
  };

  // Setup auto refresh interval
  useEffect(() => {
    if (!isAuthenticated || pathname === '/admin/login') {
      return;
    }

    // Check và refresh ngay lập tức nếu cần
    if (shouldRefreshToken()) {
      refreshAccessToken();
    }

    // Setup interval check mỗi 1 phút
    const interval = setInterval(async () => {
      if (shouldRefreshToken()) {
        const success = await refreshAccessToken();
        
        if (!success) {
          // Token refresh failed, redirect to login
          router.push('/admin/login');
        }
      }
    }, 60 * 1000); // Check every 1 minute

    return () => clearInterval(interval);
  }, [isAuthenticated, pathname, router]);

  // Initial auth check
  useEffect(() => {
    // Skip auth check cho trang login
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const user = localStorage.getItem('user');

      if (!accessToken || !refreshToken || !user) {
        // Chưa đăng nhập -> redirect to login
        router.push('/admin/login');
        setLoading(false);
        return;
      }

      // Kiểm tra nếu token sắp hết hạn
      if (shouldRefreshToken()) {
        const success = await refreshAccessToken();
        
        if (!success) {
          router.push('/admin/login');
          setLoading(false);
          return;
        }
      }

      setIsAuthenticated(true);
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // Trang login không cần check auth
  if (pathname === '/admin/login') {
    return children;
  }

  // Chỉ render children khi đã authenticated
  return isAuthenticated ? children : null;
}

/**
 * Hook để lấy user info và tokens
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user data');
      }
    }
    
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('token_timestamp');
      
      // Redirect
      window.location.href = '/admin/login';
    }
  };

  return {
    user,
    accessToken,
    logout,
    isAuthenticated: !!user && !!accessToken
  };
}