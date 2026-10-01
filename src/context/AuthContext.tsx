import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile } from '../types/index.ts';
import {
  syncStudentProfile,
  supabaseSignUp,
  supabaseSignIn,
  supabaseSignOut,
} from '../lib/supabaseClient.ts';

interface AuthContextType {
  currentUser: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    age: number;
    school: string;
    email: string;
    password?: string;
    department: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<StudentProfile>) => Promise<void>;
  toggleSavedCareer: (careerId: string) => Promise<void>;
  toggleSavedUniversity: (universityId: string) => Promise<void>;
  loginAsDemoStudent: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_STORAGE_KEY = 'pathcode_current_user_session';
const REGISTERED_USERS_KEY = 'pathcode_registered_accounts';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load session on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        // Initialize with default demo session if first time, so user can immediately test
        const demoUser: StudentProfile = {
          id: 'genz-alex-2026',
          name: 'Alex Rivera',
          age: 18,
          school: 'Westlake Prep / Entering Freshman',
          email: 'alex.rivera@pathcode.edu',
          department: 'Exploring STEM & Creative Tech',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString(),
          savedCareers: ['ai-researcher', 'product-designer'],
          savedUniversities: ['mit', 'stanford', 'waterloo'],
        };
        setCurrentUser(demoUser);
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(demoUser));
      }
    } catch (err) {
      console.error('Failed to load user session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Attempt Supabase Auth login if online
      const sbRes = await supabaseSignIn(email, pass);
      if (sbRes.user) {
        const u = sbRes.user;
        const meta = u.user_metadata || {};
        const profile: StudentProfile = {
          id: u.id,
          name: meta.name || email.split('@')[0],
          age: Number(meta.age) || 18,
          school: meta.school || 'College/University',
          email: u.email || email,
          department: meta.department || 'Undecided',
          avatarUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(
            meta.name || email
          )}`,
          createdAt: u.created_at || new Date().toISOString(),
          savedCareers: [],
          savedUniversities: [],
        };
        setCurrentUser(profile);
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(profile));
        await syncStudentProfile(profile);
        return { success: true };
      }

      // 2. Local fallback check
      const accountsRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const accounts: Array<{ email: string; pass: string; profile: StudentProfile }> = accountsRaw
        ? JSON.parse(accountsRaw)
        : [];

      const found = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentUser(found.profile);
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(found.profile));
        return { success: true };
      }

      // If email matches demo user
      if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
        return { success: true };
      }

      // Allow automatic fallback for test accounts
      const newProfile: StudentProfile = {
        id: 'user_' + Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0].toUpperCase(),
        age: 18,
        school: 'High School / College',
        email,
        department: 'Undecided',
        createdAt: new Date().toISOString(),
        savedCareers: [],
        savedUniversities: [],
      };
      setCurrentUser(newProfile);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newProfile));
      syncStudentProfile(newProfile);
      return { success: true };
    } catch {
      return { success: false, error: 'Sign in failed. Please try again.' };
    }
  };

  const register = async (data: {
    name: string;
    age: number;
    school: string;
    email: string;
    password?: string;
    department: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      let assignedId = 'student_' + Math.random().toString(36).substring(2, 10);

      // 1. Try Supabase Auth Sign Up
      try {
        const sbRes = await supabaseSignUp(data.email, data.password || 'password123', {
          name: data.name,
          age: data.age,
          school: data.school,
          department: data.department,
        });
        if (sbRes.user?.id) {
          assignedId = sbRes.user.id;
        }
      } catch (e) {
        console.info('Supabase auth signup notice:', e);
      }

      const newProfile: StudentProfile = {
        id: assignedId,
        name: data.name,
        age: Number(data.age) || 18,
        school: data.school,
        email: data.email,
        department: data.department,
        avatarUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(data.name)}`,
        createdAt: new Date().toISOString(),
        savedCareers: [],
        savedUniversities: [],
      };

      // Store in registered users
      const accountsRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const accounts = accountsRaw ? JSON.parse(accountsRaw) : [];
      accounts.push({
        email: data.email,
        pass: data.password || 'password',
        profile: newProfile,
      });
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));

      // Set active session
      setCurrentUser(newProfile);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newProfile));

      // Sync to Supabase `profiles` table
      await syncStudentProfile(newProfile);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    supabaseSignOut();
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  };

  const updateProfile = async (updates: Partial<StudentProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updated));
    await syncStudentProfile(updated);
  };

  const toggleSavedCareer = async (careerId: string) => {
    if (!currentUser) return;
    const currentList = currentUser.savedCareers || [];
    const exists = currentList.includes(careerId);
    const newList = exists ? currentList.filter((id) => id !== careerId) : [...currentList, careerId];
    await updateProfile({ savedCareers: newList });
  };

  const toggleSavedUniversity = async (universityId: string) => {
    if (!currentUser) return;
    const currentList = currentUser.savedUniversities || [];
    const exists = currentList.includes(universityId);
    const newList = exists ? currentList.filter((id) => id !== universityId) : [...currentList, universityId];
    await updateProfile({ savedUniversities: newList });
  };

  const loginAsDemoStudent = () => {
    const demo: StudentProfile = {
      id: 'genz-maya-stem',
      name: 'Maya Chen',
      age: 19,
      school: 'University Freshman / Honors College',
      email: 'maya.chen@pathcode.edu',
      department: 'Computer Science & Human-Centered Design',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      savedCareers: ['product-designer', 'ai-researcher', 'biotech-scientist'],
      savedUniversities: ['mit', 'stanford', 'oxford', 'eth-zurich'],
    };
    setCurrentUser(demo);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(demo));
    syncStudentProfile(demo);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        toggleSavedCareer,
        toggleSavedUniversity,
        loginAsDemoStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
