/**
 * Events API & Curated Conference / Spectacle Database
 * Provides realistic domain data matching the Motivec Conference & Events colorful design system
 * with geographical coordinates for live proximity sorting.
 */

import type { Event } from '../types';
import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

export const CURATED_EVENTS: Event[] = [
  {
    id: 'evt-chatbots-ai',
    title: 'Chatbots And Virtual Assistants',
    subtitle: 'Conversational AI architectures, multi-agent frameworks, and autonomous customer interfaces.',
    description:
      'Join leading engineers and machine intelligence architects exploring real-world production deployments of large language model agent workflows, multimodal neural chatbots, and next-generation conversational interfaces.',
    category: 'AI & Chatbots',
    badgeLabel: 'IMMUNITY',
    badgeColor: 'indigo',
    venue: '4821 Ridge Top Cir, Anchorage',
    city: 'Anchorage',
    coordinates: { lat: 61.2181, lng: -149.9003 },
    date: '2026-11-15T10:00:00-08:00',
    timeRange: '15 Nov 2026, 10:00 AM – 5:30 PM',
    doorsOpenTime: '09:00',
    totalSeats: 360,
    availableSeats: 142,
    priceStartingFrom: 1499,
    imageUrl: '/assets/events/card-speaker-podium.jpg',
    organizerId: 'org-motivec',
    status: 'live',
    audioSpecs: ['Spatial Keynote Audio', 'Interactive Q&A Mics', 'Simultaneous Multi-language Translation'],
    lineup: [
      { id: 'spk-1', name: 'Dr. Evelyn Vance', role: 'Keynote Speaker', genre: 'Autonomous LLM Agents', setTime: '10:15 AM - 11:30 AM', stage: 'Plenary Stage A' },
      { id: 'spk-2', name: 'Marcus Sterling', role: 'Panel Moderator', genre: 'Enterprise AI Governance', setTime: '11:45 AM - 01:00 PM', stage: 'Plenary Stage A' },
      { id: 'spk-3', name: 'Alina Zhao', role: 'Workshop Lead', genre: 'Prompt Engineering & Tools', setTime: '02:00 PM - 03:30 PM', stage: 'Lab Pavilion 2' },
      { id: 'spk-4', name: 'David Kim', role: 'Closing Speaker', genre: 'Voice AI & Real-time TTS', setTime: '04:00 PM - 05:15 PM', stage: 'Plenary Stage A' },
    ],
    ticketPackages: [
      {
        id: 'pkg-vip',
        name: 'VIP Executive Pass',
        description: 'Reserved front-row seating, private VIP networking lounge & catered lunch with speakers.',
        price: 3499,
        available: true,
        perks: ['VIP Lounge Fast Track Entry', 'Private Speaker Lunch', 'All Keynote Recordings', 'Exclusive Swag Kit'],
        isPopular: true,
        color: 'purple',
      },
      {
        id: 'pkg-std',
        name: 'Full Conference Pass',
        description: 'Complete plenary hall access, breakout workshops, and exhibitor showcase.',
        price: 1999,
        available: true,
        perks: ['Plenary Hall Access', 'Interactive Workshops', 'Exhibition Floor Entry'],
        color: 'primary',
      },
      {
        id: 'pkg-student',
        name: 'Academic / Builder Tier',
        description: 'General gallery seating with live stream archive access.',
        price: 1499,
        available: true,
        perks: ['Gallery Seating', 'Digital Session Slides', 'Community Discord Access'],
        color: 'cyan',
      },
    ],
    venueInfo: {
      arenaName: 'Grand Horizon Convention Center',
      city: 'Anchorage',
      gatesEntry: 'VIP badge holders enter through North Executive Turnstile 01. General attendees use West Concourse Turnstiles 02-04.',
      parking: 'Reserved Executive P1 garage with EV charging. Public garage P2 accessible via Ridge Top Circle.',
      publicTransit: 'Express Metro Shuttle runs every 8 minutes from Downtown Transit Center directly to the lobby.',
    },
    faqs: [
      { q: 'Will session slides and code repositories be shared?', a: 'Yes! All registered attendees receive access to the digital knowledge base containing full slide decks, audio transcripts, and notebook demos.' },
      { q: 'Are meals and refreshments provided during the day?', a: 'All ticket holders receive artisan barista coffee and refreshment breaks. Full lunch is included with Executive and Full Conference passes.' },
      { q: 'Can I transfer my pass to a colleague?', a: 'Passes can be easily transferred through the Digital Ticket portal up to 12 hours prior to opening registration.' },
    ],
  },
  {
    id: 'evt-marketing-summit',
    title: 'Modern Marketing Summit Sydney',
    subtitle: 'Growth loops, performance omnichannel marketing, and brand resonance in the generative era.',
    description:
      'The Southern Hemisphere’s leading gathering of Chief Marketing Officers, creative directors, and performance growth engineers dissecting viral campaigns, retention economics, and algorithmic audience targeting.',
    category: 'Modern Marketing',
    badgeLabel: 'SKIN QUALITY',
    badgeColor: 'blue',
    venue: '4821 Ride Top, Sydney Convention Precinct',
    city: 'Sydney',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    date: '2026-11-20T09:30:00+10:00',
    timeRange: '20 Nov 2026, 9:30 AM – 6:00 PM',
    doorsOpenTime: '08:30',
    totalSeats: 320,
    availableSeats: 98,
    priceStartingFrom: 1899,
    imageUrl: '/assets/events/card-marketing-summit.jpg',
    organizerId: 'org-motivec',
    status: 'published',
    audioSpecs: ['Dolby Atmos Keynote Rig', 'Fireside Discussion Microphones', 'Live Stream Multi-cam Broadcast'],
    ticketPackages: [
      { id: 'mkt-vip', name: 'VIP Growth Council', description: 'Front-row banquet seating with CMO private roundtable.', price: 3899, available: true, perks: ['Private CMO Roundtable', 'Premium Networking Dinner'], color: 'gold' },
      { id: 'mkt-del', name: 'Delegate Pass', description: 'Access to all main stages and masterclass breakout rooms.', price: 1899, available: true, perks: ['Main Stage Access', 'Masterclasses'], color: 'primary' },
    ],
    venueInfo: {
      arenaName: 'Sydney Convention Center',
      city: 'Sydney',
      gatesEntry: 'Gate 04 Harbour Promenade Entrance.',
      parking: 'Darling Harbour P3 Underground Parking.',
      publicTransit: 'Light Rail direct to Convention Station.',
    },
  },
  {
    id: 'evt-opening-workshop',
    title: 'Registration For Opening Workshop',
    subtitle: 'Hands-on architectural deep dive and collaborative product prototyping workshop.',
    description:
      'An intensive, interactive 1-day masterclass bringing together cross-functional teams to build, stress-test, and deploy production software patterns under the guidance of industry principal architects.',
    category: 'Workshops',
    badgeLabel: 'CONCENTRATION',
    badgeColor: 'purple',
    venue: '912 Park Ave, Ketchikan Tech Hub',
    city: 'Ketchikan',
    coordinates: { lat: 55.3422, lng: -131.6461 },
    date: '2026-11-21T09:00:00-08:00',
    timeRange: '21 Nov 2026, 9:00 AM – 4:00 PM',
    doorsOpenTime: '08:30',
    totalSeats: 180,
    availableSeats: 42,
    priceStartingFrom: 1299,
    imageUrl: '/assets/events/card-opening-workshop.jpg',
    organizerId: 'org-motivec',
    status: 'published',
    ticketPackages: [
      { id: 'ws-full', name: 'Interactive Workshop Pass', description: 'Table seat with power, dedicated mentor, and certificate.', price: 1299, available: true, perks: ['Hands-on Lab Bench', '1-on-1 Code Review', 'Certificate of Completion'], color: 'purple' },
    ],
    venueInfo: {
      arenaName: 'Ketchikan Innovation Pavilion',
      city: 'Ketchikan',
      gatesEntry: 'East Lab Turnstiles A & B.',
      parking: 'Park Ave Public Lot.',
      publicTransit: 'Downtown Ketchikan Loop Transit.',
    },
  },
  {
    id: 'evt-immersive-cultural',
    title: 'How Immersive is Revitalising The Cultural Scene',
    subtitle: 'Spatial computing, mixed reality exhibitions, and digital museum curation.',
    description:
      'Discover how world-renowned cultural institutions and creative technologists are deploying generative art, projection mapping, and spatial audio to transform the museum and entertainment experience.',
    category: 'Creative Tech',
    badgeLabel: 'IMMUNITY',
    badgeColor: 'blue',
    venue: '4821 Ridge Top Cir, Anchorage',
    city: 'Anchorage',
    coordinates: { lat: 61.2181, lng: -149.9003 },
    date: '2026-11-25T11:00:00-08:00',
    timeRange: '25 Nov 2026, 11:00 AM – 7:00 PM',
    doorsOpenTime: '10:30',
    totalSeats: 260,
    availableSeats: 85,
    priceStartingFrom: 1199,
    imageUrl: '/assets/events/card-immersive-screen.jpg',
    organizerId: 'org-motivec',
    status: 'published',
    ticketPackages: [
      { id: 'imm-vip', name: 'VIP Gallery Experience', description: 'Exclusive after-hours walkthrough and meet-the-artist cocktail.', price: 2899, available: true, perks: ['After-hours Private Viewing', 'Artist Meet & Greet'], color: 'fuchsia' },
      { id: 'imm-gen', name: 'General Admission', description: 'Full access to exhibition halls and keynote stage.', price: 1199, available: true, perks: ['Main Hall Access', 'Interactive VR Demos'], color: 'primary' },
    ],
    venueInfo: {
      arenaName: 'Alaska Center for the Performing Arts',
      city: 'Anchorage',
      gatesEntry: 'North Galleria Main Atrium.',
      parking: 'City Hall 5th Ave Garage.',
      publicTransit: 'People Mover Lines 10 & 20.',
    },
  },
  {
    id: 'evt-ml-night',
    title: 'Machine Learning Night Fastaily Part 2',
    subtitle: 'Production inference benchmarks, speculative decoding, and model distillation.',
    description:
      'Fast-paced technical lightning talks followed by deep architectural debates on optimizing GPU clusters, low-latency edge inference, and state space models in production.',
    category: 'Deep Tech & ML',
    badgeLabel: 'STAMINA',
    badgeColor: 'indigo',
    venue: '2438 6th Ave, Ketchikan',
    city: 'Ketchikan',
    coordinates: { lat: 55.3422, lng: -131.6461 },
    date: '2026-11-28T18:00:00-08:00',
    timeRange: '28 Nov 2026, 6:00 PM – 10:30 PM',
    doorsOpenTime: '17:30',
    totalSeats: 220,
    availableSeats: 34,
    priceStartingFrom: 999,
    imageUrl: '/assets/events/card-ml-night.jpg',
    organizerId: 'org-motivec',
    status: 'live',
    ticketPackages: [
      { id: 'ml-pass', name: 'Engineers Ticket', description: 'Full evening pass including craft beers and lightning talk track.', price: 999, available: true, perks: ['All Technical Talks', 'Networking Mixer', 'Fastaily Tech Pack'], color: 'primary' },
    ],
    venueInfo: {
      arenaName: 'Ketchikan Waterfront Stage',
      city: 'Ketchikan',
      gatesEntry: 'Dockside Fast Turnstiles.',
      parking: 'Harbour Marina Parking.',
      publicTransit: 'Ferry Terminal Shuttle.',
    },
  },
  {
    id: 'evt-partner-pavilion',
    title: 'Our excellent partner France Pavilion',
    subtitle: 'European bilateral tech partnerships, aerospace innovation, and creative startups.',
    description:
      'A prestigious diplomatic and industrial pavilion highlighting pioneering collaborations across green energy, aerospace, fashion-tech, and European venture capital.',
    category: 'Global Pavilion',
    badgeLabel: 'CONFERENCE',
    badgeColor: 'purple',
    venue: '156 Michael Ct #4, Anchorage',
    city: 'Anchorage',
    coordinates: { lat: 61.2181, lng: -149.9003 },
    date: '2026-12-02T10:00:00-08:00',
    timeRange: '02 Dec 2026, 10:00 AM – 5:00 PM',
    doorsOpenTime: '09:30',
    totalSeats: 300,
    availableSeats: 120,
    priceStartingFrom: 1599,
    imageUrl: '/assets/events/card-audience-applause.jpg',
    organizerId: 'org-motivec',
    status: 'published',
    ticketPackages: [
      { id: 'fp-all', name: 'Pavilion Day Pass', description: 'Access to bilateral pitch arenas and evening diplomatic networking reception.', price: 1599, available: true, perks: ['Pitch Sessions Access', 'B2B Lounge Access', 'Champagne Reception'], color: 'primary' },
    ],
    venueInfo: {
      arenaName: 'Dena\'ina Civic Center',
      city: 'Anchorage',
      gatesEntry: 'West Street Main Doors.',
      parking: 'Civic Center P1 Lot.',
      publicTransit: 'Transit Center 4-min walk.',
    },
  },
  {
    id: 'evt-bengaluru-ai',
    title: 'Bengaluru Generative AI & Cloud Summit',
    subtitle: 'Autonomous agents, foundational models, and hyperscale cloud infrastructure.',
    description:
      'India’s premier gathering of AI researchers, engineering founders, and cloud architects at Bengaluru’s landmark Phoenix Arena. Featuring deep technical keynotes and live architectural stress-testing demonstrations.',
    category: 'AI & Chatbots',
    badgeLabel: 'IMMUNITY',
    badgeColor: 'indigo',
    venue: 'Phoenix Arena, Whitefield, Bengaluru',
    city: 'Bengaluru',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    date: '2026-12-08T09:30:00+05:30',
    timeRange: '08 Dec 2026, 9:30 AM – 6:30 PM',
    doorsOpenTime: '08:30',
    totalSeats: 480,
    availableSeats: 210,
    priceStartingFrom: 1299,
    imageUrl: '/assets/events/card-speaker-podium.jpg',
    organizerId: 'org-motivec',
    status: 'live',
    audioSpecs: ['L-Acoustics K3 Array', 'Live Q&A CatchBox', 'Simultaneous Hindi & English Stream'],
    ticketPackages: [
      { id: 'blr-vip', name: 'VIP Executive Pass', description: 'Front rows, speaker lounge & lunch', price: 3499, available: true, perks: ['VIP Lounge', 'Speaker Lunch', 'Recordings'], color: 'purple' },
      { id: 'blr-full', name: 'General Delegate', description: 'Full hall access and workshops', price: 1299, available: true, perks: ['Keynotes', 'Workshops'], color: 'primary' },
    ],
    venueInfo: {
      arenaName: 'Phoenix Arena & Expo Center',
      city: 'Bengaluru',
      gatesEntry: 'Turnstiles 01-04 Main Concourse.',
      parking: 'Phoenix P2 Multi-level Parking with EV chargers.',
      publicTransit: 'Namma Metro Purple Line (Garudacharpalya Station).',
    },
  },
  {
    id: 'evt-sf-frontier',
    title: 'San Francisco Frontier Compute Symposium',
    subtitle: 'Silicon architectures, chip interconnects, and distributed GPU superclusters.',
    description:
      'Join pioneering systems architects and semiconductor leaders in San Francisco dissecting liquid cooling at scale, optical interconnects, and cluster topology designs.',
    category: 'Deep Tech & ML',
    badgeLabel: 'STAMINA',
    badgeColor: 'blue',
    venue: 'Moscone Center, San Francisco',
    city: 'San Francisco',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    date: '2026-12-14T09:00:00-08:00',
    timeRange: '14 Dec 2026, 9:00 AM – 5:00 PM',
    doorsOpenTime: '08:00',
    totalSeats: 400,
    availableSeats: 164,
    priceStartingFrom: 2299,
    imageUrl: '/assets/events/card-marketing-summit.jpg',
    organizerId: 'org-motivec',
    status: 'published',
    ticketPackages: [
      { id: 'sf-vip', name: 'Frontier VIP', description: 'Private founder roundtable and dinner', price: 4499, available: true, perks: ['Founder Dinner', 'Front Rows'], color: 'gold' },
      { id: 'sf-std', name: 'Standard Pass', description: 'All tracks and exhibits', price: 2299, available: true, perks: ['Exhibits', 'Keynotes'], color: 'primary' },
    ],
    venueInfo: {
      arenaName: 'Moscone West',
      city: 'San Francisco',
      gatesEntry: 'Howard Street Main Entrance.',
      parking: '5th & Mission Garage.',
      publicTransit: 'Powell St BART / Muni Station.',
    },
  },
];

export async function fetchEvents(): Promise<{ events: Event[]; total: number }> {
  try {
    const res = await apiClient.get<Event[]>(API_ENDPOINTS.EVENTS.LIST);
    if (res.success && res.data && res.data.length > 0) {
      return { events: res.data, total: res.data.length };
    }
  } catch {
    // Graceful fallback to rich curated events
  }
  return { events: CURATED_EVENTS, total: CURATED_EVENTS.length };
}

export async function fetchEventById(id: string): Promise<Event | null> {
  try {
    const res = await apiClient.get<Event>(API_ENDPOINTS.EVENTS.DETAIL(id));
    if (res.success && res.data) {
      return res.data;
    }
  } catch {
    // Fallback to local
  }
  const found = CURATED_EVENTS.find((e) => e.id === id);
  return found || null;
}
