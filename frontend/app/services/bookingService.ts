export interface BookingData {
  service: string;
  date: string;
  time: string;
  phone: string;
  note?: string;
}

export interface BookingRequest extends BookingData {
  lineUserId: string;
  displayName: string;
  bookingDate: string;
}

export interface BookingStatusItem {
  id: string;
  service: string;
  bookingDate: string;
  status: string;
  phone: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingStatusResponse {
  success: boolean;
  data: BookingStatusItem[];
  message?: string;
}

const BOOKING_API_URL = '/api/booking';

export async function createBooking(data: BookingRequest) {
  const response = await fetch(BOOKING_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || 'ไม่สามารถส่งคำขอได้ ขอลองใหม่อีกครั้ง');
  }

  return response.json();
}

export async function getBookingStatus(lineUserId: string): Promise<BookingStatusItem[]> {
  const response = await fetch(`/api/booking?lineUserId=${encodeURIComponent(lineUserId)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const responseText = await response.text();
  let payload: BookingStatusResponse | null = null;

  try {
    payload = responseText ? (JSON.parse(responseText) as BookingStatusResponse) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || responseText || 'ไม่สามารถดึงสถานะการจองได้');
  }

  return payload?.data ?? [];
}

export const deleteBooking = async (bookingId: string) => {
 
  const response = await fetch(`/api/booking?id=${encodeURIComponent(bookingId)}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'ไม่สามารถยกเลิกการจองได้');
  }
  
  return response.json();
};