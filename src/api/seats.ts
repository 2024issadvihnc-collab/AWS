/**
 * Seats API
 * Realistic auditorium seating grid adhering to the Cinematic Nightfall design system.
 */

import type { Seat, SeatTier, SeatStatus, Event, ApiResponse } from '../types';
import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export interface SeatRowDefinition {
  row: string;
  tier: SeatTier;
  seatsCount: number;
  section: string;
  price: number;
}

/**
 * Creates dynamic venue rows based on event pricing
 */
export function getVenueRowDefinitions(event: Event): SeatRowDefinition[] {
  const base = event.priceStartingFrom || 799;
  const vipPrice = event.ticketPackages?.find((p) => p.color === 'gold')?.price || Math.round(base * 3.5);
  const premiumPrice = event.ticketPackages?.find((p) => p.color === 'primary')?.price || Math.round(base * 1.6);
  const balconyPrice = base;

  return [
    { row: 'A', tier: 'VIP', seatsCount: 14, section: 'VIP Gold Lounge', price: vipPrice },
    { row: 'B', tier: 'VIP', seatsCount: 14, section: 'VIP Gold Lounge', price: vipPrice },
    { row: 'C', tier: 'Premium', seatsCount: 16, section: 'Premium Stalls', price: premiumPrice },
    { row: 'D', tier: 'Premium', seatsCount: 16, section: 'Premium Stalls', price: premiumPrice },
    { row: 'E', tier: 'Premium', seatsCount: 16, section: 'Premium Stalls', price: premiumPrice },
    { row: 'F', tier: 'Standard', seatsCount: 18, section: 'Standard Arena', price: Math.round(base * 1.2) },
    { row: 'G', tier: 'Standard', seatsCount: 18, section: 'Standard Arena', price: Math.round(base * 1.2) },
    { row: 'H', tier: 'Balcony', seatsCount: 18, section: 'Balcony Grandstand', price: balconyPrice },
    { row: 'J', tier: 'Balcony', seatsCount: 18, section: 'Balcony Grandstand', price: balconyPrice },
  ];
}

export function generateDemoSeats(event: Event): Seat[] {
  const seats: Seat[] = [];
  const definitions = getVenueRowDefinitions(event);

  let seed = 0;
  for (let i = 0; i < event.id.length; i++) {
    seed = (seed * 31 + event.id.charCodeAt(i)) % 10007;
  }

  definitions.forEach((rowDef) => {
    for (let num = 1; num <= rowDef.seatsCount; num++) {
      const seatId = `${event.id}-${rowDef.row}-${num}`;
      const seatHash = (seed + rowDef.row.charCodeAt(0) * 19 + num * 29) % 100;
      let status: SeatStatus = 'available';

      // Approximately 20% booked, 5% held
      if (seatHash < 20) {
        status = 'booked';
      } else if (seatHash >= 20 && seatHash < 26) {
        status = 'held';
      }

      seats.push({
        id: seatId,
        eventId: event.id,
        section: rowDef.section,
        row: rowDef.row,
        number: num,
        tier: rowDef.tier,
        price: rowDef.price,
        status,
      });
    }
  });

  return seats;
}

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
    // Fallback to client demo layout
  }

  return {
    seats: generateDemoSeats(event),
    usingDemoData: true,
  };
}
