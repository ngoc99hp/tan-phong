import { NextResponse } from 'next/server';
import { getServices } from '@/lib/db';

export async function GET() {
  try {
    const services = await getServices();
    
    return NextResponse.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Services API Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Không thể tải dịch vụ' 
      },
      { status: 500 }
    );
  }
}