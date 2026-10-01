import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomeHero } from './components/HomeHero.tsx';
import { AssessmentRunner } from './components/AssessmentRunner.tsx';
import { ResultView } from './components/ResultView.tsx';
import { InterestExplorer } from './components/InterestExplorer.tsx';
import { UniversitySearch } from './components/UniversitySearch.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { AuthGate } from './components/AuthGate.tsx';
import { DatabaseConfigModal } from './components/DatabaseConfigModal.tsx';
import { AssessmentResult } from './types/index.ts';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

type NavigationTab = 'home' | 'assessment' | 'interest' | 'universities' | 'dashboard' | 'result';

function MainAppContent() {
  const { currentUser, isLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [dbModalOpen, setDbModalOpen] = useState(false);

  const { latestResult, setLatestResult } = useAssessment();

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleStartAssessment = () => {
    setCurrentTab('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssessmentComplete = () => {
    setCurrentTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewPastResult = (result: AssessmentResult) => {
    setLatestResult(result);
    setCurrentTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Initial authentication loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">PathCode</p>
          <p className="text-xs text-slate-500">Decode your interest. Discover your direction.</p>
        </div>
      </div>
    );
  }

  // 2. Mandatory Login Gate:
  // "Whenever you open the website, the first step should be logging in, without it you can not further proceed."
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-indigo-50/30 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
        <AuthGate
          onSuccess={() => {
            setCurrentTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          openDbModal={() => setDbModalOpen(true)}
        />
        <DatabaseConfigModal
          isOpen={dbModalOpen}
          onClose={() => setDbModalOpen(false)}
        />
      </div>
    );
  }

  // 3. Daylight Pop Theme Main Application View
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] via-[#fcfdfe] to-[#f1f5f9] text-slate-800 selection:bg-indigo-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openDbModal={() => setDbModalOpen(true)}
      />

      {/* Main View Controller */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeHero
            onSelectAssessment={handleStartAssessment}
            onSelectInterest={() => setCurrentTab('interest')}
            onSelectUniversities={() => setCurrentTab('universities')}
            openAuthModal={handleOpenAuth}
          />
        )}

        {currentTab === 'assessment' && (
          <AssessmentRunner
            onComplete={handleAssessmentComplete}
            onCancel={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'result' && latestResult && (
          <ResultView
            result={latestResult}
            onRetake={handleStartAssessment}
            onExploreUniversities={() => setCurrentTab('universities')}
          />
        )}

        {currentTab === 'result' && !latestResult && (
          <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
            <h3 className="text-xl font-bold text-slate-900">No Assessment Found</h3>
            <p className="text-xs text-slate-500">
              You haven't completed a CALIPS assessment yet. Take the 60-question test to decode your PathCode.
            </p>
            <button
              onClick={handleStartAssessment}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 cursor-pointer transition-all"
            >
              Start 60Q Assessment
            </button>
          </div>
        )}

        {currentTab === 'interest' && <InterestExplorer />}

        {currentTab === 'universities' && <UniversitySearch />}

        {currentTab === 'dashboard' && (
          <Dashboard
            onStartAssessment={handleStartAssessment}
            onExploreInterest={() => setCurrentTab('interest')}
            onViewResult={handleViewPastResult}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer
        setCurrentTab={setCurrentTab}
        openDbModal={() => setDbModalOpen(true)}
      />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <DatabaseConfigModal
        isOpen={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AssessmentProvider>
          <MainAppContent />
        </AssessmentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
