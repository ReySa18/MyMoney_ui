import apiClient from './client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
  join_date: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export type UpdateProfileDto = UpdateProfileRequest;

export interface UserPreferences {
  currency: string;
  language: string;
  theme: string;
}

export interface UpdatePreferencesRequest {
  currency?: string;
  language?: string;
  theme?: string;
}

export type UpdatePreferencesDto = UpdatePreferencesRequest;

export type UserProfileResponse = UserProfile;
export type PreferencesResponse = UserPreferences;

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/api/me');
    return response.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.patch<UserProfile>('/api/me', data);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post<UserProfile>('/api/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getPreferences(): Promise<UserPreferences> {
    const response = await apiClient.get<UserPreferences>('/api/me/preferences');
    return response.data;
  },

  async updatePreferences(data: UpdatePreferencesRequest): Promise<UserPreferences> {
    const response = await apiClient.patch<UserPreferences>('/api/me/preferences', data);
    return response.data;
  },
};

export default userService;
