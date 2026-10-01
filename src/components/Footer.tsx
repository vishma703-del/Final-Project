import React from 'react';
import { Compass, ShieldCheck, Heart, Database, Banknote } from 'lucide-react';
import { CALIPS_CATEGORIES } from '../data/calipsData.ts';
import { CalipsCategory } from '../types/index.ts';

interface FooterProps {
  setCurrentTab: (tab: 'home' | 'assessment' | 'interest' | 'universities' | 'dashboard' | 'result') => void;
  openDbModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, openDbModal }) => {
  const categoriesList: CalipsCategory[] = ['C', 'A', 'L', 'I', 'P', 'S'];

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 mt-20">
      {/* Exploration Disclaimer Banner */}
      <div className="bg-indigo-50/70 border-b border-indigo-100 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-indigo-950 leading-relaxed font-medium">
            <span className="font-bold text-indigo-900">Career Exploration Notice:</span> The PathCode CALIPS
            assessment is designed as an interactive self-discovery and direction-finding tool for students — not
            as a definitive prediction or rigid boundary for someone's future. Your interests, passions, and skills
            evolve continuously through experience, university education, and real-world experimentation. All financial figures are denominated in PKR.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold shadow-sm">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-['Space_Grotesk'] text-lg font-bold text-slate-900 tracking-tight">
                PathCode
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Decode your interest. Discover your direction. Empowering Gen-Z students to explore authentic careers,
              majors, and global universities without anxiety or guesswork.
            </p>
            <div className="pt-2 flex flex-col gap-1.5">
              <button
                onClick={openDbModal}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-mono font-semibold transition-colors cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase RLS & Firebase Enabled</span>
              </button>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
                <Banknote className="w-3.5 h-3.5 text-amber-600" />
                <span>Currency: Pakistani Rupee (PKR)</span>
              </div>
            </div>
          </div>

          {/* CALIPS 6 Dimensions */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              The CALIPS Framework Dimensions
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categoriesList.map((cat) => {
                const info = CALIPS_CATEGORIES[cat];
                return (
                  <div
                    key={cat}
                    className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold font-mono bg-white text-slate-800 border border-slate-200">
                        {cat}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{info.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{info.archetype}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <button
                  onClick={() => setCurrentTab('assessment')}
                  className="hover:text-indigo-600 transition-colors text-slate-600"
                >
                  Discover My Career (60Q Test)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('interest')}
                  className="hover:text-indigo-600 transition-colors text-slate-600"
                >
                  I Know My Interest
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('universities')}
                  className="hover:text-indigo-600 transition-colors text-slate-600"
                >
                  Worldwide University Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="hover:text-indigo-600 transition-colors text-slate-600"
                >
                  Student Dashboard & History
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PathCode. Decode your interest. Discover your direction.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Gen-Z Students Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
