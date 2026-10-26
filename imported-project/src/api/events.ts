/**
 * Events API
 * Attempts to fetch event data from the Node.js / Express.js backend.
 * Falls back to local demonstration data when the backend is not reachable.
 */

import type { Event, EventCategory, ApiResponse } from '../types';
import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

// ─── Demonstration Data ───────────────────────────────────────────────────────
// Used only when the backend is not available.
// Replace with real API calls once the Express.js backend is running.

const DEMO_EVENTS: Event[] = [
  {
    id: 'evt-001',
    title: 'Midnight Frequencies – Live',
    description:
      'An atmospheric electronic music night featuring ambient, drum & bass, and deep house sets across two stages. Expect immersive visuals and a world-class sound system.',
    category: 'Concert',
    venue: 'The Warehouse, Mumbai',
    date: '2026-11-15T21:00:00+05:30',
    doorsOpenTime: '20:00',
    totalSeats: 800,
    availableSeats: 342,
    priceStartingFrom: 799,
    organizerId: 'org-01',
    status: 'published',
  },
  {
    id: 'evt-002',
    title: 'CloudCon 2026 – Tech & Innovation Summit',
    description:
      'The premier cloud computing conference in India. Three days of keynotes, workshops, and hands-on labs covering AWS, GCP, Azure, serverless architectures, and edge computing.',
    category: 'Conference',
    venue: 'HICC, Hyderabad',
    date: '2026-11-22T09:00:00+05:30',
    doorsOpenTime: '08:30',
    totalSeats: 2000,
    availableSeats: 1105,
    priceStartingFrom: 1499,
    organizerId: 'org-02',
    status: 'published',
  },
  {
    id: 'evt-003',
    title: 'IPL T20 – Deccan Chargers vs Mumbai Storm',
    description:
      'High-octane T20 cricket action at the iconic stadium. Witness top-class batting and bowling in this must-watch league fixture.',
    category: 'Sports',
    venue: 'Rajiv Gandhi International Cricket Stadium, Hyderabad',
    date: '2026-11-30T19:30:00+05:30',
    doorsOpenTime: '17:30',
    totalSeats: 55000,
    availableSeats: 12400,
    priceStartingFrom: 350,
    organizerId: 'org-03',
    status: 'live',
  },
  {
    id: 'evt-004',
    title: 'Hamlet – National Theatre Production',
    description:
      'A critically acclaimed modern staging of Shakespeare\'s Hamlet with a stellar ensemble cast, minimalist set design, and an original score composed for this production.',
    category: 'Theatre',
    venue: 'Prithvi Theatre, Mumbai',
    date: '2026-12-05T19:00:00+05:30',
    doorsOpenTime: '18:30',
    totalSeats: 360,
    availableSeats: 88,
    priceStartingFrom: 499,
    organizerId: 'org-04',
    status: 'published',
  },
  {
    id: 'evt-005',
    title: 'Sunburn Festival 2026',
    description:
      'Asia\'s biggest electronic dance music festival returns with 50+ international and domestic artists across 4 stages over 3 electrifying days in Goa.',
    category: 'Festival',
    venue: 'Vagator Beach, Goa',
    date: '2026-12-28T14:00:00+05:30',
    doorsOpenTime: '13:00',
    totalSeats: 30000,
    availableSeats: 18500,
    priceStartingFrom: 2499,
    organizerId: 'org-05',
    status: 'published',
  },
  {
    id: 'evt-006',
    title: 'Indie Roots – Acoustic Evening',
    description:
      'An intimate acoustic showcase featuring five emerging indie-folk artists in an up-close venue. Limited seats, great acoustics, and a warm community vibe.',
    category: 'Concert',
    venue: 'Blue Frog, Bangalore',
    date: '2026-11-20T19:30:00+05:30',
    doorsOpenTime: '19:00',
    totalSeats: 200,
    availableSeats: 45,
    priceStartingFrom: 299,
    organizerId: 'org-01',
    status: 'published',
  },
  {
    id: 'evt-007',
    title: 'DevOps & Kubernetes Masterclass',
    description:
      'A full-day intensive workshop on container orchestration, CI/CD pipelines, and Kubernetes deployment strategies. Hands-on lab environment included.',
    category: 'Conference',
    venue: 'ITC Grand, Bangalore',
    date: '2026-12-10T09:00:00+05:30',
    doorsOpenTime: '08:30',
    totalSeats: 150,
    availableSeats: 72,
    priceStartingFrom: 2999,
    organizerId: 'org-02',
    status: 'published',
  },
  {
    id: 'evt-008',
    title: 'Pro Wrestling Showdown – The Grand Slam',
    description:
      'WWE-style professional wrestling spectacle with high-flying acrobatics, theatrical storylines, and audience-interactive segments for the whole family.',
    category: 'Sports',
    venue: 'Indira Gandhi Arena, Delhi',
    date: '2026-12-20T18:00:00+05:30',
    doorsOpenTime: '17:00',
    totalSeats: 10000,
    availableSeats: 3800,
    priceStartingFrom: 599,
    organizerId: 'org-03',
    status: 'published',
  },
];

// ─── Events Service ───────────────────────────────────────────────────────────

export interface EventsFilters {
  category?: EventCategory;
  search?: string;
  status?: Event['status'];
}

/**
 * Fetches the event list from the backend.
 * Falls back to demonstration data if the backend is offline.
 * Returns both the events and a flag indicating whether demo data is being used.
 */
export async function fetchEvents(
  filters?: EventsFilters,
): Promise<{ events: Event[]; usingDemoData: boolean }> {
  // Build query string for backend request
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);

  const endpoint = `${API_ENDPOINTS.EVENTS.LIST}${params.toString() ? `?${params.toString()}` : ''}`;
  const result: ApiResponse<Event[]> = await apiClient.get<Event[]>(endpoint);

  if (result.success && Array.isArray(result.data) && result.data.length > 0) {
    return { events: result.data, usingDemoData: false };
  }

  // Backend unavailable or returned no data — use demonstration data
  let demoData = DEMO_EVENTS;
  if (filters?.category) {
    demoData = demoData.filter((e) => e.category === filters.category);
  }
  if (filters?.search) {
    const term = filters.search.toLowerCase();
    demoData = demoData.filter(
      (e) =>
        e.title.toLowerCase().includes(term) ||
        e.venue.toLowerCase().includes(term) ||
        e.description.toLowerCase().includes(term),
    );
  }
  return { events: demoData, usingDemoData: true };
}
