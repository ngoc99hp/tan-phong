import { Pool } from 'pg';

// Tạo connection pool cho PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  max: 20, // Số lượng connection tối đa
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection khi khởi động
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

// Hàm query với error handling
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('✅ Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

// Hàm lấy một client từ pool (dùng cho transactions)
export async function getClient() {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);
  
  // Tạo timeout để tự động release sau 5 giây nếu quên
  const timeout = setTimeout(() => {
    console.error('⚠️ Client has been checked out for more than 5 seconds!');
  }, 5000);
  
  // Override release để clear timeout
  client.release = () => {
    clearTimeout(timeout);
    return release();
  };
  
  return client;
}

export default pool;