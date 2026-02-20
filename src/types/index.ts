export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  actions_count: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'cleanup' | 'planting' | 'workshop';
  capacity: number;
  spots_remaining: number;
}

export interface Participation {
  id: string;
  mission_id: string;
  user_id: string;
  status: 'confirmed' | 'cancelled';
  created_at: string;
}

export interface ApiError {
  message: string;
  code?: string | number;
}
