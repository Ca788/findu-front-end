export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}
