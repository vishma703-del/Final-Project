import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  RotateCcw,
  CheckCircle2,
  ListFilter,
  AlertCircle,
  HelpCircle,
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
    finishAssessment,
    isSubmitting,
  } = useAssessment();

  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const currentQ = questions[currentQuestionIndex];
  const categoryInfo = CALIPS_CATEGORIES[currentQ.category];
  const currentAnswer = answers[currentQ.id];

  const remainingCount = totalQuestions - completedCount;
  const isAllAnswered = completedCount === totalQuestions;

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
        if (currentQuestionIndex < totalQuestions - 1) {
          goToNext();
        }
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, currentQ.id]);

  const handleSelectAnswer = (val: boolean) => {
    setAnswer(currentQ.id, val);
    setWarningMessage(null);
    if (currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => {
        goToNext();
      }, 160);
    }
  };

  const handleJumpToFirstUnanswered = () => {
    const idx = questions.findIndex((q) => answers[q.id] === undefined);
    if (idx !== -1) {
      jumpToQuestion(idx);
      setWarningMessage(null);
    }
  };

  const handleFinish = async () => {
    if (!isAllAnswered) {
      setWarningMessage(
        `The Discover my career assessment will only proceed after answering all 60 questions. You have answered ${completedCount}/60 (${remainingCount} questions remaining).`
      );
      return;
    }

    try {
      await finishAssessment();
      onComplete();
    } catch (err: any) {
      setWarningMessage(err.message || 'Could not complete assessment.');
    }
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuestionGrid(!showQuestionGrid)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-xs"
            >
              <ListFilter className="w-3.5 h-3.5 text-slate-500" />
              <span>Questions Grid ({completedCount}/60)</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all 60 answers?')) {
                  resetAssessment();
                  setWarningMessage(null);
                }
              }}
              title="Reset all answers"
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-800">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-indigo-600 font-mono">
                {completedCount}/60 answered ({progressPercentage}%)
              </span>
              {!isAllAnswered && (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {remainingCount} to go
                </span>
              )}
            </div>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500">
            Note: The Discover My Career assessment will strictly proceed to calculate your PathCode only after answering all 60 questions.
          </p>
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

      {/* Warning Alert if user attempts premature completion */}
      {warningMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{warningMessage}</span>
          </div>
          <button
            onClick={handleJumpToFirstUnanswered}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg shrink-0 cursor-pointer"
          >
            Jump to Unanswered
          </button>
        </div>
      )}

      {/* Popover / Collapsible Question Jump Grid */}
      {showQuestionGrid && (
        <div className="mb-6 p-5 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Jump to any question (All 60 required)
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
                  className={`h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                    isCurrent
                      ? 'ring-2 ring-indigo-600 bg-indigo-50 text-indigo-700'
                      : answered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
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
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-10 space-y-8 relative overflow-hidden">
        {/* Subtle decorative background gradient accent */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-indigo-50 via-pink-50 to-transparent pointer-events-none rounded-bl-full" />

        {/* Dimension & Archetype Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-600 text-white font-mono font-black text-base shadow-md shadow-indigo-600/20">
              {currentQ.category}
            </span>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 font-extrabold block">
                Dimension: {categoryInfo.name}
              </span>
              <span className="text-xs text-slate-500 font-bold">{categoryInfo.archetype}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block font-semibold">
              Dimension Progress
            </span>
            <span className="text-xs font-bold text-slate-700">
              {categorySummary[currentQ.category].answered} of 10
            </span>
          </div>
        </div>

        {/* The Question Text */}
        <div className="space-y-4 py-4 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            Statement #{currentQ.id} of 60
          </span>
          <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
            "{currentQ.question}"
          </h2>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Answer honestly based on your genuine instinct. There are no right or wrong answers.</span>
          </p>
        </div>

        {/* True / False Interactive Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 relative z-10">
          {/* TRUE BUTTON */}
          <button
            onClick={() => handleSelectAnswer(true)}
            className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer group ${
              currentAnswer === true
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-md shadow-emerald-500/10'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  currentAnswer === true
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-white border border-slate-200 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                }`}
              >
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold">YES / TRUE</div>
                <div className="text-xs text-slate-500 font-medium">Sounds like me</div>
              </div>
            </div>

            <kbd className="hidden sm:inline-block px-2 py-1 text-[11px] font-mono text-slate-500 bg-white rounded border border-slate-200">
              Key: T
            </kbd>
          </button>

          {/* FALSE BUTTON */}
          <button
            onClick={() => handleSelectAnswer(false)}
            className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer group ${
              currentAnswer === false
                ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-md shadow-rose-500/10'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-rose-400 hover:bg-rose-50/40'
            }`}
          >
            <div className="flex items-center gap-4">
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

      {/* BOTTOM NAVIGATION ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <button
          onClick={goToPrevious}
          disabled={currentQuestionIndex === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer text-xs font-bold shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Question</span>
        </button>

        {/* Status in the middle */}
        <div className="text-center text-xs text-slate-500 font-medium">
          {isAllAnswered ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              All 60 questions answered! Ready to decode PathCode.
            </span>
          ) : (
            <span>
              {completedCount} of 60 answered •{' '}
              <strong className="text-amber-700">{remainingCount} questions remaining</strong>
            </span>
          )}
        </div>

        {/* Right Action: Next or Complete */}
        <div className="w-full sm:w-auto flex items-center gap-2">
          {currentQuestionIndex < totalQuestions - 1 && (
            <button
              onClick={goToNext}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Complete Button: Strictly requires all 60 answered */}
          {isAllAnswered ? (
            <button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Calculating...' : 'Complete & Decode PathCode!'}</span>
            </button>
          ) : (
            currentQuestionIndex === totalQuestions - 1 && (
              <button
                onClick={handleJumpToFirstUnanswered}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <span>Answer {remainingCount} Remaining Questions</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
