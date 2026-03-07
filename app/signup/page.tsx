'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowRight, AlertCircle, Loader2, TrendingUp } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(normalizedEmail)) {
        throw new Error("Please enter a valid email address.");
      }

      // Fallback for crypto.randomUUID() if not available (non-secure context or older browser)
      const simulatedId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : `user_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
      const profileRes = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: simulatedId,
          email: normalizedEmail,
          full_name: name,
          password: password
        })
      });

      const profileData = await profileRes.json();
      if (!profileRes.ok) throw new Error(profileData.error || "Failed to create profile record.");

      localStorage.setItem("activeUser", JSON.stringify(profileData.data));
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 fade-in">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(198,255,0,0.2)]">
                <TrendingUp size={24} className="text-black" />
              </div>
              <span className="text-3xl font-black tracking-tighter">CareerVibe</span>
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Create Account</h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Join the next gen elite.</p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3 font-bold uppercase tracking-widest">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="vibe-card p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-primary/40 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-primary/40 transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-primary/40 transition-all font-medium"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full neon-button py-5 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  SYNCING...
                </>
              ) : (
                <>
                  GET STARTED
                  <ArrowRight size={22} />
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t border-white/5">
              <p className="text-gray-500 text-sm font-bold">
                Already vibe with us?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
