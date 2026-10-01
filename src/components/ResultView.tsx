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
  Compass,
  Layers,
  Award,
  BookOpen,
  DollarSign,
  TrendingUp,
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Career Exploration Friendly Notice */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-200/90 leading-relaxed">
          <span className="font-semibold text-white">Your Directional Compass:</span> This report reflects your
          current inclinations across Holland's modernized dimensions. Use this as a launchpad to explore
          unfamiliar majors, talk to university advisors, and experiment with internships.
        </p>
      </div>

      {/* HERO CODE BANNER */}
      <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl overflow-hidden text-center sm:text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Your Official Decoded PathCode</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <span className="font-['Space_Grotesk'] text-5xl sm:text-7xl font-extrabold tracking-tight text-white drop-shadow-md">
                {result.pathCode}
              </span>
              <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
                Top 3 Blend
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-indigo-300 to-cyan-300">
              {archetypeTitle}
            </h2>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Synthesized from your 60-question CALIPS assessment on{' '}
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
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Share My PathCode'}</span>
            </button>

            <button
              onClick={onRetake}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
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
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            Dimension Breakdown
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
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
                className={`p-5 rounded-2xl transition-all ${
                  isTop3
                    ? 'bg-slate-900 border-2 border-indigo-500/50 shadow-lg'
                    : 'bg-slate-900/60 border border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-white text-sm">
                      {item.category}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{info.name}</h4>
                      <p className="text-xs text-indigo-400">{info.archetype}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-white font-mono">
                      {item.score}/10
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium">Rank #{index + 1}</p>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${info.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
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
          <span className="text-xs font-mono uppercase tracking-widest text-pink-400 font-semibold">
            Psychological Archetype Meaning
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Understanding Your Top Dimensions: {result.pathCode}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {top3Categories.map((cat, idx) => {
            const info = CALIPS_CATEGORIES[cat];
            return (
              <div
                key={cat}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-bold">
                      Position #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      Score: {result.scores[cat]}/10
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {cat} — {info.name}
                    </h4>
                    <p className="text-xs text-indigo-400 font-semibold">{info.archetype}</p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{info.description}</p>

                  <div className="pt-2">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Key Strengths
                    </h5>
                    <ul className="space-y-1">
                      {info.strengths.slice(0, 3).map((str, sIdx) => (
                        <li key={sIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <p className="text-[11px] text-slate-400 italic">Work Vibe: {info.workVibe}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: MATCHED CAREERS */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Matched Pathways
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Top Careers Aligned With Your PathCode
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchedCareers.map((career) => {
            const isSaved = currentUser?.savedCareers?.includes(career.id);
            return (
              <div
                key={career.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                        {career.cluster}
                      </span>
                      <h4 className="text-lg font-bold text-white mt-1.5">{career.title}</h4>
                    </div>

                    <button
                      onClick={() => toggleSavedCareer(career.id)}
                      title={isSaved ? 'Remove Bookmark' : 'Save Career'}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-pink-500/20 text-pink-400 border border-pink-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{career.description}</p>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        Salary Range
                      </span>
                      <span className="font-bold text-white font-mono">{career.salaryRange}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
                        Growth Outlook
                      </span>
                      <span className="font-semibold text-pink-300">{career.growthOutlook}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Typical Day
                    </span>
                    <p className="text-xs text-slate-400 italic mt-0.5">{career.typicalDay}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-1.5">
                  {career.keySkills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300"
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
        {/* Recommended Majors */}
        <section className="space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
              Degree Programs
            </span>
            <h3 className="text-xl font-bold text-white mt-1">Recommended College Majors</h3>
          </div>

          <div className="space-y-3">
            {matchedMajors.map((major) => (
              <div
                key={major.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{major.title}</h4>
                  <div className="flex gap-1">
                    {major.degreeTypes.map((dt) => (
                      <span
                        key={dt}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {dt}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-indigo-400">{major.department}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{major.overview}</p>

                <div className="pt-1 flex flex-wrap gap-1">
                  {major.coreSubjects.slice(0, 3).map((sub) => (
                    <span
                      key={sub}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills to Build */}
        <section className="space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
              Skill Acquisition
            </span>
            <h3 className="text-xl font-bold text-white mt-1">Key Skills to Build</h3>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Hard Technical & Strategic Competencies</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {hardSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Human Power Skills & Mindsets</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {humanSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-3 py-1.5 rounded-xl bg-pink-500/10 text-pink-300 border border-pink-500/20 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 5: RECOMMENDED UNIVERSITIES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Global Higher Education
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Top University Programs for {result.pathCode}
            </h3>
          </div>

          <button
            onClick={onExploreUniversities}
            className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
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
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{uni.flag}</span>
                    <button
                      onClick={() => toggleSavedUniversity(uni.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isSaved ? 'text-pink-400 bg-pink-500/20' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-tight">{uni.name}</h4>
                  <p className="text-xs text-indigo-400 font-medium">
                    {uni.city}, {uni.country}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2">{uni.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400">{uni.rankingTier}</span>
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
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
