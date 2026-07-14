'use client';
import React, { useCallback, useEffect, useState } from 'react';
// *อย่าลืม Import ฟังก์ชัน deleteBooking (หรือ cancelBooking) จาก service ของคุณ
import { getBookingStatus, deleteBooking, type BookingStatusItem } from '../../../services/bookingService';
import type { ProfileData } from './types';

interface BookingStatusProps {
  profile: ProfileData;
}

export default function BookingStatus({ profile }: BookingStatusProps) {
  const [bookingStatus, setBookingStatus] = useState<BookingStatusItem[]>([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  
  // State สำหรับเก็บ ID ของรายการที่กำลังถูกลบ
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatBookingDate = (value: string) => {
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return value;
    return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(parsedDate);
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'รอดำเนินการ';
      case 'CONFIRMED': return 'ยืนยันแล้ว';
      case 'COMPLETED': return 'เสร็จสิ้น';
      case 'CANCELLED': return 'ยกเลิกแล้ว';
      default: return status || 'ไม่ทราบสถานะ';
    }
  };

  const getStatusTone = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED': return 'status-pill status-confirmed';
      case 'COMPLETED': return 'status-pill status-completed';
      case 'CANCELLED': return 'status-pill status-cancelled';
      default: return 'status-pill status-pending';
    }
  };

  const loadBookingStatus = useCallback(async (lineUserId: string) => {
    setIsLoadingStatus(true);
    setStatusError(null);
    try {
      const items = await getBookingStatus(lineUserId);
      setBookingStatus(items);
    } catch (error) {
      setStatusError((error as Error).message || 'เกิดข้อผิดพลาดในการดึงสถานะการจอง');
      setBookingStatus([]);
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  // ฟังก์ชันสำหรับจัดการเมื่อกดปุ่มลบ
  const handleDelete = async (bookingId: string) => {
    // ถามเพื่อความแน่ใจก่อนลบ
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?')) {
      return;
    }

    setDeletingId(bookingId);
    setStatusError(null);

    try {
      // เรียก API ไปยัง Backend เพื่อลบข้อมูล
      await deleteBooking(bookingId);
      
      // เมื่อลบสำเร็จ ให้โหลดข้อมูลสถานะใหม่ล่าสุดมาแสดง
      if (profile.userId) {
        await loadBookingStatus(profile.userId);
      }
    } catch (error) {
      setStatusError((error as Error).message || 'เกิดข้อผิดพลาดในการยกเลิกการจอง');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!profile.userId) return;
    let isCancelled = false;
    queueMicrotask(() => {
      if (!isCancelled) {
        void loadBookingStatus(profile.userId);
      }
    });
    return () => { isCancelled = true; };
  }, [profile.userId, loadBookingStatus]);

  return (
    <div className="form-card">
      <div className="status-header">
        <div>
          <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>สถานะการจองของคุณ</h2>
          <p className="card-copy" style={{ margin: 0 }}>
            {profile.userId ? `LINE User ID: ${profile.userId}` : 'ระบบจะดึงข้อมูลเมื่อเข้าสู่ระบบ LINE แล้ว'}
          </p>
        </div>
        <button
          type="button"
          className="status-refresh-btn"
          onClick={() => profile.userId && void loadBookingStatus(profile.userId)}
          disabled={!profile.userId || isLoadingStatus || deletingId !== null}
        >
          {isLoadingStatus ? 'กำลังโหลด...' : 'รีเฟรช'}
        </button>
      </div>

      {statusError && <div className="alert">{statusError}</div>}
      {isLoadingStatus && <div className="alert">กำลังดึงสถานะการจอง...</div>}

      {!isLoadingStatus && profile.userId && bookingStatus.length === 0 && !statusError && (
        <div className="empty-state">ยังไม่มีรายการจองในระบบ</div>
      )}

      {!profile.userId && (
        <div className="empty-state">กรุณาเข้าสู่ระบบ LINE เพื่อดูสถานะการจอง</div>
      )}

      <div className="status-list">
        {bookingStatus.map((booking) => (
          <article key={booking.id} className="status-card">
            <div className="status-card-top">
              <div>
                <p className="status-card-service">{booking.service}</p>
                <p className="status-card-date">{formatBookingDate(booking.bookingDate)}</p>
              </div>
              <span className={getStatusTone(booking.status)}>
                {getStatusLabel(booking.status)}
              </span>
            </div>
            <div className="status-card-meta">
              <span>เบอร์ {booking.phone}</span>
              <span>รหัส: {booking.id}</span>
            </div>
            {booking.note && <p className="status-card-note">{booking.note}</p>}
            
            {/* ปุ่มยกเลิกการจอง (แสดงเฉพาะตอนที่สถานะยังเป็น PENDING) */}
            {booking.status.toUpperCase() === 'PENDING' && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => handleDelete(booking.id)}
                  disabled={deletingId === booking.id}
                  style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #f87171',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.4rem',
                    fontSize: '0.875rem',
                    cursor: deletingId === booking.id ? 'not-allowed' : 'pointer',
                    opacity: deletingId === booking.id ? 0.7 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  {deletingId === booking.id ? 'กำลังยกเลิก...' : 'ยกเลิกการจอง'}
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}