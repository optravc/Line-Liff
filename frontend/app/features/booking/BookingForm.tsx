'use client';
import React, { useState, type ChangeEvent } from 'react';
import { createBooking, type BookingRequest } from '../../../services/bookingService';
import type { BookingData, ProfileData } from './types';
import { serviceOptions } from './serviceOptions';

interface BookingFormProps {
  profile: ProfileData;
  onSuccess?: () => void;
}

export default function BookingForm({ profile, onSuccess }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingData>({
    service: '',
    date: '',
    time: '',
    phone: '',
    note: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);

  const selectedService = serviceOptions.find((service) => service.value === formData.service);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (highlight: string) => {
    setSelectedDetails((prev) =>
      prev.includes(highlight) ? prev.filter((item) => item !== highlight) : [...prev, highlight]
    );
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage(null);
    setSubmitError(null);

    if (!formData.service || !formData.date || !formData.time || !formData.phone) {
      setSubmitError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (!profile.userId) {
      setSubmitError('ไม่สามารถอ่านข้อมูล LINE ได้ โปรดลองใหม่อีกครั้ง');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingDate = `${formData.date}T${formData.time}`;
      const detailsText = selectedDetails.length > 0 ? `ระบุรายละเอียด: ${selectedDetails.join(', ')}` : '';
      const noteWithDetails = formData.note
        ? `${detailsText}\n\nหมายเหตุเพิ่มเติม: ${formData.note}`
        : detailsText;

      const note = noteWithDetails || formData.note || '';
      const payload: BookingRequest = {
        lineUserId: profile.userId,
        displayName: profile.displayName,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        phone: formData.phone,
        note: note || undefined,
        bookingDate,
      };
      
      const data = await createBooking(payload);
      setSubmitMessage(`จองคิวสำเร็จ! รหัสการจอง: ${data.data.id}`);
      setFormData({ service: '', date: '', time: '', phone: '', note: '' });
      setSelectedDetails([]);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      setSubmitError((error as Error).message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="section-title" style={{ marginBottom: '1rem' }}>
        จองคิว
      </h2>
      {submitError && <div className="alert">{submitError}</div>}
      {submitMessage && (
        <div className="alert" style={{ background: '#e7f7eb', borderColor: '#b9ddb6', color: '#28622c' }}>
          {submitMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="field-group">
        <div className="field-group">
          <label htmlFor="service" className="field-label">บริการที่ต้องการ</label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="field-select"
          >
            <option value="">-- เลือกบริการ --</option>
            {serviceOptions.map((service) => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <div className="field-label" aria-live="polite">รายละเอียด</div>
          <div
            className="field-detail-card"
            style={{
              padding: '0.95rem 1rem',
              borderRadius: '0.9rem',
              background: '#f6fbef',
              border: '1px solid #dce9c8',
              color: '#3f5329',
            }}
          >
            {selectedService ? (
              <>
                <p style={{ margin: '0 0 0.5rem', fontWeight: 700, color: '#27431f' }}>
                  {selectedService.label}
                </p>
                <p style={{ margin: '0 0 0.75rem', lineHeight: 1.6 }}>
                  เลือกประเภทบริการหรือวัสดุที่ต้องการ:
                </p>
                <ul style={{ margin: 0, paddingLeft: '1rem', lineHeight: 1.7, listStyle: 'none' }}>
                  {selectedService.highlights.map((highlight) => (
                    <li key={highlight} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        id={`detail-${highlight}`}
                        checked={selectedDetails.includes(highlight)}
                        onChange={() => handleDetailChange(highlight)}
                        style={{ marginTop: '0.25rem', cursor: 'pointer' }}
                      />
                      <label htmlFor={`detail-${highlight}`} style={{ cursor: 'pointer', flex: 1 }}>
                        {highlight}
                      </label>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p style={{ margin: 0, color: '#6c757d' }}>
                เลือกบริการเพื่อดูรายละเอียดเพิ่มเติม
              </p>
            )}
          </div>
        </div>

        <div className="grid-2">
          <div className="field-group">
            <label htmlFor="date" className="field-label">วันที่</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="field-input"
            />
          </div>
          <div className="field-group">
            <label htmlFor="time" className="field-label">เวลา</label>
            <input
              id="time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="field-input"
            />
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="phone" className="field-label">เบอร์โทรศัพท์ติดต่อ</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="08X-XXX-XXXX"
            className="field-input"
          />
        </div>

        <div className="field-group">
          <label htmlFor="note" className="field-label">หมายเหตุ (ถ้ามี)</label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={4}
            placeholder="เช่น ปวดฟันมาก, แพ้ยา..."
            className="field-textarea"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'กำลังส่ง...' : 'ยืนยันการจองคิว'}
        </button>
      </form>
    </div>
  );
}