import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '');

  if (!backendBaseUrl) {
    return NextResponse.json(
      {
        success: false,
        message: 'ไม่ได้ตั้งค่า NEXT_PUBLIC_BACKEND_URL',
      },
      { status: 503 }
    );
  }

  // ส่งไปที่ Go Backend (สังเกตว่าใช้ /api/bookings มี s)
  const response = await fetch(`${backendBaseUrl}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json',
    },
  });
}

export async function GET(request: NextRequest) {
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '');

  if (!backendBaseUrl) {
    return NextResponse.json(
      {
        success: false,
        message: 'ไม่ได้ตั้งค่า NEXT_PUBLIC_BACKEND_URL',
      },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const lineUserId = searchParams.get('lineUserId');
  const statusUrl = new URL(`${backendBaseUrl}/api/bookings`);

  if (lineUserId) {
    statusUrl.searchParams.set('lineUserId', lineUserId);
  }

  const response = await fetch(statusUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json',
    },
  });
}

export async function DELETE(request: NextRequest) {
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '');

  if (!backendBaseUrl) {
    return NextResponse.json(
      { success: false, message: 'ไม่ได้ตั้งค่า NEXT_PUBLIC_BACKEND_URL' },
      { status: 503 }
    );
  }

  // ดึง ID จาก URL Parameter (เช่น /api/booking?id=FIL-20260713-1234)
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get('id');

  if (!bookingId) {
    return NextResponse.json(
      { success: false, message: 'กรุณาระบุรหัสการจองที่ต้องการยกเลิก' },
      { status: 400 }
    );
  }

  // ส่งต่อไปหา Go Backend (ต้องใช้ /api/bookings/:id ตามที่ตั้งไว้ในฝั่ง Go)
  const response = await fetch(`${backendBaseUrl}/api/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  const responseBody = await response.text();

  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') ?? 'application/json',
    },
  });
}