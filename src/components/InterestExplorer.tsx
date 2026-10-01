import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  GraduationCap,
  Globe,
  Bookmark,
  ExternalLink,
  Banknote,
  TrendingUp,
} from 'lucide-react';
import {
  getResolvedUniversities,
  getAllCountries,
  getCitiesByCountry,
} from '../data/universitiesData.ts';
import { CAREERS_DATABASE, MAJORS_DATABASE } from '../data/calipsData.ts';
import { useAuth } from '../context/AuthContext.tsx';

const COMMON_INTERESTS = [
  'Artificial Intelligence & Robotics',
  'Software Development & Cloud',
  'Biotechnology & Genetics',
  'UI/UX & Product Design',
  'Venture Capital & Startups',
  'Neuroscience & Mental Health',
  'Clean Energy & Climate Tech',
  'FinTech & Quantitative Finance',
  'Cybersecurity & Defense',
  'Film, Media & Creative Direction',
  'Public Policy & Human Rights',
  'Architecture & Sustainable Cities',
];

const DEPARTMENTS = [
  'All Departments',
  'Computer Science & Artificial Intelligence',
  'Engineering & Technology (Mechanical, Electrical, Robotics)',
  'Business, Finance & Entrepreneurship',
  'Health Sciences, Medicine & BioTech',
  'Design, Media & Architecture',
  'Social Sciences, Law & Public Policy',
  'Natural Sciences & Mathematics',
  'Humanities & Arts',
];

