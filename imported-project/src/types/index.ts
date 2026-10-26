/**
 * Real-Time Ticket Booking System
 * Core TypeScript Definitions & Domain Models
 */

// User and Authentication Roles
export type UserRole = 'customer' | 'organizer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// Event Models
export type EventCategory = 'Concert' | 'Conference' | 'Sports' | 'Theatre' | 'Festival';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  venue: string;
  date: string;
  doorsOpenTime: string;
  totalSeats: number;
  availableSeats: number;
  priceStartingFrom: number;
  imageUrl?: string;
  organizerId: string;
  status: 'draft' | 'published' | 'live' | 'completed' | 'cancelled';
}

// Seat and Real-time Availability
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
  holdExpiresAt?: string; // ISO Timestamp for temporary hold expiration
}

// Booking and Transactions
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded';

export type PaymentOutcome = 'success' | 'failed' | 'pending';

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  seats: string[]; // List of Seat IDs
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentOutcome;
  paymentReference?: string;
  createdAt: string;
  expiresAt?: string; // Hold window expiration for checkout
}

// Digital Ticket & Verification
export interface DigitalTicket {
  ticketId: string;
  bookingId: string;
  eventId: string;
  eventTitle: string;
  venue: string;
  eventDate: string;
  seatInfo: string;
  attendeeName: string;
  qrCodeValue: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
  issuedAt: string;
}

// Real-Time Analytics & Organizer Statistics
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

// API Communication Interfaces
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

// Component & Layout Props
export interface LayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

export interface NavItem {
  label: string;
  path: string;
  badge?: string;
  roleRequired?: UserRole;
}
