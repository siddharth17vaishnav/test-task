export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  last_login_at: string;
}
