import apiClient, { setAccessToken, setRefreshToken, clearTokens } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

// Backwards-compatible aliases used across the app
export type LoginDto = LoginRequest;

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export type RegisterDto = RegisterRequest;

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type ChangePasswordDto = ChangePasswordRequest;

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    phone: string | null;
    join_date: string;
  };
}

export type LoginResponse = AuthResponse;

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    const { access_token, refresh_token } = response.data;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    const { access_token, refresh_token } = response.data;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      clearTokens();
    }
  },

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/api/auth/change-password', data);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/refresh', {
      refresh_token: refreshToken,
    });
    const { access_token, refresh_token } = response.data;
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
    return response.data;
  },
};

export default authService;
