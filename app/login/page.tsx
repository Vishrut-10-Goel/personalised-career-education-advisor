'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
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

      // 1. Fetch profile by email & password (manual verification)
      const profileRes = await fetch(`/api/user?email=${normalizedEmail}&password=${password}`);
      const profileData = await profileRes.json();

      if (!profileRes.ok) {
        if (profileRes.status === 404) {
          throw new Error("Account not found. Please sign up first.");
        }
        throw new Error(profileData.error || "Login failed.");
      }

      if (profileData.data) {
        localStorage.setItem("activeUser", JSON.stringify(profileData.data));
        // 2. Success -> Dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="gradient-text font-bold text-xl">CareerAI</span>
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg glass-card-dark bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all border border-white/5"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg glass-card-dark bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all border border-white/5"
                  required
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded mt-0.5 accent-purple-500" />
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
              </label>
              <Link href="#" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl gradient-button text-white font-bold hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#0a0510] text-gray-500 font-medium whitespace-nowrap">DON'T HAVE AN ACCOUNT?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link href="/signup" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">
                Create Account
              </Link>
            </div>
          </form>

          {/* Footer Text */}
          <p className="text-center text-gray-500 text-xs mt-8">
            By signing in, you agree to our{' '}
            <Link href="#" className="underline hover:text-gray-400">Terms</Link> and{' '}
            <Link href="#" className="underline hover:text-gray-400">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
