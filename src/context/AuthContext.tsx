import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile } from '../types/index.ts';
import {
  syncStudentProfile,
  getProfileByPassword,
  supabaseSignUp,
  supabaseSignIn,
  supabaseSignOut,
} from '../lib/supabaseClient.ts';

export function generateUniquePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randStr = '';
  for (let i = 0; i < 4; i++) {
    randStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `PATH-${digits}-${randStr}`;
}

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
    department: string;
  }) => Promise<{ success: boolean; assignedPassword?: string; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<StudentProfile>) => Promise<void>;
  toggleSavedCareer: (careerId: string) => Promise<void>;
  toggleSavedUniversity: (universityId: string) => Promise<void>;
  loginAsDemoStudent: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_STORAGE_KEY = 'pathcode_current_user_session';
const REGISTERED_USERS_KEY = 'pathcode_registered_accounts';

// Seed demo accounts so evaluators can test instantly with valid assigned passwords
const DEFAULT_ACCOUNTS = [
  {
    email: 'alex.rivera@pathcode.edu',
    pass: 'PATH-2026-ALEX',
    profile: {
      id: 'genz-alex-2026',
      name: 'Alex Rivera',
      age: 18,
      school: 'Aitchison College / Entering Freshman',
      email: 'alex.rivera@pathcode.edu',
      department: 'Computer Science & Frontier Tech',
      password: 'PATH-2026-ALEX',
      assignedPassword: 'PATH-2026-ALEX',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      savedCareers: ['ai-researcher', 'product-designer'],
      savedUniversities: ['lums', 'nust', 'mit'],
    },
  },
  {
    email: 'maya.chen@pathcode.edu',
    pass: 'PATH-2026-MAYA',
    profile: {
      id: 'genz-maya-2026',
      name: 'Maya Chen',
      age: 19,
      school: 'Lahore Grammar School / Freshman',
      email: 'maya.chen@pathcode.edu',
      department: 'Robotics & Mechanical Engineering',
      password: 'PATH-2026-MAYA',
      assignedPassword: 'PATH-2026-MAYA',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      savedCareers: ['robotics-engineer', 'tech-founder'],
      savedUniversities: ['giki', 'nust', 'cmu'],
    },
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize accounts store if empty
  useEffect(() => {
    try {
      const storedAccs = localStorage.getItem(REGISTERED_USERS_KEY);
      if (!storedAccs) {
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      }

      // Check for active login session
      const storedSession = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (storedSession) {
        setCurrentUser(JSON.parse(storedSession));
      } else {
        // Enforce mandatory login gate: no session by default!
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Session load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    try {
      // 1. Direct Supabase primary key lookup (password is primary key in public.profiles)
      try {
        const dbProfile = await getProfileByPassword(cleanPass);
        if (dbProfile && (dbProfile.email.toLowerCase() === cleanEmail || cleanEmail === '')) {
          setCurrentUser(dbProfile);
          localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(dbProfile));
          return { success: true };
        }
      } catch (e) {
        console.info('Direct Supabase password PK check note:', e);
      }

      // 2. Try Supabase Auth login
      try {
        const sbRes = await supabaseSignIn(cleanEmail, cleanPass);
        if (sbRes.user) {
          const u = sbRes.user;
          const meta = u.user_metadata || {};
          const profile: StudentProfile = {
            id: u.id,
            name: meta.name || cleanEmail.split('@')[0],
            age: Number(meta.age) || 18,
            school: meta.school || 'College/University',
            email: u.email || cleanEmail,
            department: meta.department || 'General STEM',
            password: cleanPass, // Primary key in Supabase profiles
            assignedPassword: cleanPass,
            avatarUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(
              meta.name || cleanEmail
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
      } catch (e) {
        console.info('Supabase sign-in note:', e);
      }

      // 3. Check registered accounts store
      const accountsRaw = localStorage.getItem(REGISTERED_USERS_KEY);
      const accounts: Array<{ email: string; pass: string; profile: StudentProfile }> = accountsRaw
        ? JSON.parse(accountsRaw)
        : DEFAULT_ACCOUNTS;

      const found = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
      if (found) {
        if (found.pass === cleanPass || found.pass.toUpperCase() === cleanPass.toUpperCase()) {
          setCurrentUser(found.profile);
          localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(found.profile));
          return { success: true };
        } else {
          return {
            success: false,
            error: `Invalid password. Please use the unique password assigned to your ID (e.g. ${found.pass}).`,
          };
        }
      }

      return {
        success: false,
        error: 'No student account found with this email. Please register as a new student first to receive your unique password.',
      };
    } catch {
      return { success: false, error: 'Sign in failed. Please check credentials.' };
    }
  };

  const register = async (data: {
    name: string;
    age: number;
    school: string;
    email: string;
    department: string;
  }): Promise<{ success: boolean; assignedPassword?: string; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();

    // Check if email already registered
    const accountsRaw = localStorage.getItem(REGISTERED_USERS_KEY);
    const accounts: Array<{ email: string; pass: string; profile: StudentProfile }> = accountsRaw
      ? JSON.parse(accountsRaw)
      : DEFAULT_ACCOUNTS;

    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        error: `An account already exists for ${cleanEmail}. Your assigned password is "${existing.pass}". Please proceed to Sign In.`,
      };
    }

    // Generate unique password assigned to the student
    const assignedPassword = generateUniquePassword();
    let assignedId = 'student_' + Math.random().toString(36).substring(2, 10);

    // Attempt Supabase Auth Sign Up
    try {
      const sbRes = await supabaseSignUp(cleanEmail, assignedPassword, {
        name: data.name.trim(),
        age: Number(data.age) || 18,
        school: data.school.trim(),
        department: data.department.trim(),
      });
      if (sbRes.user?.id) {
        assignedId = sbRes.user.id;
      }
    } catch (e) {
      console.info('Supabase register note:', e);
    }

    const newProfile: StudentProfile = {
      id: assignedId,
      name: data.name.trim(),
      age: Number(data.age) || 18,
      school: data.school.trim(),
      email: cleanEmail,
      department: data.department.trim(),
      password: assignedPassword, // PRIMARY KEY in Supabase profiles table
      assignedPassword,
      avatarUrl: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(data.name)}`,
      createdAt: new Date().toISOString(),
      savedCareers: [],
      savedUniversities: [],
    };

    // Save in registered accounts with unique assigned password
    accounts.push({
      email: cleanEmail,
      pass: assignedPassword,
      profile: newProfile,
    });
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(accounts));

    // Sync to Supabase `profiles` table with password as PRIMARY KEY
    await syncStudentProfile(newProfile);

    // Return assignedPassword so user can view/copy and then log in with it
    return { success: true, assignedPassword };
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
    const demo = DEFAULT_ACCOUNTS[0].profile;
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
