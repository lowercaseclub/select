export const EVENT = {
  date: 'OCT 2',
  dateLong: 'October 2',
  addressLine1: '575 20th Street',
  addressLine2: 'San Francisco',
  applyHref: '#apply',
} as const

export type Feature = {
  title: string
  body: string
}

export const FEATURES: Feature[] = [
  {
    title: 'See what’s next, first.',
    body: "Get first-hand information about what's coming soon in Supabase. Meet the companies building the developer tools everyone's talking about. Learn about the latest in Postgres.",
  },
  {
    title: 'Learn from builders.',
    body: 'Every session highlights how real products get built. Fireside chats with well-known builders on the Main Stage. Feature deep dives on the Build Stage.',
  },
  {
    title: 'Meet the Supabase team.',
    body: 'Walk up to the Ask Supabase booth and talk to the engineers who built Supabase. Bring your hardest questions.',
  },
]

export type Speaker = {
  name: string
  role: string
  image: string
}

export const SPEAKERS: Speaker[] = [
  { name: 'Copple', role: 'CEO, Supabase', image: '/img/speaker-copple.png' },
  { name: 'Ant Wilson', role: 'CTO, Supabase', image: '/img/speaker-ant-wilson.png' },
]

/** Number of unannounced speaker slots shown as "coming soon" tiles. */
export const COMING_SOON_SLOTS = 4

export type Stage = 'main' | 'build'

export type AgendaRow = {
  time: string
  title: string
  speakers?: string
  /** Breaks are muted and visually highlighted. */
  isBreak?: boolean
}

export const AGENDA: Record<Stage, AgendaRow[]> = {
  main: [
    { time: '09:00 — 09:30', title: 'Breakfast' },
    { time: '09:30 — 10:00', title: 'Keynote', speakers: 'Copple, Ant Wilson' },
    {
      time: '10:00 — 10:30',
      title: 'Multigres Update',
      speakers: 'Sugu Sougoumarane, Deepti Sigireddi',
    },
    { time: '10:30 — 11:00', title: 'Break', isBreak: true },
    { time: '11:00 — 11:30', title: 'Keynote', speakers: 'Copple, Ant Wilson' },
    { time: '11:30 — 12:00', title: 'Keynote', speakers: 'Copple, Ant Wilson' },
    { time: '12:00 — 12:30', title: 'Keynote', speakers: 'Copple, Ant Wilson' },
    { time: '12:30 — 13:00', title: 'Keynote', speakers: 'Copple, Ant Wilson' },
    { time: '13:00 — 13:30', title: 'Keynote', speakers: 'Copple, Ant Wilson' },
  ],
  build: [
    { time: '09:30 — 10:00', title: 'Deep dive: Auth', speakers: 'Supabase Engineering' },
    { time: '10:00 — 10:30', title: 'Deep dive: Realtime', speakers: 'Supabase Engineering' },
    { time: '10:30 — 11:00', title: 'Break', isBreak: true },
    { time: '11:00 — 11:30', title: 'Deep dive: Storage', speakers: 'Supabase Engineering' },
    { time: '11:30 — 12:00', title: 'Deep dive: Edge Functions', speakers: 'Supabase Engineering' },
    { time: '12:00 — 12:30', title: 'Deep dive: Vectors', speakers: 'Supabase Engineering' },
  ],
}

export type Research = {
  logo: string
  alt: string
  caption: string
}

export const RESEARCH: Research[] = [
  { logo: '/img/oriole.svg', alt: 'OrioleDB', caption: 'Operating system of Postgres' },
  { logo: '/img/multigres.svg', alt: 'Multigres', caption: 'Postgres scaling' },
]

export type Sponsor = {
  logo: string
  alt: string
  /** intrinsic logo height in px to keep optical sizing even across marks */
  height: number
}

export const SPONSORS: Sponsor[] = [
  { logo: '/img/vercel.svg', alt: 'Vercel', height: 28 },
  { logo: '/img/resend.svg', alt: 'Resend', height: 32 },
  { logo: '/img/posthog.svg', alt: 'PostHog', height: 30 },
]

export const GALLERY = [
  { image: '/img/gallery.png', caption: 'man at the desk' },
  { image: '/img/gallery.png', caption: '' },
  { image: '/img/gallery.png', caption: 'on the main stage' },
  { image: '/img/gallery.png', caption: '' },
  { image: '/img/gallery.png', caption: 'ask supabase booth' },
] as const
