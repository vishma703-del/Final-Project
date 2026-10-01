import React from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
  Brain,
  Wrench,
  Palette,
  Briefcase,
  CheckCircle2,
  Banknote,
  Globe2,
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
}) => {
  const { currentUser } = useAuth();
  const categoriesList: CalipsCategory[] = ['C', 'A', 'L', 'I', 'P', 'S'];

  const categoryIcons: Record<CalipsCategory, React.ReactNode> = {
    C: <CheckCircle2 className="w-5 h-5 text-amber-500" />,
    A: <Palette className="w-5 h-5 text-pink-500" />,
    L: <Briefcase className="w-5 h-5 text-rose-500" />,
    I: <Brain className="w-5 h-5 text-cyan-600" />,
    P: <Wrench className="w-5 h-5 text-emerald-600" />,
    S: <Users className="w-5 h-5 text-violet-600" />,
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Header */}
      <section className="relative pt-10 sm:pt-14 text-center max-w-4xl mx-auto px-4">
        {/* Daylight ambient background accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-700 text-xs font-bold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>Gen-Z Career Guidance & Worldwide University Navigator</span>
        </div>

        <h1 className="font-['Space_Grotesk'] text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
          Decode your interest.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-500">
            Discover your direction.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Tired of career confusion? PathCode translates your natural behavioral strengths into tangible careers,
          college majors, and authentic universities worldwide.
        </p>

        {/* Currency & Welcome Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Banknote className="w-3.5 h-3.5 text-amber-600" />
            <span>All Tuition & Salary Figures in PKR</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total Countries & Authentic Universities</span>
          </div>
        </div>
      </section>

      {/* TWO PRIMARY PATHWAYS (THE HERO CARDS) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest font-mono text-indigo-600 font-bold">
            Choose Your Starting Point
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Two Ways to Unlock Your Future
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: Discover My Career */}
          <div
            onClick={onSelectAssessment}
            className="group relative rounded-3xl p-8 bg-white border border-slate-200 hover:border-indigo-500 shadow-xl shadow-indigo-500/5 hover:shadow-indigo-500/15 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <Compass className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                  Comprehensive • 60 Questions
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Discover My Career
                </h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  The Complete 60-Question CALIPS Assessment
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Answer 10 intuitive True/False questions across each of the 6 dimensions: Conventional, Artistic,
                Leadership, Investigative, Practical, and Social.
              </p>

              <div className="space-y-2 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Calculates and ranks your 6 dimension scores (0–10 each)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Generates your official top 3-letter PathCode (e.g. IAS, LIC, AIP)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <span>Matched careers, majors, skills to build & authentic universities (in PKR)</span>
                </div>
              </div>
            </div>

            <div className="pt-8 relative">
              <div className="flex items-center justify-between py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all">
                <span>Start 60-Question Assessment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: I Know My Interest */}
          <div
            onClick={onSelectInterest}
            className="group relative rounded-3xl p-8 bg-white border border-slate-200 hover:border-cyan-500 shadow-xl shadow-cyan-500/5 hover:shadow-cyan-500/15 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                  Fast Track • No Assessment
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                  I Know My Interest
                </h3>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  Direct Field, Program & University Mapping
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Already passionate about Artificial Intelligence, Game Design, BioTech, Architecture, or Finance?
                Skip the test and explore matched careers and authentic global universities directly.
              </p>

              <div className="space-y-2 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                  <span>Filter by intended department and interest keywords</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                  <span>Career roles, required skills & salaries displayed in PKR</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
                  <span>Explore authentic universities across total countries & cities worldwide</span>
                </div>
              </div>
            </div>

            <div className="pt-8 relative">
              <div className="flex items-center justify-between py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all">
                <span>Explore Interests Directly</span>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALIPS 6 DIMENSIONS SPOTLIGHT */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="max-w-2xl mb-8">
            <span className="text-xs uppercase tracking-widest font-mono text-pink-600 font-bold">
              The Science of Direction
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              The 6 CALIPS Dimensions
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Adapted from John Holland's proven vocational models and modernized for Gen-Z frontier careers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriesList.map((cat) => {
              const info = CALIPS_CATEGORIES[cat];
              return (
                <div
                  key={cat}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-indigo-300 hover:bg-white transition-all group shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold font-mono text-slate-900 text-sm shadow-xs">
                        {cat}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{info.name}</h4>
                        <span className="text-xs text-indigo-600 font-bold">{info.archetype}</span>
                      </div>
                    </div>
                    {categoryIcons[cat]}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {info.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {info.traits.slice(0, 3).map((trait) => (
                      <span
                        key={trait}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200"
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
        <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-indigo-50 via-pink-50 to-amber-50 border border-indigo-200 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700">
              <GraduationCap className="w-4 h-4" />
              <span>Authentic Global University Directory</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Total World Countries & Authentic Universities
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore authentic institutions across Pakistan, the United States, United Kingdom, Canada, Australia,
              Germany, Singapore, Switzerland, Japan, and all global nations. Direct access links to official
              university portals and tuition displayed in PKR.
            </p>
          </div>

          <button
            onClick={onSelectUniversities}
            className="shrink-0 flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>Browse Total Countries</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
