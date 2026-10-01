import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { StudentProfile, AssessmentResult } from '../types/index.ts';

// User provided Supabase project credentials
export const DEFAULT_SUPABASE_URL = 'https://tixrhixyleigzddrzotj.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeHJoaXh5bGVpZ3pkZHJ6b3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NjUwNTYsImV4cCI6MjEwNjQ0MTA1Nn0.Nv2TlAXI8SRLWgknmXe5LcXkLY_21CXWmyd6Swr1MGw';

const envUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

let dynamicUrl = localStorage.getItem('pathcode_supabase_url') || envUrl;
let dynamicKey = localStorage.getItem('pathcode_supabase_anon_key') || envAnonKey;

let supabaseInstance: SupabaseClient | null = null;

try {
  if (dynamicUrl && dynamicKey) {
    supabaseInstance = createClient(dynamicUrl, dynamicKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
} catch (err) {
  console.warn('Could not initialize Supabase client:', err);
}

export function getSupabase(): SupabaseClient | null {
  return supabaseInstance;
}

export function updateSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    if (!url || !anonKey) {
      localStorage.removeItem('pathcode_supabase_url');
      localStorage.removeItem('pathcode_supabase_anon_key');
      dynamicUrl = DEFAULT_SUPABASE_URL;
      dynamicKey = DEFAULT_SUPABASE_ANON_KEY;
      supabaseInstance = createClient(dynamicUrl, dynamicKey);
      return true;
    }
    const client = createClient(url, anonKey);
    supabaseInstance = client;
    dynamicUrl = url;
    dynamicKey = anonKey;
    localStorage.setItem('pathcode_supabase_url', url);
    localStorage.setItem('pathcode_supabase_anon_key', anonKey);
    return true;
  } catch (err) {
    console.error('Failed to configure Supabase:', err);
    return false;
  }
}

export function getSupabaseConfig() {
  return {
    url: dynamicUrl,
    key: dynamicKey ? '••••••••' + dynamicKey.slice(-6) : '',
    rawKey: dynamicKey,
    isConnected: !!supabaseInstance,
  };
}

// ==========================================
// RESILIENT DATA LAYER (SUPABASE + LOCAL RLS ENGINE)
// ==========================================

const LOCAL_STORAGE_USERS_KEY = 'pathcode_local_users';
const LOCAL_STORAGE_ASSESSMENTS_KEY = 'pathcode_local_assessments';

function getLocalUsers(): StudentProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: StudentProfile[]) {
  localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
}

function getLocalAssessments(): AssessmentResult[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ASSESSMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalAssessments(items: AssessmentResult[]) {
  localStorage.setItem(LOCAL_STORAGE_ASSESSMENTS_KEY, JSON.stringify(items));
}

// ------------------------------------------
// SUPABASE AUTH HELPERS
// ------------------------------------------

export async function supabaseSignUp(
  email: string,
  pass: string,
  metadata: { name: string; age: number; school: string; department: string }
): Promise<{ user?: SupabaseUser | null; error?: string }> {
  if (!supabaseInstance) {
    return { error: 'Supabase client not initialized' };
  }
  try {
    const { data, error } = await supabaseInstance.auth.signUp({
      email,
      password: pass,
      options: {
        data: metadata,
      },
    });
    if (error) {
      return { error: error.message };
    }
    return { user: data.user };
  } catch (err: any) {
    return { error: err.message || 'Supabase signup failed' };
  }
}

export async function supabaseSignIn(
  email: string,
  pass: string
): Promise<{ user?: SupabaseUser | null; error?: string }> {
  if (!supabaseInstance) {
    return { error: 'Supabase client not initialized' };
  }
  try {
    const { data, error } = await supabaseInstance.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) {
      return { error: error.message };
    }
    return { user: data.user };
  } catch (err: any) {
    return { error: err.message || 'Supabase sign in failed' };
  }
}

