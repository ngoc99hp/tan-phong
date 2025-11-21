/**
 * API Client với tự động refresh token
 */

class ApiClient {
  constructor() {
    this.baseURL = '';
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Process queue sau khi refresh token
  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // Refresh access token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to refresh token');
    }

    // Update tokens
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('token_timestamp', Date.now().toString());

    return data.accessToken;
  }

  // Main request method
  async request(endpoint, options = {}) {
    const accessToken = localStorage.getItem('access_token');
    
    // Setup headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Make request
    let response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers
    });

    // Nếu 401 và có refresh token, thử refresh
    if (response.status === 401 && localStorage.getItem('refresh_token')) {
      // Nếu đang refresh, đợi
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        })
          .then(token => {
            headers['Authorization'] = `Bearer ${token}`;
            return fetch(`${this.baseURL}${endpoint}`, {
              ...options,
              headers
            });
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      this.isRefreshing = true;

      try {
        const newToken = await this.refreshToken();
        this.isRefreshing = false;
        this.processQueue(null, newToken);

        // Retry request với token mới
        headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers
        });
      } catch (error) {
        this.isRefreshing = false;
        this.processQueue(error, null);
        
        // Clear tokens và redirect
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_timestamp');
        window.location.href = '/admin/login';
        
        throw error;
      }
    }

    return response;
  }

  // Convenience methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET'
    });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE'
    });
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export convenience wrapper
export async function apiRequest(endpoint, options) {
  const response = await apiClient.request(endpoint, options);
  return response.json();
}

/**
 * Usage examples:
 * 
 * import apiClient from '@/lib/apiClient';
 * 
 * // GET request
 * const response = await apiClient.get('/api/products');
 * const data = await response.json();
 * 
 * // POST request
 * const response = await apiClient.post('/api/products', {
 *   name: 'New Product'
 * });
 * 
 * // With wrapper
 * import { apiRequest } from '@/lib/apiClient';
 * const data = await apiRequest('/api/products', { method: 'GET' });
 */