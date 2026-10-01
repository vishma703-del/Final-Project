import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Bookmark,
  Share2,
  RotateCcw,
  Check,
  GraduationCap,
  Briefcase,
  Banknote,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { AssessmentResult, CalipsCategory } from '../types/index.ts';
import {
  CALIPS_CATEGORIES,
  getArchetypeTitle,
  getMatchedCareers,
  getMatchedMajors,
  getRecommendedSkills,
} from '../data/calipsData.ts';
import { getRecommendedUniversitiesForCode } from '../data/universitiesData.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface ResultViewProps {
  result: AssessmentResult;
  onRetake: () => void;
  onExploreUniversities: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onRetake,
  onExploreUniversities,
}) => {
  const { currentUser, toggleSavedCareer, toggleSavedUniversity } = useAuth();
  const [copied, setCopied] = useState(false);

  const archetypeTitle = getArchetypeTitle(result.pathCode);
  const matchedCareers = getMatchedCareers(result.pathCode);
  const matchedMajors = getMatchedMajors(result.pathCode);
  const matchedUniversities = getRecommendedUniversitiesForCode(result.pathCode);
  const { hardSkills, humanSkills } = getRecommendedSkills(result.pathCode);

  const handleShare = () => {
    navigator.clipboard.writeText(
      `My PathCode is [${result.pathCode}] — ${archetypeTitle}! Discover your career direction on PathCode.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const top3Categories = result.pathCode.split('') as CalipsCategory[];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Exploration Notice Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-900 leading-relaxed font-medium">
          <span className="font-bold">Career Exploration Notice:</span> Your PathCode reflects your current
          behavioral inclinations across Holland's modernized dimensions. This is an exploratory directional compass
          — not a rigid prediction of your destiny. All salaries and tuition figures are displayed in Pakistani Rupee (PKR).
        </p>
      </div>

      {/* HERO CODE BANNER */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-2xl overflow-hidden text-center sm:text-left">
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Your Official Decoded PathCode</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <span className="font-['Space_Grotesk'] text-5xl sm:text-7xl font-black tracking-tight text-white drop-shadow">
                {result.pathCode}
              </span>
              <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 text-white font-bold">
                Top 3 Dimension Code
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-indigo-200 to-amber-300">
              {archetypeTitle}
            </h2>

            <p className="text-xs text-indigo-200 max-w-xl leading-relaxed">
              Decoded from your 60-question CALIPS assessment completed on{' '}
              {new Date(result.completedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              .
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Share My PathCode'}</span>
            </button>

            <button
              onClick={onRetake}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: ALL 6 SCORES & RANKING */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold">
            Dimension Breakdown
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Your 6 CALIPS Scores & Category Ranks
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.rankedCategories.map((item, index) => {
            const info = CALIPS_CATEGORIES[item.category];
            const isTop3 = index < 3;

            return (
              <div
                key={item.category}
                className={`p-5 rounded-3xl bg-white transition-all ${
                  isTop3
                    ? 'border-2 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-black text-slate-900 text-sm">
                      {item.category}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{info.name}</h4>
                      <p className="text-xs text-indigo-600 font-semibold">{info.archetype}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 font-mono">
                      {item.score}/10
                    </span>
                    <p className="text-[10px] text-slate-500 font-bold">Rank #{index + 1}</p>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${info.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {info.tagline}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: TOP 3 CATEGORY MEANINGS */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-pink-600 font-bold">
            Psychological Archetype Meaning
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Understanding Your Top Dimensions: {result.pathCode}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {top3Categories.map((cat, idx) => {
            const info = CALIPS_CATEGORIES[cat];
            return (
              <div
                key={cat}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                      Position #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-600 font-mono">
                      Score: {result.scores[cat]}/10
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {cat} — {info.name}
                    </h4>
                    <p className="text-xs text-indigo-600 font-bold">{info.archetype}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{info.description}</p>

                  <div className="pt-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Core Behavioral Strengths
                    </h5>
                    <ul className="space-y-1">
                      {info.strengths.slice(0, 3).map((str, sIdx) => (
                        <li key={sIdx} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 italic">Work Vibe: {info.workVibe}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: MATCHED CAREERS WITH SALARIES IN PKR */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold">
            Matched Pathways (PKR Currency)
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Top Careers Aligned With Your PathCode
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchedCareers.map((career) => {
            const isSaved = currentUser?.savedCareers?.includes(career.id);
            return (
              <div
                key={career.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-400 shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {career.cluster}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 mt-1.5">{career.title}</h4>
                    </div>

                    <button
                      onClick={() => toggleSavedCareer(career.id)}
                      title={isSaved ? 'Remove Bookmark' : 'Save Career'}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-pink-100 text-pink-700 border border-pink-300'
                          : 'bg-slate-100 text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{career.description}</p>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-900 font-bold flex items-center gap-1">
                        <Banknote className="w-4 h-4 text-amber-700" />
                        Estimated Compensation (PKR)
                      </span>
                      <span className="font-extrabold text-amber-900 font-mono">{career.salaryRange}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span>Market Growth Outlook</span>
                      <span className="font-bold text-indigo-700">{career.growthOutlook}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Typical Day
                    </span>
                    <p className="text-xs text-slate-600 italic mt-0.5">{career.typicalDay}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {career.keySkills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: RECOMMENDED MAJORS & SKILLS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 font-bold">
              Degree Programs
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Recommended College Majors</h3>
          </div>

          <div className="space-y-3">
            {matchedMajors.map((major) => (
              <div
                key={major.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{major.title}</h4>
                  <div className="flex gap-1">
                    {major.degreeTypes.map((dt) => (
                      <span
                        key={dt}
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {dt}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-indigo-600 font-semibold">{major.department}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{major.overview}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-600 font-bold">
              Skill Acquisition
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Key Skills to Build</h3>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Hard Technical & Strategic Competencies</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {hardSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Human Power Skills & Mindsets</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {humanSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded-xl bg-pink-50 text-pink-800 border border-pink-200 font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 5: RECOMMENDED UNIVERSITIES WITH DIRECT ACCESS & PKR */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold">
              Global Higher Education (PKR Tuition)
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Top Authentic Universities for {result.pathCode}
            </h3>
          </div>

          <button
            onClick={onExploreUniversities}
            className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            <span>Search All Countries & Cities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {matchedUniversities.slice(0, 3).map((uni) => {
            const isSaved = currentUser?.savedUniversities?.includes(uni.id);
            return (
              <div
                key={uni.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-400 shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{uni.flag}</span>
                    <button
                      onClick={() => toggleSavedUniversity(uni.id)}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                        isSaved ? 'text-pink-600 bg-pink-100' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-tight">{uni.name}</h4>
                  <p className="text-xs text-indigo-700 font-bold">
                    {uni.city}, {uni.country}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2">{uni.description}</p>

                  <div className="pt-2 text-xs text-slate-600 space-y-1">
                    <p className="font-semibold text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                      Tuition: {uni.tuitionInfo}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-emerald-600">{uni.rankingTier}</span>
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
