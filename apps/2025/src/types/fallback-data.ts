export interface FallbackSpeaker {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  bio: string;
  imageUrl: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface FallbackSession {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  stageId: number;
  isPublic: boolean;
  speakers: Array<{ firstName: string; lastName: string }>;
  sessionType: string;
}

export interface FallbackStage {
  id: number;
  name: string;
  location: string;
  isActive: boolean;
}

export interface BizzaboLocation {
  id: number;
  name: string;
  nameId: string;
  description: string;
}

export const FALLBACK_SPEAKERS: FallbackSpeaker[] = [
  {
    id: 1,
    firstName: "Paul",
    lastName: "Copplestone",
    title: "CEO & Co-founder",
    company: "Supabase",
    bio: "Paul is the CEO and co-founder of Supabase, the open source Firebase alternative.",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    socialLinks: {
      twitter: "https://twitter.com/kiwicopple",
      linkedin: "https://linkedin.com/in/paulcopplestone",
    },
  },
  {
    id: 2,
    firstName: "Anne",
    lastName: "Chen",
    title: "Head of Developer Relations",
    company: "Supabase",
    bio: "Anne leads developer relations at Supabase, helping developers build amazing applications.",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    socialLinks: {
      twitter: "https://twitter.com/annechen",
      linkedin: "https://linkedin.com/in/annechen",
    },
  },
  {
    id: 3,
    firstName: "Thor",
    lastName: "Schaeff",
    title: "CTO & Co-founder",
    company: "Supabase",
    bio: "Thor is the CTO and co-founder of Supabase, building the future of backend development.",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    socialLinks: {
      twitter: "https://twitter.com/thorwebdev",
      linkedin: "https://linkedin.com/in/thorwebdev",
    },
  },
  {
    id: 4,
    firstName: "Build",
    lastName: "Team",
    title: "Workshop Leaders",
    company: "Supabase",
    bio: "Our expert team of builders who will guide you through hands-on workshops.",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&crop=face",
    socialLinks: {},
  },
];

export const FALLBACK_STAGES: FallbackStage[] = [
  {
    id: 1,
    name: "Main Stage",
    location: "Union Iron Works",
    isActive: true,
  },
  {
    id: 2,
    name: "Build Stage",
    location: "520 YC",
    isActive: true,
  },
];

// Bizzabo location ID mappings
export const BIZZABO_LOCATIONS: BizzaboLocation[] = [
  {
    id: 131741,
    name: "Main Stage",
    nameId: "main-stage",
    description: "HQ Building 1",
  },
  {
    id: 131743,
    name: "Build Stage",
    nameId: "build-stage",
    description: "520 YC",
  },
];

export const FALLBACK_SESSIONS: FallbackSession[] = [
  // Main Stage Sessions (FRI OCT 03)
  {
    id: 1,
    title: "Keynote",
    description: "Opening keynote address",
    startTime: "2025-10-03T10:00:00.000+0000",
    endTime: "2025-10-03T11:00:00.000+0000",
    stageId: 1,
    isPublic: true,
    speakers: [{ firstName: "Paul", lastName: "Copplestone" }],
    sessionType: "keynote",
  },
  {
    id: 2,
    title: "Session A",
    description: "Deep dive into Session A topics",
    startTime: "2025-10-03T11:00:00.000+0000",
    endTime: "2025-10-03T12:00:00.000+0000",
    stageId: 1,
    isPublic: true,
    speakers: [{ firstName: "Anne", lastName: "Chen" }],
    sessionType: "session",
  },
  {
    id: 3,
    title: "Lunch",
    description: "Networking lunch break",
    startTime: "2025-10-03T12:00:00.000+0000",
    endTime: "2025-10-03T13:00:00.000+0000",
    stageId: 1,
    isPublic: true,
    speakers: [],
    sessionType: "break",
  },
  {
    id: 4,
    title: "Session B",
    description: "Exploring Session B concepts",
    startTime: "2025-10-03T13:00:00.000+0000",
    endTime: "2025-10-03T14:00:00.000+0000",
    stageId: 1,
    isPublic: true,
    speakers: [{ firstName: "Thor", lastName: "Schaeff" }],
    sessionType: "session",
  },
  {
    id: 5,
    title: "Session C",
    description: "Interactive Session C discussion",
    startTime: "2025-10-03T14:00:00.000+0000",
    endTime: "2025-10-03T15:00:00.000+0000",
    stageId: 1,
    isPublic: true,
    speakers: [{ firstName: "Expert", lastName: "Speaker" }],
    sessionType: "session",
  },
  {
    id: 6,
    title: "Session D",
    description: "Advanced topics in Session D",
    startTime: "2025-10-03T15:00:00.000+0000",
    endTime: "2025-10-03T16:00:00.000+0000",
    stageId: 1,
    isPublic: true,
    speakers: [{ firstName: "Industry", lastName: "Leader" }],
    sessionType: "session",
  },
  {
    id: 7,
    title: "Session E",
    description: "Practical applications of Session E",
    startTime: "2025-10-03T16:00:00.000+0000",
    endTime: "2025-10-03T17:00:00.000+0000",
    stageId: 1,
    isPublic: true,
    speakers: [{ firstName: "Technical", lastName: "Expert" }],
    sessionType: "session",
  },
  {
    id: 8,
    title: "Session F",
    description: "Concluding thoughts on Session F",
    startTime: "2025-10-03T17:00:00.000+0000",
    endTime: "2025-10-03T18:00:00.000+0000",
    stageId: 1,
    isPublic: true,
    speakers: [{ firstName: "Closing", lastName: "Speaker" }],
    sessionType: "session",
  },
  {
    id: 9,
    title: "Party",
    description: "Evening networking party",
    startTime: "2025-10-03T18:00:00.000+0000",
    endTime: "2025-10-03T20:00:00.000+0000",
    stageId: 1,
    isPublic: true,
    speakers: [],
    sessionType: "social",
  },
  // Build Stage Sessions (same time slots as A-F)
  {
    id: 10,
    title: "Session G",
    description: "Introduction to Session G concepts",
    startTime: "2025-10-03T11:00:00.000+0000",
    endTime: "2025-10-03T12:00:00.000+0000",
    stageId: 2,
    isPublic: true,
    speakers: [{ firstName: "Build", lastName: "Speaker 1" }],
    sessionType: "session",
  },
  {
    id: 11,
    title: "Session H",
    description: "Hands-on workshop for Session H",
    startTime: "2025-10-03T13:00:00.000+0000",
    endTime: "2025-10-03T14:00:00.000+0000",
    stageId: 2,
    isPublic: true,
    speakers: [{ firstName: "Build", lastName: "Speaker 2" }],
    sessionType: "workshop",
  },
  {
    id: 12,
    title: "Session I",
    description: "Case studies in Session I",
    startTime: "2025-10-03T14:00:00.000+0000",
    endTime: "2025-10-03T15:00:00.000+0000",
    stageId: 2,
    isPublic: true,
    speakers: [{ firstName: "Build", lastName: "Speaker 3" }],
    sessionType: "session",
  },
  {
    id: 13,
    title: "Session J",
    description: "Deep dive into Session J",
    startTime: "2025-10-03T15:00:00.000+0000",
    endTime: "2025-10-03T16:00:00.000+0000",
    stageId: 2,
    isPublic: true,
    speakers: [{ firstName: "Build", lastName: "Speaker 4" }],
    sessionType: "session",
  },
  {
    id: 14,
    title: "Session K",
    description: "Practical tips for Session K",
    startTime: "2025-10-03T16:00:00.000+0000",
    endTime: "2025-10-03T17:00:00.000+0000",
    stageId: 2,
    isPublic: true,
    speakers: [{ firstName: "Build", lastName: "Speaker 5" }],
    sessionType: "session",
  },
  {
    id: 15,
    title: "Session L",
    description: "Q&A and wrap-up for Session L",
    startTime: "2025-10-03T17:00:00.000+0000",
    endTime: "2025-10-03T18:00:00.000+0000",
    stageId: 2,
    isPublic: true,
    speakers: [{ firstName: "Build", lastName: "Speaker 6" }],
    sessionType: "session",
  },
];
