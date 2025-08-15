// Bizzabo API types and transformations

// Raw Bizzabo API types
export interface BizzaboSpeaker {
  id: number;
  email: string; // required
  firstname?: string;
  lastname?: string;
  title?: string;
  company?: string;
  bio?: string;
  country?: string;
  prefix?: string;
  blog?: string;
  linkedIn?: string;
  twitterHandle?: string;
  web?: string;
  photoSet?: {
    small: string;
    medium: string;
    large: string;
    blur: string;
  };
  created?: string;
  modified?: string;
}

export interface BizzaboSession {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  startMinute?: number;
  endMinute?: number;
  locationId: number;
  speakers?: Array<{ speakerId: number }>;
  sessionType:
    | "keynote"
    | "panel"
    | "workshop"
    | "break"
    | "lunch"
    | "networking";
  isPublic: boolean;
  // Additional fields from actual JSON
  filters?: Array<{ id: number; tags: any[] }>;
  enableVirtualSession?: boolean;
  private?: boolean;
  registration?: boolean;
  allowRating?: boolean;
  externalId?: string;
  onsiteVisibility?: { type: string };
  registrationFull?: boolean;
  recordingSession?: any;
  sessionCardSize?: string;
  associatedContacts?: Record<string, any>;
  registrationVisibility?: boolean;
  registrationCapacityEnable?: boolean;
  hidden?: boolean;
}

export interface BizzaboStage {
  id: string;
  name: string;
  location?: string;
  isActive: boolean;
}

export interface BizzaboEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  timezone: string;
  stages: BizzaboStage[];
  sessions: BizzaboSession[];
  speakers: BizzaboSpeaker[];
}

export interface BizzaboApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface BizzaboConfig {
  apiKey: string;
  eventId: string;
  baseUrl: string;
}

// Transformed types for UI
export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  speakers: string;
  stage: string;
  description: string;
  sessionType: string;
}

export interface ScheduleStage {
  name: string;
  location: string;
  active: boolean;
}

export interface ScheduleData {
  stages: ScheduleStage[];
  events: ScheduleEvent[];
}

// Helper types
export interface SessionSpeakerRef {
  speakerId: string;
}

// Bizzabo Contact types
export interface BizzaboContact {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  [key: string]: unknown; // Allow additional properties
}

export interface BizzaboContactResponse {
  id: number;
  email: string;
  created: string;
  modified: string;
  eventId: number;
  [key: string]: unknown; // Allow additional properties from Bizzabo
}
