export interface BookingData {
  service: string;
  date: string;
  time: string;
  phone: string;
  note?: string;
}

export interface ProfileData {
  userId: string;
  displayName: string;
  pictureUrl: string;
}

export interface ServiceOption {
  value: string;
  label: string;
  highlights: string[];
}

export interface BookingStatusItem {
  id: number;
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
