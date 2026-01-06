export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  link?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  validated: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}