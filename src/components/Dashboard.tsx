import React, { useState } from 'react';
import {
  User,
  School,
  Mail,
  Bookmark,
  History,
  ArrowRight,
  ExternalLink,
  Edit3,
  Check,
  GraduationCap,
  Compass,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useAssessment } from '../context/AssessmentContext.tsx';
import { CAREERS_DATABASE } from '../data/calipsData.ts';
import { UNIVERSITIES_DATABASE } from '../data/universitiesData.ts';
import { AssessmentResult } from '../types/index.ts';

interface DashboardProps {
  onStartAssessment: () => void;
  onExploreInterest: () => void;
  onViewResult: (result: AssessmentResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartAssessment,
  onExploreInterest,
  onViewResult,
}) => {
  const { currentUser, updateProfile, toggleSavedCareer, toggleSavedUniversity } = useAuth();
  const { history } = useAssessment();

  const [activeTab, setActiveTab] = useState<'history' | 'careers' | 'universities'>('history');
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editAge, setEditAge] = useState(currentUser?.age || 18);
  const [editSchool, setEditSchool] = useState(currentUser?.school || '');
  const [editDepartment, setEditDepartment] = useState(currentUser?.department || '');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <User className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Student Account Required</h2>
        <p className="text-xs text-slate-500">
          Please log in with your email and assigned password to access your dashboard.
        </p>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: editName,
      age: Number(editAge),
      school: editSchool,
      department: editDepartment,
    });
    setIsEditing(false);
  };

  const savedCareerItems = CAREERS_DATABASE.filter((c) =>
    currentUser.savedCareers?.includes(c.id)
  );

  const savedUniversityItems = UNIVERSITIES_DATABASE.filter((u) =>
    currentUser.savedUniversities?.includes(u.id)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* STUDENT PROFILE CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              src={
                currentUser.avatarUrl ||
                `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(currentUser.name)}`
              }
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md"
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-900">{currentUser.name}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                  Age {currentUser.age}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="flex items-center gap-1.5 text-indigo-700 font-bold">
                  <School className="w-3.5 h-3.5" />
                  {currentUser.school}
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Mail className="w-3.5 h-3.5" />
                  {currentUser.email}
                </span>
              </div>

              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                  Department: <strong className="text-slate-900">{currentUser.department}</strong>
                </span>

                {currentUser.assignedPassword && (
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-indigo-500" />
                    <span>Password: {currentUser.assignedPassword}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* EDIT PROFILE INLINE FORM */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-slate-600 uppercase">Student Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-slate-600 uppercase">Age</label>
              <input
                type="number"
                value={editAge}
                onChange={(e) => setEditAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                required
                min={12}
                max={99}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-slate-600 uppercase">School / College</label>
              <input
                type="text"
                value={editSchool}
                onChange={(e) => setEditSchool(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-slate-600 uppercase">Academic Department</label>
              <input
                type="text"
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                required
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* DASHBOARD TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Assessment History ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('careers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'careers'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Careers ({savedCareerItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('universities')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'universities'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Saved Universities ({savedUniversityItems.length})</span>
        </button>
      </div>

      {/* TAB 1: ASSESSMENT HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Your CALIPS Assessment History</h3>
            <button
              onClick={onStartAssessment}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold border border-indigo-200 transition-all cursor-pointer"
            >
              <span>Take New Assessment</span>
            </button>
          </div>

          {history.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <Compass className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">No Assessments Taken Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to find out your top 3-letter PathCode? Take the 60-question CALIPS assessment to start building
                your history.
              </p>
              <button
                onClick={onStartAssessment}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
              >
                Start 60Q Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-['Space_Grotesk'] text-2xl font-black text-slate-900 tracking-tight">
                        {record.pathCode}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Completed
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{new Date(record.completedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="font-mono">
                        Scores: C:{record.scores.C} A:{record.scores.A} L:{record.scores.L} I:{record.scores.I} P:
                        {record.scores.P} S:{record.scores.S}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewResult(record)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-800 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <span>View Full Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED CAREERS */}
      {activeTab === 'careers' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Bookmarked Career Paths</h3>

          {savedCareerItems.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">No Bookmarked Careers</h4>
              <p className="text-xs text-slate-500">
                You can bookmark career cards from your assessment results or the Interest Explorer.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedCareerItems.map((career) => (
                <div
                  key={career.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {career.cluster}
                      </span>
                      <button
                        onClick={() => toggleSavedCareer(career.id)}
                        className="text-pink-600 hover:text-slate-400 text-xs font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{career.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{career.description}</p>
                    <p className="text-xs font-mono font-bold text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                      {career.salaryRange}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED UNIVERSITIES */}
      {activeTab === 'universities' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Saved Universities & Programs</h3>

          {savedUniversityItems.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <GraduationCap className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">No Bookmarked Universities</h4>
              <p className="text-xs text-slate-500">
                Bookmark authentic universities from the country & city directory or your assessment results.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedUniversityItems.map((uni) => (
                <div
                  key={uni.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{uni.flag}</span>
                        <div>
                          <span className="text-xs font-bold text-slate-500 block">
                            {uni.city}, {uni.country}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-700">
                            {uni.rankingTier}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleSavedUniversity(uni.id)}
                        className="text-pink-600 hover:text-slate-400 text-xs font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{uni.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{uni.description}</p>
                    <p className="text-xs text-amber-900 font-semibold">{uni.tuitionInfo}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
