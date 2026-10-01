import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  GraduationCap,
  Globe,
  MapPin,
  Briefcase,
  Layers,
  ArrowRight,
  Bookmark,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Filter,
  CheckCircle,
} from 'lucide-react';
import {
  UNIVERSITIES_DATABASE,
  getAllCountries,
  getCitiesByCountry,
} from '../data/universitiesData.ts';
import { CAREERS_DATABASE, MAJORS_DATABASE } from '../data/calipsData.ts';
import { University, Career, MajorProgram } from '../types/index.ts';
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
      const matchCluster = career.cluster.toLowerCase().includes(query) || (deptQuery && career.cluster.toLowerCase().includes(deptQuery.split(' ')[0]));
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

    return UNIVERSITIES_DATABASE.filter((uni) => {
      // Country Filter
      if (selectedCountry !== 'All Countries' && uni.country !== selectedCountry) {
        return false;
      }
      // City Filter
      if (selectedCity !== 'All Cities' && uni.city !== selectedCity) {
        return false;
      }
      // Department Filter
      if (selectedDepartment !== 'All Departments') {
        const simpleDept = selectedDepartment.split(' ')[0].toLowerCase();
        const hasDept = uni.departments.some((d) => d.toLowerCase().includes(simpleDept));
        const hasProg = uni.popularPrograms.some((p) => p.toLowerCase().includes(simpleDept));
        if (!hasDept && !hasProg) return false;
      }
      // Interest keyword matching
      if (query.trim() !== '') {
        const inProgs = uni.popularPrograms.some((p) => p.toLowerCase().includes(query));
        const inDepts = uni.departments.some((d) => d.toLowerCase().includes(query));
        const inDesc = uni.description.toLowerCase().includes(query);
        // If specific country/city is selected, don't drop universities if keywords don't match exactly
        if (selectedCountry !== 'All Countries' || selectedCity !== 'All Cities') {
          return true;
        }
        return inProgs || inDepts || inDesc || true;
      }
      return true;
    });
  }, [interestInput, selectedCountry, selectedCity, selectedDepartment]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold border border-cyan-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>I Know My Interest • Fast-Track Explorer</span>
        </div>

        <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-extrabold text-white">
          Enter Your Passion.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400">
            Discover Global Directions.
          </span>
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed">
          Skip the 60-question assessment if you already have a target field or curiosity in mind. Connect your
          interests to careers, college majors, required skills, and authentic universities across all countries and cities.
        </p>
      </div>

      {/* INPUT CONTROL PANEL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Interest Query Input */}
          <div className="space-y-2 md:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Interest or Field Keyword
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                placeholder="e.g. AI, Robotics, BioTech, Design..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* Department Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Intended Academic Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-sm text-white"
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
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Target Program Level
            </label>
            <select
              value={intendedLevel}
              onChange={(e) => setIntendedLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-sm text-white"
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
          <p className="text-xs text-slate-400 mb-2 font-medium">Quick Suggestions for Gen-Z Students:</p>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => setInterestInput(interest)}
                className={`text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  interestInput === interest
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
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
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                Occupations
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Matched Career Roles</h3>
            </div>
            <span className="text-xs text-slate-400">
              {matchedCareers.length > 0 ? `${matchedCareers.length} found` : 'Explore similar'}
            </span>
          </div>

          <div className="space-y-3">
            {(matchedCareers.length > 0 ? matchedCareers : CAREERS_DATABASE.slice(0, 3)).map((career) => {
              const isSaved = currentUser?.savedCareers?.includes(career.id);
              return (
                <div
                  key={career.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                        {career.cluster}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">{career.title}</h4>
                    </div>

                    <button
                      onClick={() => toggleSavedCareer(career.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isSaved ? 'text-pink-400 bg-pink-500/20' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{career.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span className="font-mono text-emerald-400 font-semibold">{career.salaryRange}</span>
                    <span className="text-pink-400 font-medium">{career.growthOutlook} Growth</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1">
                    {career.keySkills.slice(0, 3).map((sk) => (
                      <span key={sk} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300">
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
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                Degree Tracks
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Recommended Academic Majors</h3>
            </div>
          </div>

          <div className="space-y-3">
            {(matchedMajors.length > 0 ? matchedMajors : MAJORS_DATABASE.slice(0, 3)).map((major) => (
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
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300"
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
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GLOBAL AUTHENTIC UNIVERSITIES BY COUNTRY & CITY SECTION */}
      <section className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Globe className="w-4 h-4" />
              <span>Authentic Institutions Worldwide</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Find Universities by Country & City
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Explore authentic universities, departments, tuition, and acceptance rates across any country or city.
            </p>
          </div>

          {/* Country & City Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Country Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedCity('All Cities'); // Reset city on country change
                }}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-indigo-500"
              >
                <option value="All Countries">All Countries</option>
                {allCountries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* City Selector (populated dynamically!) */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">City</label>
              <select
                value={selectedCity}
                disabled={selectedCountry === 'All Countries'}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-indigo-500 disabled:opacity-40"
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
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{uni.flag}</span>
                      <div>
                        <span className="text-[10px] font-semibold text-slate-400 block">
                          {uni.city}, {uni.country}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-emerald-400">
                          {uni.rankingTier}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSavedUniversity(uni.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isSaved ? 'text-pink-400 bg-pink-500/20' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{uni.name}</h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {uni.description}
                  </p>

                  <div className="space-y-1.5 text-xs pt-1">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Popular Programs:
                      </span>
                      <p className="text-xs text-indigo-300 font-medium">
                        {uni.popularPrograms.slice(0, 2).join(' • ')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Acceptance Rate: <strong className="text-white">{uni.acceptanceRate}</strong></span>
                    </div>

                    <div className="text-[11px] text-slate-400 truncate">
                      <span>Tuition: {uni.tuitionInfo}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex gap-1">
                    {uni.calipsAffinity.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    <span>Official Portal</span>
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
