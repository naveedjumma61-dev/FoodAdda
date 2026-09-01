'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'CUSTOMER' | 'RIDER' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  campus?: string | null;
  hostel?: string | null;
  riderProfile?: {
    id: string;
    vehicleType: string;
    plateNumber?: string | null;
    phone: string;
    active: boolean;
    available: boolean;
  } | null;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  campus?: string;
  hostel?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: AuthUser }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string; user?: AuthUser }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // On mount, check if there is an existing session
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      // Network error or DB offline — gracefully set no user
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: AuthUser }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true, message: data.message, user: data.user };
      } else {
        return { success: false, message: data.error || 'Login failed. Please try again.' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please check your connection and try again.' };
    }
  };

  const register = async (formData: RegisterData): Promise<{ success: boolean; message: string; user?: AuthUser }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true, message: data.message, user: data.user };
      } else {
        return { success: false, message: data.error || 'Registration failed. Please try again.' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please check your connection and try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      // Ignore logout network errors
    } finally {
      setUser(null);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
