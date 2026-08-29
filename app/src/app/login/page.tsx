'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Lock, Building2, User, Mail, Key } from 'lucide-react';
import DisclosureBanner from '@/components/DisclosureBanner';

import { useAuthStore } from '@/store/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, signupWithEmail, loginWithGoogle } = useAuthStore();
  const [activeMode, setActiveMode] = useState<'signin' | 'signup'>('signin');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (activeMode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      if (activeMode === 'signup') {
        await signupWithEmail(name, email, password);
      } else {
        await loginWithEmail(email, password);
      }
      setLoading(false);
      router.push('/profile');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Invalid credentials. Please check your email and password.');
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      setLoading(false);
      router.push('/profile');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to authenticate with Google.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex w-full bg-[var(--color-surface)]">
      
      {/* 1:1 Split Layout - Left Side (Image Panel) - Hidden on Mobile */}
      <div className="hidden md:block w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Background Architectural Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full object-cover"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDA1zehs5NyXXqDtvVO0cXcG5anpfB0lWcYuSj87EeiOK9FMzEKhXsgUE5ppfk6EOu8nZF0Y6XsvKi8xAqOePhdAbURWwlZ8xSAngRVV6H9-7FhyMoWjH3Vm66AuqINgWt0NRXmKMZvIYwTccRByhG90iuwLcyckiQK0GLsLuFRxXyvE5r8pXZLPQf93OcGfY1BQY-NiPd8k2DfdP5rEpXeJt7PsD4ivjhRcwQ1VKDwF8UZZ4OXpJ8iXA')",
          }}
        />

        {/* Overlay Backdrop Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40 mix-blend-multiply" />

        {/* Top-Left Branding Overlay 1:1 */}
        <div className="absolute top-10 left-10 z-10 flex items-center gap-2 text-white">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white font-bold">
            <Building2 size={24} />
          </div>
          <span className="text-2xl font-black tracking-tight text-white font-headline-md">
            CivicLens
          </span>
        </div>

        {/* Bottom-Left Statement 1:1 */}
        <div className="absolute bottom-12 left-10 right-10 z-10 text-white space-y-3">
          <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-md">
            Join your community in making Karnataka better.
          </h1>
          <p className="text-sm text-white/90 font-medium max-w-lg leading-relaxed drop-shadow-sm">
            Empowering citizens with accurate, AI-verified civic reporting. Transparent, efficient, and reliable.
          </p>
        </div>
      </div>

      {/* 1:1 Split Layout - Right Side (Form Container) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          
          {/* Mobile Branding (Hidden on Desktop) */}
          <div className="md:hidden flex items-center justify-center gap-2 text-[var(--color-civic-blue)] mb-2">
            <Building2 size={28} />
            <span className="text-2xl font-black tracking-tight">CivicLens</span>
          </div>

          {/* Form Card Container 1:1 Stitch */}
          <div className="bg-white md:border md:border-[var(--color-outline-variant)] rounded-3xl md:shadow-xl p-6 md:p-8 space-y-6">
            
            {/* Mode Toggle Bar 1:1 Stitch */}
            <div className="flex p-1 bg-blue-50/80 rounded-2xl border border-blue-100 relative">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('signin');
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-center relative z-10 text-xs font-black rounded-xl transition-all ${
                  activeMode === 'signin'
                    ? 'bg-white text-[var(--color-civic-blue)] shadow-sm'
                    : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode('signup');
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-center relative z-10 text-xs font-black rounded-xl transition-all ${
                  activeMode === 'signup'
                    ? 'bg-white text-[var(--color-civic-blue)] shadow-sm'
                    : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-200">
                {error}
              </div>
            )}

            {/* Active Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name field if Sign Up */}
              {activeMode === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[var(--color-outline-variant)] text-xs font-bold text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-civic-blue)] shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Email / Phone Field */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your credentials"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[var(--color-outline-variant)] text-xs font-bold text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-civic-blue)] shadow-sm"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    Password
                  </label>
                  {activeMode === 'signin' && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password reset link has been sent to your registered email.');
                      }}
                      className="text-[10px] font-extrabold text-[var(--color-civic-blue)] hover:underline"
                    >
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[var(--color-outline-variant)] text-xs font-bold text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-civic-blue)] shadow-sm"
                  />
                </div>
              </div>

              {/* Confirm Password field if Sign Up */}
              {activeMode === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-extrabold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[var(--color-outline-variant)] text-xs font-bold text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-civic-blue)] shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[48px] bg-[var(--color-civic-blue)] hover:bg-[var(--color-civic-blue-dark)] active:scale-95 text-white font-black text-xs md:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : activeMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </button>

            </form>

            {/* Divider 1:1 Stitch */}
            <div className="flex items-center gap-3 my-4">
              <div className="h-px bg-[var(--color-outline-variant)] flex-1" />
              <span className="text-[10px] font-black text-[var(--color-text-tertiary)]">OR</span>
              <div className="h-px bg-[var(--color-outline-variant)] flex-1" />
            </div>

            {/* Social Auth Google Button 1:1 Stitch */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full h-[48px] bg-white border border-[var(--color-outline-variant)] text-[var(--color-text-primary)] hover:bg-gray-50 active:scale-95 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Trust Signals Box 1:1 Stitch */}
            <div className="flex items-start gap-3 p-4 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs">
              <ShieldCheck size={20} className="text-[var(--color-civic-blue)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-[var(--color-text-primary)]">Secure Connection</p>
                <p className="text-[11px] text-[var(--color-text-tertiary)] font-medium leading-relaxed">
                  Your data is secure and used only for civic reporting.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
