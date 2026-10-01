import React, { useState } from 'react';
import { X, Database, Shield, Copy, Check, Key, Server, Terminal } from 'lucide-react';
import {
  getSupabase,
  getSupabaseConfig,
  updateSupabaseConfig,
  SUPABASE_SQL_SCHEMA,
} from '../lib/supabaseClient.ts';
import { updateFirebaseConfig, getFirebaseStatus } from '../lib/firebaseClient.ts';

interface DatabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseConfigModal: React.FC<DatabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const currentSupabase = getSupabaseConfig();
  const currentFirebase = getFirebaseStatus();

  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem('pathcode_supabase_url') || currentSupabase.url
  );
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(
    localStorage.getItem('pathcode_supabase_anon_key') || currentSupabase.rawKey || ''
  );
  const [firebaseConfigInput, setFirebaseConfigInput] = useState(
    localStorage.getItem('pathcode_firebase_config') || ''
  );
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'warn' | 'error'; message: string }>({
    status: 'idle',
    message: '',
  });

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestResult({ status: 'testing', message: 'Pinging Supabase API...' });
    try {
      const client = getSupabase();
      if (!client) {
        setTestResult({ status: 'error', message: 'Supabase client is not initialized.' });
        return;
      }

      // Check auth endpoint reachability
      const { error: authErr } = await client.auth.getSession();
      if (authErr) {
        setTestResult({
          status: 'error',
          message: `Auth check failed: ${authErr.message}`,
        });
        return;
      }

      // Check if table profiles exists
      const { error: tableErr } = await client.from('profiles').select('id').limit(1);
      if (tableErr) {
        if (tableErr.message.includes('relation "public.profiles" does not exist') || tableErr.code === '42P01') {
          setTestResult({
            status: 'warn',
            message: 'Connected to Supabase project! Next step: Copy and run the SQL schema script below in your Supabase SQL editor to create the "profiles" and "assessments" tables.',
          });
          return;
        }
      }

      setTestResult({
        status: 'success',
        message: 'Live connection verified! Supabase database and authentication are reachable.',
      });
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: err.message || 'Connection test encountered an error.',
      });
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    const subRes = updateSupabaseConfig(supabaseUrl, supabaseAnonKey);
    const fireRes = updateFirebaseConfig(firebaseConfigInput);

    if (subRes && fireRes) {
      setSaveStatus('Configurations updated successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } else {
      setSaveStatus('Error saving configurations. Check values.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Database & Security Setup</h3>
            <p className="text-xs text-slate-400">
              Supabase PostgreSQL Database, Row Level Security (RLS) & Firebase Authentication
            </p>
          </div>
        </div>

        {/* Status Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Supabase Database</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  currentSupabase.isConnected
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-indigo-500/20 text-indigo-300'
                }`}
              >
                {currentSupabase.isConnected ? 'Remote Active' : 'Local RLS Active'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {currentSupabase.isConnected
                ? 'Connected to live Supabase Cloud project'
                : 'Isolated local database active with simulated user RLS'}
            </p>
            <div className="pt-1.5">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testResult.status === 'testing'}
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer disabled:opacity-50"
              >
                {testResult.status === 'testing' ? 'Testing connection...' : '⚡ Test Live Connection'}
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Firebase Auth</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  currentFirebase.isConfigured
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {currentFirebase.isConfigured ? 'Firebase Active' : 'Local Auth Active'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {currentFirebase.isConfigured
                ? `Active: ${currentFirebase.projectId}`
                : 'Local student authentication active'}
            </p>
          </div>
        </div>

        {/* Live Test Diagnostic Feedback */}
        {testResult.status !== 'idle' && (
          <div
            className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
              testResult.status === 'testing'
                ? 'bg-slate-950 text-slate-300 border-slate-700'
                : testResult.status === 'success'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : testResult.status === 'warn'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            }`}
          >
            <div className="font-semibold mb-0.5">
              {testResult.status === 'testing' && 'Testing Supabase Connection...'}
              {testResult.status === 'success' && '✓ Supabase Connection Verified'}
              {testResult.status === 'warn' && '⚠ Action Required in Supabase Dashboard'}
              {testResult.status === 'error' && '✕ Connection Diagnostic Notice'}
            </div>
            <div>{testResult.message}</div>
          </div>
        )}

        {/* Supabase SQL Schema & RLS Policies */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Supabase SQL Migration & RLS Script</span>
            </div>
            <button
              onClick={handleCopySchema}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'Copied SQL!' : 'Copy SQL'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto leading-relaxed">
            {SUPABASE_SQL_SCHEMA}
          </pre>
          <p className="text-[10px] text-slate-500">
            Paste this SQL script into your Supabase Dashboard SQL Editor to initialize the `profiles` and `assessments` tables and Row Level Security rules.
          </p>
        </div>

        {/* Connect Remote Supabase / Firebase Form */}
        <form onSubmit={handleSaveConfigs} className="space-y-4 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Connect Custom Cloud Keys (Optional)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase">Supabase Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase">Supabase Anon Public Key</label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 uppercase">
              Firebase Configuration JSON
            </label>
            <textarea
              rows={2}
              value={firebaseConfigInput}
              onChange={(e) => setFirebaseConfigInput(e.target.value)}
              placeholder='{"apiKey": "...", "projectId": "...", "authDomain": "..."}'
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono placeholder-slate-600"
            />
          </div>

          {saveStatus && (
            <div className="text-xs text-emerald-400 font-semibold">{saveStatus}</div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30"
            >
              Save Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
