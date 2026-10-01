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
import { DatabaseConfigModal } from './components/DatabaseConfigModal.tsx';
import { AssessmentResult } from './types/index.ts';

import { ErrorBoundary } from './components/ErrorBoundary.tsx';

type NavigationTab = 'home' | 'assessment' | 'interest' | 'universities' | 'dashboard' | 'result';

function MainAppContent() {
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

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openAuthModal={handleOpenAuth}
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
            <h3 className="text-xl font-bold text-white">No Assessment Found</h3>
            <p className="text-xs text-slate-400">
              You haven't completed a CALIPS assessment yet. Take the 60-question test to decode your PathCode.
            </p>
            <button
              onClick={handleStartAssessment}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
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
