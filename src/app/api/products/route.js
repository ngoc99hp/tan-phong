import { NextResponse } from 'next/server';
import { getAllProducts, getProductsByCategory } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    
    let products;
    
    if (categoryId) {
      // Lấy products theo category
      products = await getProductsByCategory(parseInt(categoryId));
    } else {
      // Lấy tất cả products
      products = await getAllProducts();
    }
    
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      filter: categoryId ? { category: categoryId } : null
    });
  } catch (error) {
    console.error('Products API Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Không thể tải sản phẩm' 
      },
      { status: 500 }
    );
  }
}