export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  last_login_at: string;
}
