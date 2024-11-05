export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  last_login_at: string;
}
