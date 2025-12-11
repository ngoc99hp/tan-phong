// app/products-sitemap.xml/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const baseUrl = 'https://tanphong.ai.vn';

  try {
    // Lấy tất cả sản phẩm active
    const result = await query(`
      SELECT 
        slug, 
        updated_at, 
        published_at,
        COALESCE(updated_at, published_at, created_at) as lastmod
      FROM products
      WHERE is_active = true
      ORDER BY lastmod DESC
    `);

    const products = result.rows.map(product => ({
      loc: `${baseUrl}/products/${product.slug}`,
      lastmod: new Date(product.lastmod).toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    }));

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${products.map(product => `
  <url>
    <loc>${product.loc}</loc>
    <lastmod>${product.lastmod}</lastmod>
    <changefreq>${product.changefreq}</changefreq>
    <priority>${product.priority}</priority>
  </url>`).join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });

  } catch (error) {
    console.error('Error generating products sitemap:', error);
    
    // Fallback: return empty sitemap
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;

    return new NextResponse(emptySitemap, {
      headers: {
        'Content-Type': 'application/xml'
      }
    });
  }
}

// Revalidate every hour
export const revalidate = 3600;