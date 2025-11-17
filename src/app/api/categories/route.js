import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/db';

export async function GET() {
  try {
    const categories = await getCategories();
    
    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    console.error('Categories API Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Không thể tải danh mục sản phẩm' 
      },
      { status: 500 }
    );
  }
}

// OPTIONS method cho CORS (nếu cần gọi từ external)
export async function OPTIONS() {
  return NextResponse.json({}, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}