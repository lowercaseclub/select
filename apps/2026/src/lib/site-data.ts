import speakersData from '@/data/speakers.json'
import agendaData from '@/data/agenda.json'

export const EVENT = {
  date: 'OCT 2',
  dateLong: 'October 2',
  addressLine1: '575 20th Street',
  addressLine2: 'San Francisco',
  rsvpHref: '#apply',
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

/** Add speakers in src/data/speakers.json as they're announced. */
export const SPEAKERS: Speaker[] = speakersData.speakers

/** Number of unannounced speaker slots shown as "coming soon" tiles — set in src/data/speakers.json. */
export const COMING_SOON_SLOTS: number = speakersData.comingSoonSlots

export type StageInfo = {
  id: string
  name: string
}

export type AgendaRow = {
  /** Omit while the slot time is still TBC. */
  time?: string
  /** Omit (with tbc: true) for an unannounced slot. */
  title?: string
  speakers?: string
  /** Breaks are muted and visually highlighted. */
  isBreak?: boolean
  /** Coming soon/TBC: no title → whole slot unannounced; with title → speakers TBC. */
  tbc?: boolean
}

type AgendaEvent = AgendaRow & { stage: string }

/** Stage tabs are driven by src/data/agenda.json. */
export const STAGES: StageInfo[] = agendaData.stages

/**
 * Add sessions in src/data/agenda.json as they're confirmed. A stage with no
 * events renders as a "coming soon" panel.
 */
export const AGENDA: Record<string, AgendaRow[]> = Object.fromEntries(
  STAGES.map((stage) => [
    stage.id,
    (agendaData.events as AgendaEvent[]).filter((event) => event.stage === stage.id),
  ])
)

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
  url: string
  /** intrinsic logo height in px to keep optical sizing even across marks */
  height: number
}

export const SPONSORS: Sponsor[] = [
  { logo: '/img/vercel.svg', alt: 'Vercel', url: 'https://vercel.com', height: 28 },
  { logo: '/img/resend.svg', alt: 'Resend', url: 'https://resend.com', height: 32 },
  { logo: '/img/posthog.svg', alt: 'PostHog', url: 'https://posthog.com', height: 30 },
]

export const GALLERY = [
  { image: '/img/gallery.png', caption: 'man at the desk' },
  { image: '/img/gallery.png', caption: '' },
  { image: '/img/gallery.png', caption: 'on the main stage' },
  { image: '/img/gallery.png', caption: '' },
  { image: '/img/gallery.png', caption: 'ask supabase booth' },
] as const
