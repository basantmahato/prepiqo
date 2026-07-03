import { create } from 'zustand';
import api from '../lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  currentSubscription?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrating: boolean;
  
  // Actions
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<any>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: any) => Promise<void>;
  setAuth: (user: any, token: string) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isHydrating: true,

  hydrate: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      if (token && userStr) {
        set({
          token,
          user: JSON.parse(userStr),
          isAuthenticated: true,
        });
      }
    } catch (e) {
      console.error('Failed to hydrate auth store', e);
    } finally {
      set({ isHydrating: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', credentials);
      const { token, ...userData } = res.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      set({ 
        user: userData, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      throw err;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', userData);
      
      if (res.data.requiresVerification) {
        set({ isLoading: false });
        return res.data;
      }

      const { token, ...newUserData } = res.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(newUserData));
      
      set({ 
        user: newUserData, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return res.data;
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
      throw err;
    }
  },

  googleLogin: async (idToken) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/google', { idToken });
      const { token, ...userData } = res.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      set({ 
        user: userData, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || 'Google login failed', 
        isLoading: false 
      });
      throw err;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false,
      error: null
    });
  },

  clearError: () => set({ error: null }),
  
  updateUser: async (user) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  
  setAuth: async (user, token) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    set({ 
      user, 
      token, 
      isAuthenticated: true, 
      isLoading: false 
    });
  }
}));
