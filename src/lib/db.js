import { neon } from '@neondatabase/serverless';

// Khởi tạo connection
const sql = neon(process.env.DATABASE_URL);

// Helper function để query
export async function query(text, params) {
  try {
    const result = await sql(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper functions cho các bảng

// Lấy tất cả categories với products
export async function getCategories() {
  try {
    const result = await query(`
      SELECT * FROM categories 
      ORDER BY display_order ASC
    `);
    return result || [];
  } catch (error) {
    console.error('getCategories error:', error);
    return [];
  }
}

// Lấy products theo category
export async function getProductsByCategory(categoryId) {
  const result = await query(`
    SELECT * FROM products 
    WHERE category_id = $1 AND is_active = true
    ORDER BY display_order ASC
  `, [categoryId]);
  return result;
}

// Lấy tất cả products
export async function getAllProducts() {
  const result = await query(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = true
    ORDER BY c.display_order ASC, p.display_order ASC
  `);
  return result;
}

// Lấy tất cả services
export async function getServices() {
  const result = await query(`
    SELECT * FROM services 
    WHERE is_active = true
    ORDER BY display_order ASC
  `);
  return result;
}

// Tạo contact mới
export async function createContact(data) {
  const { name, email, phone, subject, message, ipAddress, userAgent } = data;
  
  const result = await query(`
    INSERT INTO contacts (name, email, phone, subject, message, ip_address, user_agent)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, created_at
  `, [name, email, phone, subject, message, ipAddress, userAgent]);
  
  return result[0];
}

// Lấy company info
export async function getCompanyInfo() {
  const result = await query(`
    SELECT key, value FROM company_info
  `);
  
  // Convert array to object
  return result.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}