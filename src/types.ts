export type Language = 'en' | 'ar';

export interface RSVPRecord {
  id: string;
  name: string;
  attending: 'yes' | 'no';
  guestCount: number;
  contact?: string;
  notes?: string;
  createdAt: string;
}

export interface GuestbookRecord {
  id: string;
  name: string;
  message: string;
  photoUrl?: string;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: string;
}

export interface AdminStats {
  rsvp: {
    confirmedCount: number;
    declinedCount: number;
    totalConfirmedGuests: number;
    totalResponses: number;
  };
  guestbook: {
    pendingCount: number;
    approvedCount: number;
    hiddenCount: number;
    totalNotes: number;
  };
}

export interface PolaroidPhoto {
  id: string;
  src: string;
  titleEn: string;
  titleAr: string;
  captionEn: string;
  captionAr: string;
  rotation: number;
  offsetY: number;
}
