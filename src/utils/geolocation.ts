/**
 * Geolocation & Distance Calculation Utilities
 * Powers location-aware event prioritization for the User Portal.
 */

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface CityLocation {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export const KNOWN_CITIES: Record<string, CityLocation> = {
  Bengaluru: { name: 'Bengaluru', country: 'India', lat: 12.9716, lng: 77.5946 },
  Mumbai: { name: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777 },
  Delhi: { name: 'Delhi NCR', country: 'India', lat: 28.6139, lng: 77.209 },
  Anchorage: { name: 'Anchorage', country: 'USA', lat: 61.2181, lng: -149.9003 },
  Ketchikan: { name: 'Ketchikan', country: 'USA', lat: 55.3422, lng: -131.6461 },
  Sydney: { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  'San Francisco': { name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
  London: { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  Singapore: { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
};

/**
 * Computes great-circle distance between two GPS coordinates using the Haversine formula (km).
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Returns a human-friendly string for distance (e.g. "4.2 km away" or "Local Venue").
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 5) return 'Within 5 km · Local Venue';
  if (distanceKm < 50) return `${distanceKm} km away`;
  if (distanceKm < 1000) return `${distanceKm.toLocaleString()} km away`;
  return `${(distanceKm / 1000).toFixed(1)}k km away`;
}

/**
 * Identifies the closest recognized event city to a pair of coordinates.
 */
export function findNearestCity(
  coords: GeoCoordinates
): { city: string; distanceKm: number } {
  let nearestCity = 'Anchorage';
  let minDistance = Infinity;

  Object.values(KNOWN_CITIES).forEach((cityLoc) => {
    const dist = calculateDistance(coords.lat, coords.lng, cityLoc.lat, cityLoc.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = cityLoc.name;
    }
  });

  return { city: nearestCity, distanceKm: minDistance };
}

export interface UserLocationState {
  coords: GeoCoordinates | null;
  cityName: string;
  source: 'gps' | 'saved' | 'default';
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
}

/**
 * Requests the user's current live location via browser Geolocation API.
 */
export function requestUserLocation(): Promise<{
  coords: GeoCoordinates;
  nearestCity: string;
  distanceKm: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: GeoCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const { city, distanceKm } = findNearestCity(coords);
        resolve({ coords, nearestCity: city, distanceKm });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}
