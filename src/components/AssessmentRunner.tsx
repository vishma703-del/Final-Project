import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Zap,
  ListFilter,
  ShieldCheck,
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
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Overview</span>
          </button>

          {/* Quick Evaluator Helpers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => fillSampleAnswers('I')}
              title="Autofill realistic answers for quick evaluation"
              className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Quick Test Fill</span>
            </button>

            <button
              onClick={() => setShowQuestionGrid(!showQuestionGrid)}
              className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-xs"
            >
              <ListFilter className="w-3.5 h-3.5 text-slate-500" />
              <span>Grid ({completedCount}/60)</span>
            </button>

            <button
              onClick={resetAssessment}
              title="Reset all answers"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-indigo-600 font-mono">
              {completedCount} answered ({progressPercentage}%)
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Category Step Pills */}
        <div className="grid grid-cols-6 gap-2 pt-1">
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
                className={`py-2 px-1 rounded-2xl text-center transition-all cursor-pointer ${
                  isCurrentCat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : isFull
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-black font-mono">{cat}</div>
                <div className="text-[10px] opacity-80 font-semibold">
                  {stats.answered}/{stats.total}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popover / Collapsible Question Jump Grid */}
      {showQuestionGrid && (
        <div className="mb-6 p-5 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Jump to any question (60 Questions)
            </h4>
            <span className="text-xs text-emerald-600 font-semibold">Green = Answered</span>
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
                  className={`h-8 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                    isCurrent
                      ? 'ring-2 ring-indigo-500 bg-indigo-600 text-white shadow'
                      : answered
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
      <div className="relative rounded-3xl p-6 sm:p-10 bg-white border border-slate-200 shadow-xl shadow-indigo-500/5 min-h-[380px] flex flex-col justify-between overflow-hidden">
        <div className="relative space-y-6">
          {/* Category Tag Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Dimension {currentQ.category}
              </span>
              <span className="text-sm font-bold text-slate-800">
                {currentQ.categoryTitle}: {currentQ.categorySubtitle}
              </span>
            </div>

            <span className="text-xs font-mono text-slate-400 font-semibold">
              Question {currentQ.id} of 60
            </span>
          </div>

          {/* Question Text */}
          <div className="py-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug tracking-tight">
              "{currentQ.question}"
            </h2>
            <p className="text-xs text-slate-500 mt-3 font-medium">
              Choose what feels most natural to you. There are no right or wrong answers.
            </p>
          </div>
        </div>

        {/* TRUE / FALSE DAYLIGHT BUTTONS */}
        <div className="relative pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* TRUE BUTTON */}
            <button
              onClick={() => handleSelectAnswer(true)}
              className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                currentAnswer === true
                  ? 'bg-emerald-50 border-emerald-500 shadow-md shadow-emerald-500/10 text-emerald-950'
                  : 'bg-slate-50/80 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    currentAnswer === true
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'bg-white border border-slate-200 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">YES / TRUE</div>
                  <div className="text-xs text-slate-500 font-medium">This describes me well</div>
                </div>
              </div>

              <kbd className="hidden sm:inline-block px-2 py-1 text-[11px] font-mono text-slate-500 bg-white rounded border border-slate-200">
                Key: T
              </kbd>
            </button>

            {/* FALSE BUTTON */}
            <button
              onClick={() => handleSelectAnswer(false)}
              className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                currentAnswer === false
                  ? 'bg-rose-50 border-rose-500 shadow-md shadow-rose-500/10 text-rose-950'
                  : 'bg-slate-50/80 border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    currentAnswer === false
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-white border border-slate-200 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'
                  }`}
                >
                  <X className="w-5 h-5 stroke-[3]" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">NO / FALSE</div>
                  <div className="text-xs text-slate-500 font-medium">Not really my preference</div>
                </div>
              </div>

              <kbd className="hidden sm:inline-block px-2 py-1 text-[11px] font-mono text-slate-500 bg-white rounded border border-slate-200">
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer text-xs font-bold shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {completedCount >= 30 && (
            <button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Generate My PathCode!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
