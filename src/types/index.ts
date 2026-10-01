export type CalipsCategory = 'C' | 'A' | 'L' | 'I' | 'P' | 'S';

export interface Question {
  id: number;
  category: CalipsCategory;
  categoryTitle: string;
  categorySubtitle: string;
  question: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  school: string;
  email: string;
  department: string;
  avatarUrl?: string;
  createdAt: string;
  savedCareers?: string[];
  savedUniversities?: string[];
}

export interface AssessmentResult {
  id: string;
  userId: string;
  studentName?: string;
  scores: Record<CalipsCategory, number>;
  rankedCategories: { category: CalipsCategory; score: number; percentage: number }[];
  pathCode: string; // e.g. "IAS"
  completedAt: string;
}

export interface CalipsCategoryInfo {
  code: CalipsCategory;
  name: string;
  archetype: string;
  tagline: string;
  color: string;
  bgGrad: string;
  borderColor: string;
  description: string;
  traits: string[];
  workVibe: string;
  strengths: string[];
}

export interface Career {
  id: string;
  title: string;
  category: CalipsCategory;
  matchCodes: string[]; // compatible 3-letter or 2-letter combos
  cluster: string;
  description: string;
  typicalDay: string;
  salaryRange: string;
  growthOutlook: 'High' | 'Very High' | 'Moderate' | 'Explosive';
  entryMajors: string[];
  keySkills: string[];
}

export interface MajorProgram {
  id: string;
  title: string;
  department: string;
  primaryCodes: CalipsCategory[];
  degreeTypes: string[]; // e.g. ["B.S.", "B.A.", "B.Eng"]
  overview: string;
  coreSubjects: string[];
  careerProspects: string[];
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  flag: string;
  rankingTier: 'World Top 20' | 'World Top 50' | 'World Top 100' | 'Leading National' | 'Specialized Institute';
  departments: string[];
  popularPrograms: string[];
  calipsAffinity: CalipsCategory[];
  acceptanceRate: string;
  website: string;
  tuitionInfo: string;
  description: string;
}
