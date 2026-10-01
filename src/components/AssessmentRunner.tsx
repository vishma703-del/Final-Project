import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Zap,
  ListFilter,
  ShieldAlert,
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext.tsx';
import { CALIPS_CATEGORIES } from '../data/calipsData.ts';
import { CalipsCategory } from '../types/index.ts';

interface AssessmentRunnerProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({ onComplete, onCancel }) => {
  const {
    questions,
    answers,
    currentQuestionIndex,
    completedCount,
    totalQuestions,
    progressPercentage,
    setAnswer,
    goToNext,
    goToPrevious,
    jumpToQuestion,
    resetAssessment,
    fillSampleAnswers,
    finishAssessment,
    isSubmitting,
  } = useAssessment();

  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const currentQ = questions[currentQuestionIndex];
  const categoryInfo = CALIPS_CATEGORIES[currentQ.category];
  const currentAnswer = answers[currentQ.id];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 't' || e.key === 'T' || e.key === '1') {
        handleSelectAnswer(true);
      } else if (e.key === 'f' || e.key === 'F' || e.key === '2') {
        handleSelectAnswer(false);
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, currentQ.id]);

  const handleSelectAnswer = (val: boolean) => {
    setAnswer(currentQ.id, val);
    // Smooth auto-advance to next question if not at end
    if (currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => {
        goToNext();
      }, 160);
    }
  };

  const handleFinish = async () => {
    await finishAssessment();
    onComplete();
  };

  // Group questions by category for quick overview
  const categorySummary: Record<CalipsCategory, { total: number; answered: number }> = {
    C: { total: 10, answered: 0 },
    A: { total: 10, answered: 0 },
    L: { total: 10, answered: 0 },
    I: { total: 10, answered: 0 },
    P: { total: 10, answered: 0 },
    S: { total: 10, answered: 0 },
  };

  questions.forEach((q) => {
    if (answers[q.id] !== undefined) {
      categorySummary[q.category].answered += 1;
    }
  });

  const categoriesOrder: CalipsCategory[] = ['C', 'A', 'L', 'I', 'P', 'S'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Controls & Category Nav */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </button>

          {/* Quick Evaluator Helpers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => fillSampleAnswers('I')}
              title="Autofill realistic answers for quick evaluation"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Test Fill</span>
            </button>

            <button
              onClick={() => setShowQuestionGrid(!showQuestionGrid)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Grid ({completedCount}/60)</span>
            </button>

            <button
              onClick={resetAssessment}
              title="Reset all answers"
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-indigo-400 font-mono">
              {completedCount} answered ({progressPercentage}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Category Step Pills */}
        <div className="grid grid-cols-6 gap-1.5 pt-1">
          {categoriesOrder.map((cat) => {
            const isCurrentCat = currentQ.category === cat;
            const stats = categorySummary[cat];
            const isFull = stats.answered === stats.total;

            return (
              <button
                key={cat}
                onClick={() => {
                  const firstQIdx = questions.findIndex((q) => q.category === cat);
                  if (firstQIdx !== -1) jumpToQuestion(firstQIdx);
                }}
                className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer ${
                  isCurrentCat
                    ? 'bg-indigo-600/30 border-2 border-indigo-500 text-white shadow-md'
                    : isFull
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold font-mono">{cat}</div>
                <div className="text-[10px] opacity-80">
                  {stats.answered}/{stats.total}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popover / Collapsible Question Jump Grid */}
      {showQuestionGrid && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Jump to any question (60 Questions)
            </h4>
            <span className="text-xs text-slate-400">Green = Answered</span>
          </div>

          <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5">
            {questions.map((q, idx) => {
              const answered = answers[q.id] !== undefined;
              const isCurrent = idx === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    jumpToQuestion(idx);
                    setShowQuestionGrid(false);
                  }}
                  className={`h-8 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    isCurrent
                      ? 'ring-2 ring-indigo-400 bg-indigo-600 text-white'
                      : answered
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {q.id}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MAIN QUESTION CARD */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden min-h-[380px] flex flex-col justify-between">
        {/* Subtle category gradient background accent */}
        <div
          className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none bg-gradient-to-br ${categoryInfo.color}`}
        />

        <div className="relative space-y-6">
          {/* Category Tag Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 border border-slate-700 text-white">
                Category {currentQ.category}
              </span>
              <span className="text-sm font-semibold text-indigo-400">
                {currentQ.categoryTitle}: {currentQ.categorySubtitle}
              </span>
            </div>

            <span className="text-xs font-mono text-slate-400">
              Q{currentQ.id} of 60
            </span>
          </div>

          {/* The Big Question Text */}
          <div className="py-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-snug tracking-tight">
              "{currentQ.question}"
            </h2>
            <p className="text-xs text-slate-400 mt-3">
              Be authentic — choose what feels natural to your genuine instincts.
            </p>
          </div>
        </div>

        {/* TRUE / FALSE SELECTION BUTTONS */}
        <div className="relative pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* TRUE BUTTON */}
            <button
              onClick={() => handleSelectAnswer(true)}
              className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                currentAnswer === true
                  ? 'bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/20 text-white'
                  : 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    currentAnswer === true
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-emerald-400 group-hover:bg-emerald-500/20'
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">YES / TRUE</div>
                  <div className="text-xs text-slate-400">This describes me well</div>
                </div>
              </div>

              <kbd className="hidden sm:inline-block px-2 py-1 text-[11px] font-mono text-slate-400 bg-slate-800/90 rounded border border-slate-700">
                Key: T
              </kbd>
            </button>

            {/* FALSE BUTTON */}
            <button
              onClick={() => handleSelectAnswer(false)}
              className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                currentAnswer === false
                  ? 'bg-rose-500/15 border-rose-500 shadow-lg shadow-rose-500/20 text-white'
                  : 'bg-slate-950/60 border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/80 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    currentAnswer === false
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-slate-800 text-rose-400 group-hover:bg-rose-500/20'
                  }`}
                >
                  <X className="w-5 h-5 stroke-[3]" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">NO / FALSE</div>
                  <div className="text-xs text-slate-400">Not really my preference</div>
                </div>
              </div>

              <kbd className="hidden sm:inline-block px-2 py-1 text-[11px] font-mono text-slate-400 bg-slate-800/90 rounded border border-slate-700">
                Key: F
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM NAVIGATION ACTIONS */}
      <div className="flex items-center justify-between mt-6 gap-3">
        <button
          onClick={goToPrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {completedCount >= 30 && (
            <button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {completedCount === totalQuestions
                  ? 'Calculate & Reveal PathCode'
                  : `Calculate with ${completedCount}/60 Answers`}
              </span>
            </button>
          )}

          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={goToNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Generate My PathCode!</span>
            </button>
          )}
        </div>
      </div>

      {/* Exploration Reminder Footnote */}
      <div className="mt-8 text-center text-xs text-slate-500 max-w-xl mx-auto">
        <span>
          Remember: PathCode is an exploratory navigator to unlock possibilities. You are never locked into a single
          result.
        </span>
      </div>
    </div>
  );
};
