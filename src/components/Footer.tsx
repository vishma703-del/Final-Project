import React from 'react';
import { Compass, ShieldCheck, Heart, Sparkles, Database } from 'lucide-react';
import { CALIPS_CATEGORIES } from '../data/calipsData.ts';
import { CalipsCategory } from '../types/index.ts';

interface FooterProps {
  setCurrentTab: (tab: 'home' | 'assessment' | 'interest' | 'universities' | 'dashboard' | 'result') => void;
  openDbModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, openDbModal }) => {
  const categoriesList: CalipsCategory[] = ['C', 'A', 'L', 'I', 'P', 'S'];

  return (
    <footer className="border-t border-slate-800/80 bg-[#070a12] text-slate-400 mt-24">
      {/* Exploration Disclaimer Banner */}
      <div className="bg-indigo-950/40 border-b border-indigo-500/20 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-indigo-200/90 leading-relaxed">
            <span className="font-semibold text-white">Career Exploration Notice:</span> The PathCode CALIPS
            assessment is designed as an interactive self-discovery and direction-finding tool for students — not
            as a definitive prediction or rigid boundary for someone's future. Your interests, passions, and skills
            evolve continuously through hands-on experience, university education, and creative experimentation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-['Space_Grotesk'] text-lg font-bold text-white tracking-tight">
                PathCode
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decode your interest. Discover your direction. Empowering Gen-Z students to explore authentic careers,
              majors, and global universities without anxiety or guesswork.
            </p>
            <div className="pt-2">
              <button
                onClick={openDbModal}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Supabase RLS & Firebase Ready</span>
              </button>
            </div>
          </div>

          {/* CALIPS 6 Dimensions */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              The CALIPS Framework Dimensions
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categoriesList.map((cat) => {
                const info = CALIPS_CATEGORIES[cat];
                return (
                  <div
                    key={cat}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold font-mono bg-slate-800 text-white">
                        {cat}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">{info.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{info.archetype}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentTab('assessment')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Discover My Career (60-Q Test)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('interest')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  I Know My Interest
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('universities')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Worldwide University Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Student History & Saved Majors
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PathCode. Decode your interest. Discover your direction.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Gen-Z Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