export const InterestExplorer: React.FC = () => {
  const { currentUser, toggleSavedCareer, toggleSavedUniversity } = useAuth();

  // Search & Filter state
  const [interestInput, setInterestInput] = useState<string>('Artificial Intelligence & Robotics');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All Departments');
  const [intendedLevel, setIntendedLevel] = useState<string>("Bachelor's Degree (Undergrad)");
  const [selectedCountry, setSelectedCountry] = useState<string>('All Countries');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  const allCountries = useMemo(() => getAllCountries(), []);

  // Update available cities when country changes
  const availableCities = useMemo(() => {
    if (selectedCountry === 'All Countries') return [];
    return getCitiesByCountry(selectedCountry);
  }, [selectedCountry]);

  // Dynamic Careers Match
  const matchedCareers = useMemo(() => {
    const query = interestInput.toLowerCase();
    const deptQuery = selectedDepartment === 'All Departments' ? '' : selectedDepartment.toLowerCase();

    return CAREERS_DATABASE.filter((career) => {
      const matchTitle = career.title.toLowerCase().includes(query);
      const matchCluster =
        career.cluster.toLowerCase().includes(query) ||
        (deptQuery && career.cluster.toLowerCase().includes(deptQuery.split(' ')[0]));
      const matchDesc = career.description.toLowerCase().includes(query);
      const matchSkills = career.keySkills.some((s) => s.toLowerCase().includes(query));
      const matchMajors = career.entryMajors.some((m) => m.toLowerCase().includes(query));

      return matchTitle || matchCluster || matchDesc || matchSkills || matchMajors;
    }).slice(0, 4);
  }, [interestInput, selectedDepartment]);

  // Dynamic Majors Match
  const matchedMajors = useMemo(() => {
    const query = interestInput.toLowerCase();
    return MAJORS_DATABASE.filter((m) => {
      return (
        m.title.toLowerCase().includes(query) ||
        m.department.toLowerCase().includes(query) ||
        m.overview.toLowerCase().includes(query) ||
        m.coreSubjects.some((s) => s.toLowerCase().includes(query))
      );
    }).slice(0, 3);
  }, [interestInput]);

  // Dynamic Universities Match (Country & City Filtered)
  const matchedUniversities = useMemo(() => {
    const query = interestInput.toLowerCase();

    const allUnis = getResolvedUniversities();
    return allUnis.filter((uni) => {
      if (selectedCountry !== 'All Countries' && uni.country.toLowerCase() !== selectedCountry.toLowerCase()) {
        return false;
      }
      if (selectedCity !== 'All Cities' && uni.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      if (selectedDepartment !== 'All Departments') {
        const simpleDept = selectedDepartment.split(' ')[0].toLowerCase();
        const hasDept = uni.departments.some((d) => d.toLowerCase().includes(simpleDept));
        const hasProg = uni.popularPrograms.some((p) => p.toLowerCase().includes(simpleDept));
        if (!hasDept && !hasProg) return false;
      }
      if (query.trim() !== '') {
        const inProgs = uni.popularPrograms.some((p) => p.toLowerCase().includes(query));
        const inDepts = uni.departments.some((d) => d.toLowerCase().includes(query));
        const inDesc = uni.description.toLowerCase().includes(query);
        if (selectedCountry !== 'All Countries' || selectedCity !== 'All Cities') {
          return true;
        }
        return inProgs || inDepts || inDesc || true;
      }
      return true;
    });
  }, [interestInput, selectedCountry, selectedCity, selectedDepartment]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-200">
          <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
          <span>I Know My Interest • Fast-Track Explorer</span>
        </div>

        <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-extrabold text-slate-900">
          Enter Your Passion.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-pink-600">
            Discover Global Directions.
          </span>
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          Skip the assessment if you already have a target field or curiosity in mind. Connect your
          interests directly to careers, college majors, and authentic universities across total countries & cities.
          All financial figures in Pakistani Rupee (PKR).
        </p>
      </div>

      {/* INPUT CONTROL PANEL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Interest Query Input */}
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Interest or Field Keyword
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                placeholder="e.g. AI, Robotics, BioTech, Design..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Department Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Intended Academic Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm text-slate-900"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Degree Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Target Program Level
            </label>
            <select
              value={intendedLevel}
              onChange={(e) => setIntendedLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm text-slate-900"
            >
              <option>Bachelor's Degree (Undergrad)</option>
              <option>Integrated Master's / BS-MS</option>
              <option>Postgraduate / Master's</option>
              <option>Double Major / Interdisciplinary</option>
            </select>
          </div>
        </div>

        {/* Quick Click Badges */}
        <div className="pt-2">
          <p className="text-xs text-slate-500 mb-2 font-bold">Quick Suggestions for Gen-Z Students:</p>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => setInterestInput(interest)}
                className={`text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  interestInput === interest
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MATCHED CAREERS & MAJORS PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Careers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold">
                Occupations
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Matched Career Roles</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {matchedCareers.length} found
            </span>
          </div>

          <div className="space-y-3">
            {(matchedCareers.length > 0 ? matchedCareers : CAREERS_DATABASE.slice(0, 3)).map((career) => {
              const isSaved = currentUser?.savedCareers?.includes(career.id);
              return (
                <div
                  key={career.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {career.cluster}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{career.title}</h4>
                    </div>

                    <button
                      onClick={() => toggleSavedCareer(career.id)}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                        isSaved ? 'text-pink-600 bg-pink-50' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{career.description}</p>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 font-mono">{career.salaryRange}</span>
                    <span className="text-indigo-700 font-semibold">{career.growthOutlook} Growth</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                    {career.keySkills.slice(0, 3).map((sk) => (
                      <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Majors */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-pink-600 font-bold">
                Degree Tracks
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Recommended Academic Majors</h3>
            </div>
          </div>

          <div className="space-y-3">
            {(matchedMajors.length > 0 ? matchedMajors : MAJORS_DATABASE.slice(0, 3)).map((major) => (
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
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
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
        </div>
      </div>

      {/* GLOBAL AUTHENTIC UNIVERSITIES SECTION (TOTAL WORLD COUNTRIES & CITIES) */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700">
              <Globe className="w-4 h-4" />
              <span>Authentic Institutions Worldwide • Direct Website Access</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Find Universities Across Total Countries & Cities
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select any of the world's countries and specific cities to explore verified universities, tuition in PKR, and direct website links.
            </p>
          </div>

          {/* Country & City Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Country Selector with ALL WORLD COUNTRIES */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-600 uppercase">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedCity('All Cities');
                }}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:border-indigo-500"
              >
                <option value="All Countries">All World Countries ({allCountries.length})</option>
                {allCountries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* City Selector (populated dynamically!) */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-slate-600 uppercase">City</label>
              <select
                value={selectedCity}
                disabled={selectedCountry === 'All Countries'}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:border-indigo-500 disabled:opacity-50"
              >
                <option value="All Cities">
                  {selectedCountry === 'All Countries' ? 'Select Country First' : 'All Cities'}
                </option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* University Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matchedUniversities.map((uni) => {
            const isSaved = currentUser?.savedUniversities?.includes(uni.id);

            return (
              <div
                key={uni.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{uni.flag}</span>
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
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                        isSaved ? 'text-pink-600 bg-pink-50' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{uni.name}</h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {uni.description}
                  </p>

                  <div className="space-y-1.5 text-xs pt-1">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Popular Programs:
                      </span>
                      <p className="text-xs text-indigo-700 font-semibold">
                        {uni.popularPrograms.slice(0, 2).join(' • ')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span>Acceptance Rate: <strong className="text-slate-900">{uni.acceptanceRate}</strong></span>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-semibold">
                      Tuition: {uni.tuitionInfo}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-1">
                    {uni.calipsAffinity.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Direct Access Official Portal Link */}
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                  >
                    <span>Visit Official Website</span>
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
