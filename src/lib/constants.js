// src/lib/constants.js

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  TOKEN_TIMESTAMP: 'token_timestamp'
};

export const API_TIMEOUTS = {
  SHORT: 5000,      // 5s
  MEDIUM: 15000,    // 15s
  LONG: 30000       // 30s
};

export const TOKEN_LIFETIME = {
  ACCESS: 15 * 60 * 1000,    // 15 minutes
  REFRESH: 7 * 24 * 60 * 1000 // 7 days
};