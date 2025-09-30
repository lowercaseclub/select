import type { BizzaboSpeaker, BizzaboSession } from '../types/bizzabo.types'

// Fallback data for when Bizzabo API is not available
export const FALLBACK_SPEAKERS: BizzaboSpeaker[] = [
  {
    id: 1,
    email: 'paul@supabase.com',
    firstname: 'Paul',
    lastname: 'Copplestone',
    title: 'Co-founder & CEO',
    company: 'Supabase',
    bio: 'Paul is the co-founder and CEO of Supabase, the open source Firebase alternative.',
    photoSet: {
      large: 'https://via.placeholder.com/400x400/3ecf8e/ffffff?text=PC',
      medium: 'https://via.placeholder.com/200x200/3ecf8e/ffffff?text=PC',
      small: 'https://via.placeholder.com/100x100/3ecf8e/ffffff?text=PC',
      blur: 'https://via.placeholder.com/20x20/3ecf8e/ffffff?text=PC',
    },
    linkedIn: 'https://linkedin.com/in/paulcopplestone',
    twitterHandle: '@paulcopplestone',
    web: 'https://supabase.com',
  },
  {
    id: 2,
    email: 'ant@supabase.com',
    firstname: 'Ant',
    lastname: 'Wilson',
    title: 'Co-founder & CTO',
    company: 'Supabase',
    bio: 'Ant is the co-founder and CTO of Supabase, building the future of backend development.',
    photoSet: {
      large: 'https://via.placeholder.com/400x400/3ecf8e/ffffff?text=AW',
      medium: 'https://via.placeholder.com/200x200/3ecf8e/ffffff?text=AW',
      small: 'https://via.placeholder.com/100x100/3ecf8e/ffffff?text=AW',
      blur: 'https://via.placeholder.com/20x20/3ecf8e/ffffff?text=AW',
    },
    linkedIn: 'https://linkedin.com/in/antwilson',
    twitterHandle: '@awilson',
    web: 'https://supabase.com',
  },
]

export const FALLBACK_SESSIONS: BizzaboSession[] = [
  {
    id: 1,
    title: 'Welcome & Opening Keynote',
    description: 'Join us for the opening keynote as we kick off Supabase Select 2025.',
    startDate: '2025-10-03T09:00:00Z',
    endDate: '2025-10-03T09:30:00Z',
    startMinute: 540,
    endMinute: 570,
    locationId: 131723, // Main Stage
    speakers: [FALLBACK_SPEAKERS[0]],
    sessionType: 'keynote',
    isPublic: true,
  },
  {
    id: 3,
    title: 'Lunch Break',
    description: 'Networking and lunch break.',
    startDate: '2025-10-03T12:00:00Z',
    endDate: '2025-10-03T13:00:00Z',
    startMinute: 720,
    endMinute: 780,
    locationId: 131723, // Main Stage
    speakers: [],
    sessionType: 'break',
    isPublic: true,
  },
  {
    id: 5,
    title: 'Closing Remarks & Networking',
    description: 'Wrap up the day with closing remarks and networking opportunities.',
    startDate: '2025-10-03T17:00:00Z',
    endDate: '2025-10-03T18:00:00Z',
    startMinute: 1020,
    endMinute: 1080,
    locationId: 131723, // Main Stage
    speakers: [FALLBACK_SPEAKERS[0]],
    sessionType: 'keynote',
    isPublic: true,
  },
]
