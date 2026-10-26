/**
 * REST API Endpoint Constants
 */

export const API_ENDPOINTS = {
  EVENTS: {
    LIST: '/api/events',
    DETAIL: (id: string) => `/api/events/${id}`,
  },
  SEATS: {
    LIST_BY_EVENT: (eventId: string) => `/api/events/${eventId}/seats`,
    HOLD: '/api/seats/hold',
    RELEASE: '/api/seats/release',
  },
  BOOKINGS: {
    CREATE: '/api/bookings',
    LIST: '/api/bookings',
    DETAIL: (id: string) => `/api/bookings/${id}`,
    CHECK_IN: (id: string) => `/api/bookings/${id}/check-in`,
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
  },
  HEALTH: '/api/health',
} as const;

export default API_ENDPOINTS;
