/**
 * Seats API
 * Targets upcoming Node.js & Express.js route: GET /events/:eventId/seats
 * Falls back to structured demonstration seating layout when the backend is offline.
 */

import type { Seat, SeatTier, SeatStatus, Event, ApiResponse } from '../types';
import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export interface SeatRowDefinition {
  row: string;
  tier: SeatTier;
  priceMultiplier: number;
  seatsCount: number;
  section: string;
}

const DEFAULT_SEATING_LAYOUT: SeatRowDefinition[] = [
  { row: 'A', tier: 'VIP', priceMultiplier: 2.0, seatsCount: 10, section: 'VIP Section' },
  { row: 'B', tier: 'VIP', priceMultiplier: 2.0, seatsCount: 10, section: 'VIP Section' },
  { row: 'C', tier: 'Premium', priceMultiplier: 1.5, seatsCount: 12, section: 'Premium Stalls' },
  { row: 'D', tier: 'Premium', priceMultiplier: 1.5, seatsCount: 12, section: 'Premium Stalls' },
  { row: 'E', tier: 'Premium', priceMultiplier: 1.5, seatsCount: 12, section: 'Premium Stalls' },
  { row: 'F', tier: 'Standard', priceMultiplier: 1.0, seatsCount: 12, section: 'Standard Arena' },
  { row: 'G', tier: 'Standard', priceMultiplier: 1.0, seatsCount: 12, section: 'Standard Arena' },
  { row: 'H', tier: 'Standard', priceMultiplier: 1.0, seatsCount: 12, section: 'Standard Arena' },
  { row: 'J', tier: 'Standard', priceMultiplier: 1.0, seatsCount: 12, section: 'Standard Arena' },
];

/**
 * Generates deterministic demonstration seats for an event.
 * Gives a realistic mix of available, booked, and held seats.
 */
export function generateDemoSeats(event: Event): Seat[] {
  const seats: Seat[] = [];
  const basePrice = event.priceStartingFrom || 500;

  // Simple deterministic hash based on event ID to give consistent booked seats
  let seed = 0;
  for (let i = 0; i < event.id.length; i++) {
    seed = (seed * 31 + event.id.charCodeAt(i)) % 10007;
  }

  DEFAULT_SEATING_LAYOUT.forEach((rowDef) => {
    const tierPrice = Math.round(basePrice * rowDef.priceMultiplier);

    for (let num = 1; num <= rowDef.seatsCount; num++) {
      const seatId = `${event.id}-${rowDef.row}-${num}`;
      
      // Deterministic unavailable seat placement (~25% unavailable)
      const seatHash = (seed + rowDef.row.charCodeAt(0) * 17 + num * 23) % 10;
      let status: SeatStatus = 'available';

      if (seatHash === 0 || seatHash === 3) {
        status = 'booked';
      } else if (seatHash === 7 && rowDef.tier !== 'VIP') {
        status = 'held';
      }

      seats.push({
        id: seatId,
        eventId: event.id,
        section: rowDef.section,
        row: rowDef.row,
        number: num,
        tier: rowDef.tier,
        price: tierPrice,
        status,
      });
    }
  });

  return seats;
}

/**
 * Fetches seats for an event from the Node.js/Express backend,
 * or falls back to demonstration seats when the backend is offline.
 */
export async function fetchSeatsForEvent(
  event: Event,
): Promise<{ seats: Seat[]; usingDemoData: boolean }> {
  try {
    const endpoint = API_ENDPOINTS.SEATS.LIST_BY_EVENT(event.id);
    const result: ApiResponse<Seat[]> = await apiClient.get<Seat[]>(endpoint);

    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
      return { seats: result.data, usingDemoData: false };
    }
  } catch {
    // Backend offline, fallback to demo data below
  }

  return {
    seats: generateDemoSeats(event),
    usingDemoData: true,
  };
}
