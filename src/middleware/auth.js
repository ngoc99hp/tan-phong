'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Thời gian refresh token trước khi hết hạn (5 phút)
const REFRESH_BEFORE_EXPIRY = 5 * 60 * 1000; // 5 minutes
// Access token expires sau 15 phút
const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 minutes

// Thống nhất các keys localStorage
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  TOKEN_TIMESTAMP: 'token_timestamp'
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Set mounted flag để tránh hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function refresh access token
  const refreshAccessToken = async () => {
    try {
      if (typeof window === 'undefined') return false;
      
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        console.warn('No refresh token found');
        return false;
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
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        localStorage.setItem(STORAGE_KEYS.TOKEN_TIMESTAMP, Date.now().toString());
        
        console.log('✅ Token refreshed successfully');
        return true;
      } else {
        console.error('Refresh failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      return false;
    }
  };

  // Check if token needs refresh
  const shouldRefreshToken = () => {
    if (typeof window === 'undefined') return false;
    
    const timestamp = localStorage.getItem(STORAGE_KEYS.TOKEN_TIMESTAMP);
    if (!timestamp) return true;
    
    const elapsed = Date.now() - parseInt(timestamp);
    const timeUntilExpiry = ACCESS_TOKEN_LIFETIME - elapsed;
    
    // Refresh nếu còn 5 phút hoặc ít hơn
    return timeUntilExpiry <= REFRESH_BEFORE_EXPIRY;
  };

  // Clear all authentication data
  const clearAuth = () => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_TIMESTAMP);
    
    setIsAuthenticated(false);
  };

  // Initial auth check - chạy một lần sau khi mounted
  useEffect(() => {
    if (!mounted) return;

    const checkAuth = async () => {
      // Kiểm tra các tokens trước tiên
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      const hasTokens = !!(accessToken && refreshToken && user);

      // Trang login
      if (pathname === '/admin/login') {
        // Nếu đã login, redirect về admin
        if (hasTokens) {
          console.log('✅ Already authenticated, redirecting to /admin');
          router.push('/admin');
        }
        setLoading(false);
        return;
      }

      // Các trang khác (/admin, /admin/products, v.v.)
      if (!hasTokens) {
        // Chưa đăng nhập -> redirect to login
        console.warn('⚠️ No tokens found, redirecting to login');
        clearAuth();
        router.push('/admin/login');
        setLoading(false);
        return;
      }

      try {
        // Kiểm tra nếu token sắp hết hạn
        if (shouldRefreshToken()) {
          const success = await refreshAccessToken();
          
          if (!success) {
            console.error('Failed to refresh token');
            clearAuth();
            router.push('/admin/login');
            setLoading(false);
            return;
          }
        }

        // Nếu tất cả ok, set authenticated = true
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        clearAuth();
        router.push('/admin/login');
        setLoading(false);
      }
    };

    checkAuth();
  }, [mounted, pathname, router]);

  // Setup auto refresh interval - chỉ chạy khi authenticated
  useEffect(() => {
    if (!mounted || !isAuthenticated || pathname === '/admin/login') {
      return;
    }

    // Setup interval check mỗi 1 phút
    const interval = setInterval(async () => {
      if (shouldRefreshToken()) {
        console.log('🔄 Refreshing token...');
        const success = await refreshAccessToken();
        
        if (!success) {
          console.error('Token refresh failed, logging out');
          clearAuth();
          router.push('/admin/login');
        }
      }
    }, 60 * 1000); // Check every 1 minute

    return () => {
      clearInterval(interval);
    };
  }, [mounted, isAuthenticated, pathname, router]);

  // Show loading screen khi chưa mount
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Trang login: render children luôn (không cần check auth)
  if (pathname === '/admin/login') {
    return children;
  }

  // Khi loading, show loading screen
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

  // Chỉ render children khi đã authenticated
  if (isAuthenticated) {
    return children;
  }

  // Chưa authenticated, show loading (redirect sẽ diễn ra)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}

/**
 * Hook để lấy user info, tokens và logout function
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
      
      if (token) {
        setAccessToken(token);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      if (typeof window === 'undefined') return;

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      // Call logout API
      if (refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken })
        }).catch(err => console.error('Logout API error:', err));
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN_TIMESTAMP);
      
      // Reset state
      setUser(null);
      setAccessToken(null);
      
      // Redirect
      router.push('/admin/login');
    }
  };

  return {
    user,
    accessToken,
    logout,
    loading,
    isAuthenticated: !!user && !!accessToken
  };
}

// Export storage keys để dùng ở nơi khác
export { STORAGE_KEYS };