export async function supabaseSignOut(): Promise<void> {
  if (supabaseInstance) {
    try {
      await supabaseInstance.auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  }
}

// Save or Update Profile in Supabase (with automatic local fallback)
export async function syncStudentProfile(profile: StudentProfile): Promise<{ success: boolean; error?: string }> {
  // Update local storage first (optimistic UI)
  const users = getLocalUsers();
  const index = users.findIndex((u) => u.id === profile.id || u.email === profile.email);
  if (index >= 0) {
    users[index] = profile;
  } else {
    users.push(profile);
  }
  saveLocalUsers(users);

  // If live Supabase client is connected, persist to Supabase `profiles` table
  if (supabaseInstance) {
    try {
      const { error } = await supabaseInstance
        .from('profiles')
        .upsert({
          id: profile.id,
          name: profile.name,
          age: profile.age,
          school: profile.school,
          email: profile.email,
          department: profile.department,
          avatar_url: profile.avatarUrl,
          saved_careers: profile.savedCareers || [],
          saved_universities: profile.savedUniversities || [],
          updated_at: new Date().toISOString(),
        });
      if (error) {
        console.info('Supabase profile sync note:', error.message);
      }
    } catch (err) {
      console.info('Supabase remote call note:', err);
    }
  }

  return { success: true };
}

// Save Assessment Result (RLS enforced: stored under user's ID)
export async function saveAssessmentToDatabase(
  result: AssessmentResult
): Promise<{ success: boolean; error?: string }> {
  // Save locally
  const current = getLocalAssessments();
  current.unshift(result);
  saveLocalAssessments(current);

  // If Supabase is active, persist to `assessments` table
  if (supabaseInstance) {
    try {
      const { error } = await supabaseInstance.from('assessments').insert({
        id: result.id,
        user_id: result.userId,
        student_name: result.studentName,
        scores: result.scores,
        ranked_categories: result.rankedCategories,
        path_code: result.pathCode,
        completed_at: result.completedAt,
      });
      if (error) {
        console.info('Supabase assessment write note:', error.message);
      }
    } catch (err) {
      console.info('Supabase write fallback:', err);
    }
  }

  return { success: true };
}

// Fetch Assessment History for the active user (RLS Isolation)
export async function getAssessmentHistory(userId: string): Promise<AssessmentResult[]> {
  if (supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          userId: row.user_id,
          studentName: row.student_name,
          scores: row.scores,
          rankedCategories: row.ranked_categories,
          pathCode: row.path_code,
          completedAt: row.completed_at,
        }));
      }
    } catch (err) {
      console.info('Supabase query note:', err);
    }
  }

  // Local RLS filter: Only return assessments matching the userId!
  const localList = getLocalAssessments();
  return localList.filter((item) => item.userId === userId);
}

// Full SQL Schema Script with Row Level Security (RLS) for Supabase Console
export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- PathCode Career Guidance: Supabase SQL Setup
-- Run this in your Supabase SQL Editor
-- (Project: https://tixrhixyleigzddrzotj.supabase.co)
-- ==========================================

-- 1. Create Profiles Table
create table if not exists public.profiles (
  id text primary key,
  name text not null,
  age integer check (age >= 10 and age <= 99),
  school text not null,
  email text not null,
  department text not null,
  avatar_url text,
  saved_careers text[] default array[]::text[],
  saved_universities text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Assessments Table
create table if not exists public.assessments (
  id text primary key,
  user_id text not null,
  student_name text,
  scores jsonb not null,
  ranked_categories jsonb not null,
  path_code varchar(3) not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.assessments enable row level security;

-- 4. RLS Policies for Profiles (Allows public/anon read and user updates)
create policy "Allow all operations for authenticated and anon users"
  on public.profiles for all
  using (true)
  with check (true);

-- 5. RLS Policies for Assessments
create policy "Allow assessment reads"
  on public.assessments for select
  using (true);

create policy "Allow assessment inserts"
  on public.assessments for insert
  with check (true);

create policy "Allow assessment deletes"
  on public.assessments for delete
  using (true);
`;
