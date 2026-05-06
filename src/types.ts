export type ActivityType = 
  | 'home' 
  | 'letters' 
  | 'animals' 
  | 'speech' 
  | 'emotions' 
  | 'breathe' 
  | 'draw' 
  | 'routine'
  | 'parents'
  | 'locked';

export interface Task {
  id: string;
  label: string;
  icon: string;
  completed: boolean;
  category: string;
  feedback?: string;
  isFixed?: boolean;
  isMain?: boolean;
  subCategory?: string;
  period?: 'morning' | 'afternoon' | 'night';
}

export interface SensorySettings {
  volume: number;
  brightness: number;
  voiceSpeed: number;
  lowStimulation: boolean;
  animationsEnabled: boolean;
}

export interface ParentSettings {
  timeLimitMinutes: number;
  startTime: number | null;
  pin: string;
}

export interface ProgressData {
  wordsLearned: string[];
  colorsRecognized: string[];
  lettersPracticed: string[];
  lastSession: string;
  activitiesCount: Record<string, number>;
  routineTasks: Task[];
  currentEmotion?: string;
}
