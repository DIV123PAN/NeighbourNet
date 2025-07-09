export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  neighborhood: string;
  skills: string[];
  availability: {
    days: string[];
    timeSlots: string[];
  };
  rating: number;
  completedRequests: number;
  joinedAt: string;
  isActive: boolean;
  profilePicture?: string;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  skillsNeeded: string[];
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  estimatedDuration: number; // in hours
  location: {
    address: string;
    neighborhood: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  compensation: {
    type: 'free' | 'paid' | 'trade';
    amount?: number;
    description?: string;
  };
  status: 'open' | 'matched' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  neededBy: string;
  responses: ServiceResponse[];
  matchedUserId?: string;
}

export interface ServiceResponse {
  id: string;
  userId: string;
  requestId: string;
  message: string;
  proposedTime: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface Match {
  requestId: string;
  userId: string;
  score: number;
  factors: {
    skillsMatch: number;
    proximityMatch: number;
    availabilityMatch: number;
    userRating: number;
  };
  generatedAt: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  serviceRequests: ServiceRequest[];
  matches: Match[];
  isAuthenticated: boolean;
}