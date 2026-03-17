export interface User {
    id: number,
    name: string,
    email: string
}

export interface Application {
  //clave: tipo
    id: number;
    user_id: number;
    company: string;
    position: string;
    status: 'applied' | 'in_progress' | 'interview' | 'rejected' | 'offer';
    channel: 'linkedin' | 'web' | 'referral' | 'other';
    applied_at: string;
    notes: string | null;
    follow_up_date: string | null;
    created_at: string;
    updated_at: string;
  }

  export interface AuthResponse {
    token: string,
    user: User
  }