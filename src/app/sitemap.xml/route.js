// app/sitemap.xml/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://tanphong.ai.vn';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main pages sitemap -->
  <sitemap>
    <loc>${baseUrl}/main-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  
  <!-- Products sitemap -->
  <sitemap>
    <loc>${baseUrl}/products-sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}