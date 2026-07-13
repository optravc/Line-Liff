'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import liff from '@line/liff';
import type { ProfileData } from './types';
import { defaultProfile } from './serviceOptions';

// Import 2 Component ที่เราแยกไว้
import BookingForm from './BookingForm';
import BookingStatus from './BookingStatus';

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<'booking' | 'status'>('booking');
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const initializeLiff = async () => {
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!liffId) throw new Error('NEXT_PUBLIC_LIFF_ID is not set');

        await liff.init({ liffId, withLoginOnExternalBrowser: true });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const lineProfile = await liff.getProfile();
        if (isMounted) {
          setProfile({
            userId: lineProfile.userId || '',
            displayName: lineProfile.displayName || defaultProfile.displayName,
            pictureUrl: lineProfile.pictureUrl || defaultProfile.pictureUrl,
          });
        }
      } catch (error) {
        console.error('LIFF initialization failed:', error);
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    };

    initializeLiff();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="booking-shell">
      <main className="container">
        <div className="section-title" style={{ marginBottom: '1.25rem' }}>
          <p className="text-sm" style={{ color: '#8ca36b', fontWeight: 700, marginBottom: '0.75rem' }}>
            จองคิวสะดวกผ่าน LINE
          </p>
        </div>

        <div className="booking-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'booking'}
            className={`booking-tab ${activeTab === 'booking' ? 'booking-tab-active' : ''}`}
            onClick={() => setActiveTab('booking')}
          >
            จองคิว
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'status'}
            className={`booking-tab ${activeTab === 'status' ? 'booking-tab-active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            ดูสถานะการจอง
          </button>
        </div>

        <div className="booking-panel">
          <div className="profile-card">
            <div className="profile-badge">
              <Image src={profile.pictureUrl} alt="Profile" width={72} height={72} />
            </div>
            <div className="profile-info">
              <p className="profile-label">ชื่อผู้ใช้</p>
              <p className="profile-name">{isLoadingProfile ? 'กำลังโหลด...' : profile.displayName}</p>
            </div>
          </div>

          {/* สลับการแสดงผลตาม Tab ที่เลือก */}
          {activeTab === 'booking' ? (
            <BookingForm profile={profile} />
          ) : (
            <BookingStatus profile={profile} />
          )}
        </div>
      </main>
    </div>
  );
}