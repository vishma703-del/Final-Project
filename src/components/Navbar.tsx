import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Database,
  User,
  LogOut,
  Menu,
  X,
  Bookmark,
  Banknote,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  currentTab: 'home' | 'assessment' | 'interest' | 'universities' | 'dashboard' | 'result';
  setCurrentTab: (tab: 'home' | 'assessment' | 'interest' | 'universities' | 'dashboard' | 'result') => void;
  openDbModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openDbModal,
}) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (tab: NavbarProps['currentTab']) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-slate-200/80 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  PathCode
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                  Daylight Pop
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block tracking-normal">
                Decode your interest. Discover your direction.
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('assessment')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'assessment' || currentTab === 'result'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Discover My Career</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-700 font-bold">
                60Q
              </span>
            </button>

            <button
              onClick={() => handleNavClick('interest')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'interest'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-600" />
              <span>I Know My Interest</span>
            </button>

            <button
              onClick={() => handleNavClick('universities')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentTab === 'universities'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Universities</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* PKR Currency Indicator Badge */}
            <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
              <Banknote className="w-3.5 h-3.5 text-amber-600" />
              <span>Currency: PKR</span>
            </div>

            {/* Supabase & Firebase RLS Status Pill */}
            <button
              onClick={openDbModal}
              title="Database & Auth Config (Supabase RLS & Firebase)"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 transition-all cursor-pointer shadow-xs"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-semibold">Supabase & Firebase</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>

            {isAuthenticated && currentUser && (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer"
                >
                  <img
                    src={
                      currentUser.avatarUrl ||
                      `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(currentUser.name)}`
                    }
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/40"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-indigo-600 truncate max-w-[100px] font-medium">
                      {currentUser.department || 'Student'}
                    </p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <p className="text-[10px] text-indigo-600 font-mono mt-1">
                        Password: {currentUser.assignedPassword || 'Assigned'}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                        Student Dashboard
                      </button>

                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-pink-500" />
                        Saved Careers ({currentUser.savedCareers?.length || 0})
                      </button>

                      <button
                        onClick={openDbModal}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <Database className="w-4 h-4 text-emerald-600" />
                        Database & RLS Schema
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-1 bg-white">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              Home
            </button>
            <button
              onClick={() => handleNavClick('assessment')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>Discover My Career</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-bold">
                60Q CALIPS
              </span>
            </button>
            <button
              onClick={() => handleNavClick('interest')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <BookOpen className="w-4 h-4 text-cyan-600" />
              I Know My Interest
            </button>
            <button
              onClick={() => handleNavClick('universities')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Universities Directory
            </button>
            {isAuthenticated && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                Dashboard
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openDbModal();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-100"
            >
              <Database className="w-4 h-4 text-emerald-600" />
              Database & RLS Configuration
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
