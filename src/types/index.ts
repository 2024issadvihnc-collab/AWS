/**
 * Real-Time Ticket Booking System
 * Core TypeScript Definitions & Domain Models
 * Aligned with the Cinematic Nightfall Design System
 */

export type UserRole = 'customer' | 'organizer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type EventCategory =
  | 'AI & Chatbots'
  | 'Modern Marketing'
  | 'Workshops'
  | 'Creative Tech'
  | 'Deep Tech & ML'
  | 'Global Pavilion'
  | 'Music Festival'
  | 'Conference'
  | 'Concert'
  | 'EDM'
  | 'Jazz & Soul'
  | 'Orchestra'
  | 'Sports'
  | 'Theatre';

export interface ArtistLineupItem {
  id: string;
  name: string;
  role: string;
  genre: string;
  setTime?: string;
  stage?: string;
}

export interface TicketPackageTier {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  perks: string[];
  isPopular?: boolean;
  color?: 'primary' | 'gold' | 'neutral' | 'purple' | 'cyan' | 'fuchsia';
}

export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: EventCategory;
  badgeLabel?: string;
  badgeColor?: 'indigo' | 'blue' | 'purple' | 'violet' | 'fuchsia' | 'emerald' | 'cyan' | 'amber';
  venue: string;
  city: string;
  coordinates?: { lat: number; lng: number };
  date: string;
  timeRange?: string;
  doorsOpenTime: string;
  totalSeats: number;
  availableSeats: number;
  priceStartingFrom: number;
  imageUrl?: string;
  organizerId: string;
  status: 'draft' | 'published' | 'live' | 'completed' | 'cancelled';
  lineup?: ArtistLineupItem[];
  ticketPackages?: TicketPackageTier[];
  audioSpecs?: string[];
  venueInfo?: {
    arenaName: string;
    city: string;
    gatesEntry: string;
    parking: string;
    publicTransit: string;
  };
  faqs?: { q: string; a: string }[];
}

export type SeatStatus = 'available' | 'held' | 'booked' | 'maintenance';
export type SeatTier = 'VIP' | 'Premium' | 'Standard' | 'Balcony';

export interface Seat {
  id: string;
  eventId: string;
  section: string;
  row: string;
  number: number;
  tier: SeatTier;
  price: number;
  status: SeatStatus;
  heldByUserId?: string;
  holdExpiresAt?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded';
export type PaymentOutcome = 'success' | 'failed' | 'pending';

export interface Booking {
  id: string;
  bookingRef: string;
  eventId: string;
  eventTitle: string;
  eventVenue: string;
  eventDate: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  seats: Seat[];
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentOutcome;
  paymentMethod: string;
  deliveryPreference: 'mobile-pass' | 'pdf-pass';
  qrCodeValue: string;
  gateEntry: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  createdAt: string;
}

export interface DigitalTicket {
  ticketId: string;
  bookingId: string;
  eventId: string;
  eventTitle: string;
  venue: string;
  eventDate: string;
  seatInfo: string;
  tier: string;
  attendeeName: string;
  qrCodeValue: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  issuedAt: string;
  gate: string;
}

export interface EventRealtimeStats {
  eventId: string;
  totalCapacity: number;
  availableCount: number;
  heldCount: number;
  bookedCount: number;
  occupancyPercentage: number;
  grossRevenue: number;
  checkInCount: number;
  lastUpdated: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface ApiHealthStatus {
  status: 'healthy' | 'degraded' | 'offline';
  version: string;
  timestamp: string;
  uptime: number;
}
