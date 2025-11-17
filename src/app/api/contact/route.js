import { NextResponse } from 'next/server';
import { createContact } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // Phone validation (Vietnamese format)
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Số điện thoại không hợp lệ' },
        { status: 400 }
      );
    }

    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Save to database
    const result = await createContact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject?.trim() || '',
      message: message.trim(),
      ipAddress,
      userAgent
    });

    // TODO: Gửi email thông báo (optional)
    // await sendEmailNotification(result);

    return NextResponse.json({
      success: true,
      message: 'Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
      contactId: result.id
    }, { status: 201 });

  } catch (error) {
    console.error('Contact API Error:', error);
    
    return NextResponse.json(
      { error: 'Có lỗi xảy ra. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

// GET method để kiểm tra API hoạt động
export async function GET() {
  return NextResponse.json({
    message: 'Contact API is running',
    timestamp: new Date().toISOString()
  });
}