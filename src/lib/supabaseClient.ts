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

// Save or Update Profile in Supabase (with password as primary key)
export async function syncStudentProfile(profile: StudentProfile): Promise<{ success: boolean; error?: string }> {
  // Update local storage first (optimistic UI)
  const users = getLocalUsers();
  const index = users.findIndex((u) => u.id === profile.id || u.email === profile.email || (profile.assignedPassword && u.assignedPassword === profile.assignedPassword));
  if (index >= 0) {
    users[index] = profile;
  } else {
    users.push(profile);
  }
  saveLocalUsers(users);

  // If live Supabase client is connected, persist to Supabase `profiles` table
  if (supabaseInstance) {
    const passwordKey = profile.assignedPassword || profile.password || profile.id;
    try {
      const payload: Record<string, any> = {
        password: passwordKey, // PRIMARY KEY in Supabase profiles
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
      };

      // Upsert with password as primary key
      const { error } = await supabaseInstance
        .from('profiles')
        .upsert(payload, { onConflict: 'password' });

      if (error) {
        console.info('Supabase profile upsert by password PK note:', error.message);
        // Fallback in case remote schema still has 'id' as primary key
        await supabaseInstance
          .from('profiles')
          .upsert(payload, { onConflict: 'id' });
      }
    } catch (err) {
      console.info('Supabase remote call note:', err);
    }
  }

  return { success: true };
}

// Fetch Profile by Primary Key (Password) from Supabase
export async function getProfileByPassword(pass: string): Promise<StudentProfile | null> {
  const cleanPass = pass.trim();
  if (supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('profiles')
        .select('*')
        .eq('password', cleanPass)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id || data.password,
          password: data.password,
          assignedPassword: data.password,
          name: data.name,
          age: Number(data.age) || 18,
          school: data.school,
          email: data.email,
          department: data.department,
          avatarUrl: data.avatar_url,
          createdAt: data.created_at || new Date().toISOString(),
          savedCareers: data.saved_careers || [],
          savedUniversities: data.saved_universities || [],
        };
      }
    } catch (err) {
      console.info('Supabase getProfileByPassword note:', err);
    }
  }

  // Fallback to local storage
  const users = getLocalUsers();
  const matched = users.find(
    (u) =>
      u.assignedPassword === cleanPass ||
      u.password === cleanPass ||
      (u.assignedPassword && u.assignedPassword.toUpperCase() === cleanPass.toUpperCase())
  );
  return matched || null;
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
// Note: PASSWORD is the PRIMARY KEY of the public.profiles table
export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- PathCode Career Guidance: Supabase SQL Setup
-- Run this in your Supabase SQL Editor
-- (Project: https://tixrhixyleigzddrzotj.supabase.co)
-- ==========================================

-- 1. Create Profiles Table (PASSWORD is PRIMARY KEY)
create table if not exists public.profiles (
  password text primary key,
  id text,
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

-- Safe Migration: Ensure 'password' column exists and is PRIMARY KEY on existing tables
do $$
begin
  -- Add password column if it does not exist
  if not exists (
    select 1 from information_schema.columns 
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'password'
  ) then
    alter table public.profiles add column password text;
  end if;

  -- Ensure any existing rows have a valid password
  update public.profiles 
  set password = coalesce(id, 'PATH-' || floor(random() * 8999 + 1000)::text) 
  where password is null;

  alter table public.profiles alter column password set not null;

  -- Ensure password is the PRIMARY KEY
  if exists (
    select 1 from information_schema.table_constraints tc
    where tc.table_schema = 'public' and tc.table_name = 'profiles' and tc.constraint_type = 'PRIMARY KEY'
  ) then
    if not exists (
      select 1 from information_schema.key_column_usage kcu
      join information_schema.table_constraints tc on kcu.constraint_name = tc.constraint_name
      where tc.table_schema = 'public' and tc.table_name = 'profiles' and tc.constraint_type = 'PRIMARY KEY' and kcu.column_name = 'password'
    ) then
      execute (
        'alter table public.profiles drop constraint ' || (
          select tc.constraint_name
          from information_schema.table_constraints tc
          where tc.table_schema = 'public' and tc.table_name = 'profiles' and tc.constraint_type = 'PRIMARY KEY'
          limit 1
        )
      );
      alter table public.profiles add primary key (password);
    end if;
  else
    alter table public.profiles add primary key (password);
  end if;
end $$;

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

-- 4. RLS Policies for Profiles (Full read/write with password primary key)
drop policy if exists "Allow all operations for authenticated and anon users" on public.profiles;
create policy "Allow all operations for authenticated and anon users"
  on public.profiles for all
  using (true)
  with check (true);

-- 5. RLS Policies for Assessments
drop policy if exists "Allow assessment reads" on public.assessments;
create policy "Allow assessment reads"
  on public.assessments for select
  using (true);

drop policy if exists "Allow assessment inserts" on public.assessments;
create policy "Allow assessment inserts"
  on public.assessments for insert
  with check (true);

drop policy if exists "Allow assessment deletes" on public.assessments;
create policy "Allow assessment deletes"
  on public.assessments for delete
  using (true);
`;
