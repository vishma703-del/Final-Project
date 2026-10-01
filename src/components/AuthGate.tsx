import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  User,
  School,
  Mail,
  Lock,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AuthGateProps {
  onSuccess: () => void;
  openDbModal: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onSuccess, openDbModal }) => {
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(18);
  const [school, setSchool] = useState('');
  const [department, setDepartment] = useState('Computer Science & Tech');
  const [email, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Password assignment modal/state
  const [assignedPasswordDisplay, setAssignedPasswordDisplay] = useState<string | null>(null);
  const [assignedEmailDisplay, setAssignedEmailDisplay] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle student registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await register({
        name,
        age: Number(age),
        school,
        department,
        email,
      });

      if (res.success && res.assignedPassword) {
        setAssignedPasswordDisplay(res.assignedPassword);
        setAssignedEmailDisplay(email);
      } else {
        setErrorMsg(res.error || 'Registration could not be completed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle student login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await login(email, loginPassword);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMsg(res.error || 'Login failed. Please check your email and unique password.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPassword = () => {
    if (assignedPasswordDisplay) {
      navigator.clipboard.writeText(assignedPasswordDisplay);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleProceedToLogin = () => {
    setEmail(assignedEmailDisplay);
    setLoginPassword(assignedPasswordDisplay || '');
    setAssignedPasswordDisplay(null);
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-pink-50/30 text-slate-800 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header / Branding */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 text-white">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-slate-900">
                PathCode
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Daylight Pop
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Decode your interest. Discover your direction.
            </p>
          </div>
        </div>

        <button
          onClick={openDbModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Supabase & Firebase</span>
        </button>
      </div>

      {/* Main Card Section */}
      <div className="max-w-md w-full mx-auto my-8">
        {/* ASSIGNED UNIQUE PASSWORD CELEBRATION MODAL */}
        {assignedPasswordDisplay ? (
          <div className="p-8 rounded-3xl bg-white border border-indigo-100 shadow-2xl shadow-indigo-500/10 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
              <KeyRound className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Account Successfully Created
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Your Unique Password is Ready!
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                As a first-time student, a secure unique password has been automatically generated and assigned to your ID ({assignedEmailDisplay}).
              </p>
            </div>

            {/* The Generated Password Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border-2 border-dashed border-indigo-300 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 font-bold">
                Your Assigned Login Password:
              </span>
              <div className="font-['Space_Grotesk'] text-2xl font-black text-indigo-900 tracking-wider">
                {assignedPasswordDisplay}
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

            <div className="text-xs text-slate-500 bg-amber-50 border border-amber-200/80 p-3 rounded-xl text-left">
              <strong>Important:</strong> Please save this password. You will use it to log in now and on all future visits.
            </div>

            <button
              onClick={handleProceedToLogin}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <span>Log In With Your Unique Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* STANDARD LOGIN & REGISTRATION CARD */
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-2xl shadow-indigo-500/5 space-y-6">
            {/* Header info */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                <span>Student Authentication Required</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {activeTab === 'login' ? 'Welcome Back to PathCode' : 'First-Time Student Registration'}
              </h2>
              <p className="text-xs text-slate-500">
                {activeTab === 'login'
                  ? 'Sign in with your email and unique assigned password to continue.'
                  : 'Enter your details below. A unique password will be assigned to you.'}
              </p>
            </div>

            {/* Mode switch pills */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMsg('');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                First Time? Register
              </button>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: LOGIN FORM */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Student Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Unique Assigned Password
                    </label>
                    <span className="text-[11px] text-indigo-600 font-medium">e.g. PATH-XXXX-XXXX</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter assigned password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Authenticating...' : 'Unlock PathCode'}
                </button>
              </form>
            ) : (
              /* TAB 2: FIRST-TIME REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Student Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Zainab Malik"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm text-slate-900"
                    />
                  </div>
                </div>

                {/* Age & School/College */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1 col-span-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Age</label>
                    <input
                      type="number"
                      required
                      min={12}
                      max={99}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm text-slate-900"
                    />
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      College / School Name
                    </label>
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder="e.g. Aitchison / Roots"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Your Department / Field
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm text-slate-900"
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

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-800 text-[11px] leading-relaxed">
                  🔐 Note: You do not need to invent a password. A unique, secure password will be automatically assigned to you upon clicking below.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register & Assign My Password'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer Note */}
      <div className="text-center text-xs text-slate-500">
        <p>PathCode • Decode your interest. Discover your direction. Currency: Pakistani Rupee (PKR).</p>
      </div>
    </div>
  );
};
