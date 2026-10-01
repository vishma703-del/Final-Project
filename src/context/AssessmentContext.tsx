import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CalipsCategory, AssessmentResult } from '../types/index.ts';
import { CALIPS_QUESTIONS } from '../data/questions.ts';
import { calculatePathCode } from '../data/calipsData.ts';
import { saveAssessmentToDatabase, getAssessmentHistory } from '../lib/supabaseClient.ts';
import { useAuth } from './AuthContext.tsx';

interface AssessmentContextType {
  questions: typeof CALIPS_QUESTIONS;
  answers: Record<number, boolean>;
  currentQuestionIndex: number;
  completedCount: number;
  totalQuestions: number;
  progressPercentage: number;
  setAnswer: (questionId: number, value: boolean) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  jumpToQuestion: (index: number) => void;
  resetAssessment: () => void;
  fillSampleAnswers: (bias?: CalipsCategory) => void;
  finishAssessment: () => Promise<AssessmentResult>;
  latestResult: AssessmentResult | null;
  setLatestResult: (result: AssessmentResult | null) => void;
  history: AssessmentResult[];
  refreshHistory: () => Promise<void>;
  isSubmitting: boolean;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

const ANSWERS_STORAGE_KEY = 'pathcode_active_test_answers';

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null);
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load answers from local session cache
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ANSWERS_STORAGE_KEY);
      if (saved) {
        setAnswers(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Error reading saved test answers:', err);
    }
  }, []);

  // Sync history when user changes
  useEffect(() => {
    if (currentUser?.id) {
      refreshHistory();
    } else {
      setHistory([]);
    }
  }, [currentUser?.id]);

  const refreshHistory = async () => {
    if (!currentUser?.id) return;
    try {
      const list = await getAssessmentHistory(currentUser.id);
      setHistory(list);
      if (list.length > 0 && !latestResult) {
        setLatestResult(list[0]);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const setAnswer = (questionId: number, value: boolean) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const goToNext = () => {
    if (currentQuestionIndex < CALIPS_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    if (index >= 0 && index < CALIPS_QUESTIONS.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const resetAssessment = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    localStorage.removeItem(ANSWERS_STORAGE_KEY);
  };

  // Helper for testing: fills randomized or archetype-biased answers
  const fillSampleAnswers = (bias: CalipsCategory = 'I') => {
    const sample: Record<number, boolean> = {};
    CALIPS_QUESTIONS.forEach((q) => {
      if (q.category === bias) {
        // High chance of true for biased category
        sample[q.id] = Math.random() > 0.15;
      } else if (q.category === 'A' || q.category === 'L' || q.category === 'S') {
        sample[q.id] = Math.random() > 0.4;
      } else {
        sample[q.id] = Math.random() > 0.5;
      }
    });
    setAnswers(sample);
    localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(sample));
  };

  const finishAssessment = async (): Promise<AssessmentResult> => {
    setIsSubmitting(true);
    try {
      // Calculate scores for all 6 categories (0 to 10 each)
      const scores: Record<CalipsCategory, number> = {
        C: 0,
        A: 0,
        L: 0,
        I: 0,
        P: 0,
        S: 0,
      };

      CALIPS_QUESTIONS.forEach((q) => {
        if (answers[q.id] === true) {
          scores[q.category] = (scores[q.category] || 0) + 1;
        }
      });

      const { pathCode, ranked } = calculatePathCode(scores);

      const newResult: AssessmentResult = {
        id: 'result_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        userId: currentUser?.id || 'guest',
        studentName: currentUser?.name || 'Student Explorer',
        scores,
        rankedCategories: ranked,
        pathCode,
        completedAt: new Date().toISOString(),
      };

      // Save to Supabase and local storage
      await saveAssessmentToDatabase(newResult);
      setLatestResult(newResult);
      await refreshHistory();

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        // canvas-confetti soft fallback
      }

      return newResult;
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedCount = Object.keys(answers).length;
  const totalQuestions = CALIPS_QUESTIONS.length;
  const progressPercentage = Math.round((completedCount / totalQuestions) * 100);

  return (
    <AssessmentContext.Provider
      value={{
        questions: CALIPS_QUESTIONS,
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
        latestResult,
        setLatestResult,
        history,
        refreshHistory,
        isSubmitting,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
