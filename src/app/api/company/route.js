import { NextResponse } from 'next/server';
import { getCompanyInfo } from '@/lib/db';

export async function GET() {
  try {
    const companyInfo = await getCompanyInfo();
    
    return NextResponse.json({
      success: true,
      data: companyInfo
    });
  } catch (error) {
    console.error('Company Info API Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Không thể tải thông tin công ty' 
      },
      { status: 500 }
    );
  }
}