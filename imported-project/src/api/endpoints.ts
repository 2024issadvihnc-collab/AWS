/**
 * API Endpoints Configuration
 * Matches the planned routes for the Node.js / Express.js backend.
 */

export const API_ENDPOINTS = {
  // Health & System
  HEALTH: '/health',
  
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  // Events
  EVENTS: {
    LIST: '/events',
    DETAIL: (id: string) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
  },

  // Seats & Real-time Availability
  SEATS: {
    LIST_BY_EVENT: (eventId: string) => `/events/${eventId}/seats`,
    HOLD: (eventId: string) => `/events/${eventId}/seats/hold`,
    RELEASE: (eventId: string) => `/events/${eventId}/seats/release`,
  },

  // Bookings & Payments
  BOOKINGS: {
    CREATE: '/bookings',
    DETAIL: (id: string) => `/bookings/${id}`,
    USER_BOOKINGS: '/bookings/my-bookings',
    CONFIRM_PAYMENT: (id: string) => `/bookings/${id}/pay`,
  },

  // Digital Tickets & Verification
  TICKETS: {
    MY_TICKETS: '/tickets',
    DETAIL: (ticketId: string) => `/tickets/${ticketId}`,
    VERIFY_QR: '/tickets/verify-qr',
  },

  // Organizer Dashboard
  ORGANIZER: {
    MY_EVENTS: '/organizer/events',
    STATS: (eventId: string) => `/organizer/events/${eventId}/stats`,
  },

  // Admin Dashboard
  ADMIN: {
    OVERVIEW: '/admin/overview',
    USERS: '/admin/users',
    SYSTEM_LOGS: '/admin/logs',
  },
} as const;
