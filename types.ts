
export enum HealthPath {
  AYURVEDIC = 'AYURVEDIC',
  NON_AYURVEDIC = 'NON_AYURVEDIC',
}

export enum View {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  PATH_SELECTION = 'PATH_SELECTION',
  ACTION_SELECTION = 'ACTION_SELECTION',
  CHATBOT = 'CHATBOT',
  BOOK_DOCTOR = 'BOOK_DOCTOR',
  LIVE_QUEUE = 'LIVE_QUEUE',
  NEARBY_QUEUES = 'NEARBY_QUEUES',
}

export interface User {
  username: string;
  email: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface Doctor {
  name: string;
  specialty: string;
  location: string;
  rating: number;
  uri?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  distance: string;
  currentQueue: number;
  waitTime: number;
  status: 'Busy' | 'Available' | 'Crowded';
  path: HealthPath;
  uri?: string;
}

export interface BookingInfo {
  hospitalName: string;
  tokenNumber: number;
  initialQueuePosition: number;
  path: HealthPath;
}
