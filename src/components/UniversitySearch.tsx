import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  Globe,
  Bookmark,
  ExternalLink,
  Banknote,
} from 'lucide-react';
import {
  getResolvedUniversities,
  getAllCountries,
  getCitiesByCountry,
} from '../data/universitiesData.ts';
import { CalipsCategory } from '../types/index.ts';
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
    const allUnis = getResolvedUniversities();
    return allUnis.filter((uni) => {
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
      if (selectedCountry !== 'All Countries' && uni.country.toLowerCase() !== selectedCountry.toLowerCase()) {
        return false;
      }

      // City filter
      if (selectedCity !== 'All Cities' && uni.city.toLowerCase() !== selectedCity.toLowerCase()) {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Global Authentic University Directory • All Figures in PKR</span>
        </div>

        <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-extrabold text-slate-900">
          Explore Authentic Universities{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600">
            Across Total Countries & Cities
          </span>
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed">
          Direct access to authentic universities across every global nation. Explore official acceptance rates,
          academic programs, and tuition converted into Pakistani Rupee (PKR).
        </p>
      </div>

      {/* FILTER CONTROLS */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by university name, major, program, or keyword..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder-slate-400"
          />
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Country (Total Countries) */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase font-bold text-slate-600">Total Countries ({allCountries.length})</label>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedCity('All Cities');
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <option value="All Countries">All World Countries</option>
              {allCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase font-bold text-slate-600">City</label>
            <select
              value={selectedCity}
              disabled={selectedCountry === 'All Countries'}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 disabled:opacity-50"
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
            <label className="text-[11px] font-mono uppercase font-bold text-slate-600">Tier</label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <option value="All">All Tiers</option>
              <option value="World Top 20">World Top 20</option>
              <option value="World Top 50">World Top 50</option>
              <option value="World Top 100">World Top 100</option>
              <option value="Leading National">Leading National</option>
              <option value="Specialized Institute">Specialized Institute</option>
            </select>
          </div>

          {/* CALIPS Dimension */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase font-bold text-slate-600">Dimension Affinity</label>
            <select
              value={selectedAffinity}
              onChange={(e) => setSelectedAffinity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
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

      {/* RESULTS COUNT & CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>
            Showing <strong className="text-slate-900">{filteredUniversities.length}</strong> authentic institutions
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
              className="text-indigo-600 hover:underline cursor-pointer"
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
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isSaved ? 'text-pink-600 bg-pink-50' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{uni.name}</h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {uni.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Popular Academic Faculties:
                      </span>
                      <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                        {uni.popularPrograms.slice(0, 3).join(' • ')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Acceptance Rate</span>
                      <span className="font-bold text-slate-900 font-mono">{uni.acceptanceRate}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-semibold">
                      Tuition: {uni.tuitionInfo}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {uni.calipsAffinity.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700"
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
      </div>
    </div>
  );
};
