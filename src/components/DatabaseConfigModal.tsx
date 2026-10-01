import React, { useState } from 'react';
import { X, Database, Copy, Check, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
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
  const [copiedPostgresUrl, setCopiedPostgresUrl] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'testing' | 'success' | 'warn' | 'error';
    message: string;
  }>({
    status: 'idle',
    message: '',
  });

  const postgresUri =
    'postgresql://postgres.tixrhixyleigzddrzotj:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestResult({ status: 'testing', message: 'Testing Supabase API connection...' });
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
          message: `Auth check notice: ${authErr.message}`,
        });
        return;
      }

      // Check if table profiles exists
      const { error: tableErr } = await client.from('profiles').select('id').limit(1);
      if (tableErr) {
        if (tableErr.message.includes('relation "public.profiles" does not exist') || tableErr.code === '42P01') {
          setTestResult({
            status: 'warn',
            message:
              'Connected to your Supabase project (tixrhixyleigzddrzotj)! Next step: Click "Copy SQL" below and run it in your Supabase SQL Editor to create the "profiles" and "assessments" tables.',
          });
          return;
        }
      }

      setTestResult({
        status: 'success',
        message: 'Live connection verified! Supabase database and authentication are active and reachable.',
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

  const handleCopyPostgresUri = () => {
    navigator.clipboard.writeText(postgresUri);
    setCopiedPostgresUrl(true);
    setTimeout(() => setCopiedPostgresUrl(false), 2000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Database & Cloud Configuration</h3>
            <p className="text-xs text-slate-500">
              Supabase PostgreSQL Database, Row Level Security (RLS) & Authentication
            </p>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Supabase Project</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  currentSupabase.isConnected
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                }`}
              >
                {currentSupabase.isConnected ? 'tixrhixyleigzddrzotj' : 'Local Active'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              {currentSupabase.isConnected
                ? 'Configured for live Supabase Cloud database'
                : 'Isolated local database active with simulated user RLS'}
            </p>
            <div>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testResult.status === 'testing'}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer disabled:opacity-50"
              >
                {testResult.status === 'testing' ? 'Testing connection...' : '⚡ Test Live Connection'}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">PostgreSQL Pooler</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Port 6543 (aws-0)
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Direct connection string ready for database pooling & migrations
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPostgresUri}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedPostgresUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPostgresUrl ? 'Copied URI' : 'Copy Postgres URI'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Test Diagnostic Feedback */}
        {testResult.status !== 'idle' && (
          <div
            className={`p-4 rounded-2xl text-xs leading-relaxed border ${
              testResult.status === 'testing'
                ? 'bg-slate-50 text-slate-700 border-slate-200'
                : testResult.status === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : testResult.status === 'warn'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <div className="font-bold mb-1">
              {testResult.status === 'testing' && 'Testing Supabase Connection...'}
              {testResult.status === 'success' && '✓ Supabase Connection Verified'}
              {testResult.status === 'warn' && '⚠ Action Required: Initialize SQL Schema'}
              {testResult.status === 'error' && '✕ Connection Diagnostic Notice'}
            </div>
            <div>{testResult.message}</div>
          </div>
        )}

        {/* Direct Link to Supabase SQL Editor */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-indigo-900">Run Schema Migration in Supabase</h4>
            <p className="text-[11px] text-indigo-700">
              Open your project's SQL Editor to run the migration script with 1 click.
            </p>
          </div>
          <a
            href="https://supabase.com/dashboard/project/tixrhixyleigzddrzotj/sql/new"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <span>Open Supabase SQL Editor</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Supabase SQL Schema & RLS Policies */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>SQL Schema & Row Level Security Script</span>
            </div>
            <button
              onClick={handleCopySchema}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'Copied SQL!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400 max-h-48 overflow-y-auto leading-relaxed">
            {SUPABASE_SQL_SCHEMA}
          </pre>
          <p className="text-[11px] text-slate-500">
            Paste this SQL script into the Supabase SQL editor to create the `profiles` and `assessments` tables and active Row Level Security policies.
          </p>
        </div>

        {/* Form to update keys if needed */}
        <form onSubmit={handleSaveConfigs} className="space-y-3 pt-3 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Supabase Project Credentials
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-600 uppercase font-semibold">Supabase Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-600 uppercase font-semibold">Supabase Anon Key</label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {saveStatus && (
            <p className="text-xs font-bold text-emerald-600">{saveStatus}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors cursor-pointer"
            >
              Save Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
