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
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { getSupabaseConfig } from '../lib/supabaseClient.ts';

interface NavbarProps {
  currentTab: 'home' | 'assessment' | 'interest' | 'universities' | 'dashboard' | 'result';
  setCurrentTab: (tab: 'home' | 'assessment' | 'interest' | 'universities' | 'dashboard' | 'result') => void;
  openAuthModal: (mode: 'login' | 'register') => void;
  openDbModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openAuthModal,
  openDbModal,
}) => {
  const { currentUser, isAuthenticated, logout, loginAsDemoStudent } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const supabaseConfig = getSupabaseConfig();

  const handleNavClick = (tab: NavbarProps['currentTab']) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b0f19]/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 opacity-0 group-hover:opacity-40 blur transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                  PathCode
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Gen-Z
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-normal">
                Decode your interest. Discover your direction.
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'home'
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('assessment')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'assessment' || currentTab === 'result'
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Discover My Career</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 font-semibold">
                60Q
              </span>
            </button>

            <button
              onClick={() => handleNavClick('interest')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'interest'
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>I Know My Interest</span>
            </button>

            <button
              onClick={() => handleNavClick('universities')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'universities'
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Universities</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Dashboard</span>
              </button>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* Supabase & Firebase RLS Status Pill */}
            <button
              onClick={openDbModal}
              title="Database & Auth Config (Supabase RLS & Firebase)"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-700/80 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all cursor-pointer shadow-inner"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">Supabase & Firebase</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {isAuthenticated && currentUser ? (
              /* User Profile Menu */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                >
                  <img
                    src={
                      currentUser.avatarUrl ||
                      `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(currentUser.name)}`
                    }
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/50"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-white leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-indigo-400 truncate max-w-[100px]">
                      {currentUser.department || 'Student'}
                    </p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 backdrop-blur-2xl">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {currentUser.school} • Age {currentUser.age}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                        Student Dashboard
                      </button>

                      <button
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-pink-400" />
                        Saved Careers ({currentUser.savedCareers?.length || 0})
                      </button>

                      <button
                        onClick={openDbModal}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <Database className="w-4 h-4 text-emerald-400" />
                        Database & RLS Schema
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Actions */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-1">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              Home
            </button>
            <button
              onClick={() => handleNavClick('assessment')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Discover My Career</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                60Q CALIPS
              </span>
            </button>
            <button
              onClick={() => handleNavClick('interest')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              I Know My Interest
            </button>
            <button
              onClick={() => handleNavClick('universities')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Universities Directory
            </button>
            {isAuthenticated && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                Dashboard
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openDbModal();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              Database & RLS Configuration
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
