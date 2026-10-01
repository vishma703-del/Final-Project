import React from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Shield,
  Layers,
  Users,
  Brain,
  Wrench,
  Palette,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { CALIPS_CATEGORIES } from '../data/calipsData.ts';
import { CalipsCategory } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface HomeHeroProps {
  onSelectAssessment: () => void;
  onSelectInterest: () => void;
  onSelectUniversities: () => void;
  openAuthModal: (mode: 'login' | 'register') => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onSelectAssessment,
  onSelectInterest,
  onSelectUniversities,
  openAuthModal,
}) => {
  const { isAuthenticated, currentUser, loginAsDemoStudent } = useAuth();
  const categoriesList: CalipsCategory[] = ['C', 'A', 'L', 'I', 'P', 'S'];

  const categoryIcons: Record<CalipsCategory, React.ReactNode> = {
    C: <CheckCircle2 className="w-5 h-5 text-amber-400" />,
    A: <Palette className="w-5 h-5 text-pink-400" />,
    L: <Briefcase className="w-5 h-5 text-rose-400" />,
    I: <Brain className="w-5 h-5 text-cyan-400" />,
    P: <Wrench className="w-5 h-5 text-emerald-400" />,
    S: <Users className="w-5 h-5 text-violet-400" />,
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Header */}
      <section className="relative pt-12 md:pt-16 text-center max-w-4xl mx-auto px-4">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
          <span>Gen-Z Career Guidance & University Navigator</span>
        </div>

        <h1 className="font-['Space_Grotesk'] text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Decode your interest.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-300">
            Discover your direction.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Tired of generic advice and career confusion? PathCode translates your genuine curiosity and behavioral
          strengths into tangible careers, college majors, and authentic global university programs.
        </p>

        {/* Demo login shortcut for fast reviewer testing */}
        {!isAuthenticated && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-xs text-slate-400">Want to test instantly?</span>
            <button
              onClick={loginAsDemoStudent}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 cursor-pointer"
            >
              Sign In as Demo Student (Maya, CS Freshman)
            </button>
          </div>
        )}
      </section>

      {/* TWO PRIMARY PATHWAYS (THE HERO CARDS) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest font-mono text-indigo-400 font-semibold">
            Choose Your Starting Point
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Two Ways to Unlock Your Future
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: Discover My Career */}
          <div
            onClick={onSelectAssessment}
            className="group relative rounded-3xl p-8 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-indigo-500/60 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient hover glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Compass className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
                  Comprehensive • 60 Questions
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Discover My Career
                </h3>
                <p className="text-sm font-medium text-slate-400 mt-1">
                  The Complete 60-Question CALIPS Assessment
                </p>
              </div>

              <p className="text-sm text-slate-300/90 leading-relaxed">
                Answer 10 intuitive True/False questions across each of the 6 dimensions: Conventional, Artistic,
                Leadership, Investigative, Practical, and Social.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Calculates and ranks your 6 dimension scores (0–10 each)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Generates your official top 3-letter PathCode (e.g. IAS, LIC, AIP)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>Unlocks matched careers, majors, skills to build & university programs</span>
                </div>
              </div>
            </div>

            <div className="pt-8 relative">
              <div className="flex items-center justify-between py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all group-hover:shadow-indigo-500/50">
                <span>Start Assessment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: I Know My Interest */}
          <div
            onClick={onSelectInterest}
            className="group relative rounded-3xl p-8 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-cyan-500/60 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient hover glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Fast Track • No Assessment
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  I Know My Interest
                </h3>
                <p className="text-sm font-medium text-slate-400 mt-1">
                  Direct Field, Program & University Mapping
                </p>
              </div>

              <p className="text-sm text-slate-300/90 leading-relaxed">
                Already passionate about Artificial Intelligence, Game Design, BioTech, Architecture, or Finance?
                Skip the test and dive straight into tailored insights.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Filter by intended department and interest keywords</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Discover high-growth career roles, salaries & required skills</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Explore authentic universities filtered by country & specific city</span>
                </div>
              </div>
            </div>

            <div className="pt-8 relative">
              <div className="flex items-center justify-between py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 hover:border-cyan-500/40 transition-all">
                <span>Explore Interests Directly</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALIPS 6 DIMENSIONS SPOTLIGHT */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/90 relative overflow-hidden">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase tracking-widest font-mono text-pink-400 font-semibold">
              The Science of Direction
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              The 6 CALIPS Dimensions
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Adapted from John Holland's proven vocational models and modernized for Gen-Z frontier careers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriesList.map((cat) => {
              const info = CALIPS_CATEGORIES[cat];
              return (
                <div
                  key={cat}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center font-bold font-mono text-white text-sm">
                        {cat}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{info.name}</h4>
                        <span className="text-xs text-indigo-400 font-medium">{info.archetype}</span>
                      </div>
                    </div>
                    {categoryIcons[cat]}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {info.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {info.traits.slice(0, 3).map((trait) => (
                      <span
                        key={trait}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AUTHENTIC UNIVERSITIES CALLOUT */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <GraduationCap className="w-4 h-4" />
              <span>Authentic Global University Directory</span>
            </div>
            <h3 className="text-2xl font-bold text-white">
              Explore Universities by Country & City
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Explore authentic top-tier institutions across the United States, United Kingdom, Canada, Australia,
              Germany, Singapore, Switzerland, Japan, India, Pakistan, UAE, and more. Filter by city, academic
              department, and CALIPS affinity.
            </p>
          </div>

          <button
            onClick={onSelectUniversities}
            className="shrink-0 flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <span>Browse All Countries & Cities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
