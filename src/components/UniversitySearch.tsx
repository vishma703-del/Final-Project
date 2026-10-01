import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  Globe,
  MapPin,
  Bookmark,
  ExternalLink,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import {
  UNIVERSITIES_DATABASE,
  getAllCountries,
  getCitiesByCountry,
} from '../data/universitiesData.ts';
import { CalipsCategory, University } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';

export const UniversitySearch: React.FC = () => {
  const { currentUser, toggleSavedUniversity } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedAffinity, setSelectedAffinity] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');

  const allCountries = useMemo(() => getAllCountries(), []);

  const availableCities = useMemo(() => {
    if (selectedCountry === 'All Countries') return [];
    return getCitiesByCountry(selectedCountry);
  }, [selectedCountry]);

  const filteredUniversities = useMemo(() => {
    return UNIVERSITIES_DATABASE.filter((uni) => {
      // Query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inName = uni.name.toLowerCase().includes(q);
        const inCity = uni.city.toLowerCase().includes(q);
        const inCountry = uni.country.toLowerCase().includes(q);
        const inPrograms = uni.popularPrograms.some((p) => p.toLowerCase().includes(q));
        const inDepts = uni.departments.some((d) => d.toLowerCase().includes(q));
        if (!inName && !inCity && !inCountry && !inPrograms && !inDepts) return false;
      }

      // Country filter
      if (selectedCountry !== 'All Countries' && uni.country !== selectedCountry) {
        return false;
      }

      // City filter
      if (selectedCity !== 'All Cities' && uni.city !== selectedCity) {
        return false;
      }

      // Tier filter
      if (selectedTier !== 'All' && uni.rankingTier !== selectedTier) {
        return false;
      }

      // CALIPS affinity filter
      if (selectedAffinity !== 'All') {
        if (!uni.calipsAffinity.includes(selectedAffinity as CalipsCategory)) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCountry, selectedCity, selectedAffinity, selectedTier]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Global Authentic University Directory</span>
        </div>

        <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-extrabold text-white">
          Explore Authentic Universities{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-300">
            Across Countries & Cities
          </span>
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed">
          Search genuine top-tier institutions worldwide. Discover acceptance rates, tuition structures, popular
          academic faculties, and CALIPS behavioral category affinities.
        </p>
      </div>

      {/* FILTER CONTROLS */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by university name, major, program, or keyword..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 focus:border-indigo-500 text-sm text-white placeholder-slate-500"
          />
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Country */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-400">Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedCity('All Cities');
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            >
              <option value="All Countries">All Countries</option>
              {allCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-400">City</label>
            <select
              value={selectedCity}
              disabled={selectedCountry === 'All Countries'}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white disabled:opacity-40"
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

          {/* Ranking Tier */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-400">Tier</label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            >
              <option value="All">All Tiers</option>
              <option value="World Top 20">World Top 20</option>
              <option value="World Top 50">World Top 50</option>
              <option value="World Top 100">World Top 100</option>
              <option value="Leading National">Leading National</option>
            </select>
          </div>

          {/* CALIPS Dimension */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-400">CALIPS Dimension</label>
            <select
              value={selectedAffinity}
              onChange={(e) => setSelectedAffinity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            >
              <option value="All">All Dimensions</option>
              <option value="C">C — Conventional (Organizer)</option>
              <option value="A">A — Artistic (Creator)</option>
              <option value="L">L — Leadership (Leader)</option>
              <option value="I">I — Investigative (Analyst)</option>
              <option value="P">P — Practical (Doer)</option>
              <option value="S">S — Social (Helper)</option>
            </select>
          </div>
        </div>
      </div>

      {/* RESULTS COUNT & LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredUniversities.length}</strong> authentic institutions
          </span>
          {(selectedCountry !== 'All Countries' || selectedCity !== 'All Cities' || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCountry('All Countries');
                setSelectedCity('All Cities');
                setSelectedAffinity('All');
                setSelectedTier('All');
              }}
              className="text-indigo-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map((uni) => {
            const isSaved = currentUser?.savedUniversities?.includes(uni.id);

            return (
              <div
                key={uni.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{uni.flag}</span>
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block">
                          {uni.city}, {uni.country}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {uni.rankingTier}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSavedUniversity(uni.id)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isSaved ? 'text-pink-400 bg-pink-500/20' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-tight">{uni.name}</h3>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {uni.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Popular Programs
                      </span>
                      <p className="text-xs text-indigo-300 font-medium mt-0.5">
                        {uni.popularPrograms.slice(0, 3).join(' • ')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Acceptance Rate</span>
                      <span className="font-bold text-white font-mono">{uni.acceptanceRate}</span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      <span className="text-slate-500">Tuition:</span> {uni.tuitionInfo}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {uni.calipsAffinity.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    <span>Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
