// Bizzabo API Types
export interface BizzaboSpeaker {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  bio?: string;
  imageUrl?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface BizzaboSession {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  stageId: string;
  stageName: string;
  speakers: BizzaboSpeaker[];
  sessionType: 'keynote' | 'panel' | 'workshop' | 'break' | 'lunch' | 'networking';
  isPublic: boolean;
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

// API Configuration
export interface BizzaboConfig {
  apiKey: string;
  eventId: string;
  baseUrl: string;
}
