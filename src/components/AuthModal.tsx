import React, { useState } from 'react';
import { X, User, School, Mail, Lock, Sparkles, AlertCircle, KeyRound, Copy, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(18);
  const [school, setSchool] = useState('');
  const [department, setDepartment] = useState('Computer Science & Tech');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedPassword, setAssignedPassword] = useState<string | null>(null);
  const [assignedEmail, setAssignedEmail] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        const res = await register({
          name,
          age: Number(age),
          school,
          department,
          email,
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed');
          return;
        }
        if (res.assignedPassword) {
          setAssignedPassword(res.assignedPassword);
          setAssignedEmail(email);
          return;
        }
      } else {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || 'Login failed');
          return;
        }
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPassword = () => {
    if (assignedPassword) {
      navigator.clipboard.writeText(assignedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleProceedToLogin = () => {
    setPassword(assignedPassword || '');
    setEmail(assignedEmail || email);
    setAssignedPassword(null);
    setMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ASSIGNED UNIQUE PASSWORD CELEBRATION */}
        {assignedPassword ? (
          <div className="space-y-4 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Account Successfully Created
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Your Unique Password is Ready!
              </h3>
              <p className="text-xs text-slate-500">
                A unique password has been generated for ({assignedEmail}).
              </p>
            </div>

            {/* The Generated Password Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border-2 border-dashed border-indigo-300 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 font-bold">
                Your Assigned Login Password:
              </span>
              <div className="font-['Space_Grotesk'] text-2xl font-black text-indigo-900 tracking-wider">
                {assignedPassword}
              </div>
              <button
                type="button"
                onClick={handleCopyPassword}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-xs font-bold text-indigo-700 hover:bg-indigo-50 shadow-sm transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Unique Password'}</span>
              </button>
            </div>

            <div className="text-xs text-slate-600 bg-amber-50 border border-amber-200/80 p-3 rounded-xl text-left space-y-1">
              <div><strong>Important:</strong> Please copy and save this password to sign in.</div>
              <div className="text-[11px] text-indigo-700 flex items-center gap-1 font-medium">
                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Saved as <strong>Primary Key</strong> in the Supabase <code className="font-mono bg-white px-1 py-0.5 rounded border border-indigo-200">profiles</code> table.</span>
              </div>
            </div>

            <button
              onClick={handleProceedToLogin}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <span>Sign In With Your Unique Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto mb-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {mode === 'register' ? 'Register Student Profile' : 'Student Sign In'}
              </h3>
              <p className="text-xs text-slate-500">
                {mode === 'register'
                  ? 'Create your student profile to track assessments & saved majors'
                  : 'Sign in to access your assessment history & saved pathways'}
              </p>
            </div>

            {/* Mode Toggle Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'register' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register Student
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-slate-700 font-bold">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fatima Tariq"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Age and School */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1 col-span-1">
                  <label className="text-[11px] font-mono uppercase text-slate-700 font-bold">Age</label>
                  <input
                    type="number"
                    required
                    min={12}
                    max={99}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[11px] font-mono uppercase text-slate-700 font-bold">School / College</label>
                  <div className="relative">
                    <School className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="e.g. Aitchison / Roots"
                      className="w-full pl-8 pr-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-slate-700 font-bold">Department / Major</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                >
                  <option>Computer Science & Tech</option>
                  <option>Engineering & Robotics</option>
                  <option>Business & Commerce</option>
                  <option>Pre-Medical & Health Sciences</option>
                  <option>Arts, Design & Media</option>
                  <option>Humanities & Law</option>
                  <option>Exploring / Undecided</option>
                </select>
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase text-slate-700 font-bold">Email ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.edu"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Password (for login mode) */}
          {mode === 'login' && (
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase text-slate-700 font-bold">Unique Assigned Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter assigned password"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono"
                />
              </div>
            </div>
          )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting
                ? 'Processing...'
                : mode === 'register'
                ? 'Register Student & Get Unique Password'
                : 'Sign In to PathCode'}
            </button>
          </form>
        </>
        )}
      </div>
    </div>
  );
};
