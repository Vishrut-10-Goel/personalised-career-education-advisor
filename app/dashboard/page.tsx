'use client';

import DashboardCard from '@/components/DashboardCard';
import Link from 'next/link';
import { BookOpen, Target, MessageCircle, TrendingUp, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const quickAccess = [
    { href: '/dashboard/roadmap', label: 'View Roadmap', icon: BookOpen },
    { href: '/dashboard/skill-gap', label: 'Analyze Skills', icon: Target },
    { href: '/dashboard/chatbot', label: 'Chat with AI', icon: MessageCircle },
    { href: '/dashboard/progress', label: 'Track Progress', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Section */}
      <div className="glass-card p-8 rounded-2xl border-l-4 border-purple-500">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Alex!</h1>
        <p className="text-gray-400">You're making great progress on your career journey. Let's keep the momentum going!</p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8">
        {/* Recommended Career Paths */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Recommended Career Paths</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Career 1 */}
            <div className="glass-card p-6 rounded-2xl border-l-4 border-purple-500 hover-lift">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white">Product Manager</h3>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-semibold">Technology</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Lead product strategy and vision. Great for those with strong analytical and leadership skills.
              </p>
              <Link
                href="/dashboard/roadmap"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors"
              >
                View Roadmap
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Career 2 */}
            <div className="glass-card p-6 rounded-2xl border-l-4 border-blue-500 hover-lift">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white">Data Analyst</h3>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-semibold">Technology</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Transform data into actionable insights. Perfect for analytical minds with attention to detail.
              </p>
              <Link
                href="/dashboard/roadmap"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
              >
                View Roadmap
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Career 3 */}
            <div className="glass-card p-6 rounded-2xl border-l-4 border-cyan-500 hover-lift">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white">UX/UI Designer</h3>
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs font-semibold">Design</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Create beautiful and intuitive digital experiences. Ideal for creative problem solvers.
              </p>
              <Link
                href="/dashboard/roadmap"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors"
              >
                View Roadmap
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview Card */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <DashboardCard title="Your Progress">
            <div className="space-y-6">
              {/* Circular Progress */}
              <div className="relative w-32 h-32 mx-auto">
                <svg className="transform -rotate-90" width="128" height="128">
                  <circle cx="64" cy="64" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeDasharray="188.4 376.99"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold gradient-text">50%</div>
                  <div className="text-xs text-gray-400">Complete</div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Topics Done</span>
                    <span className="text-sm font-semibold text-white">15/30</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" style={{ width: '50%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Streak</span>
                    <span className="text-sm font-semibold text-white">7 Days</span>
                  </div>
                  <p className="text-xs text-gray-500">Keep it up!</p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Time Invested</span>
                    <span className="text-sm font-semibold text-white">45 hours</span>
                  </div>
                  <p className="text-xs text-gray-500">Great dedication</p>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
        <div className="lg:col-span-2" />
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Quick Access</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {quickAccess.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="glass-card p-6 rounded-xl hover-lift flex flex-col items-center gap-4 text-center transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-purple-500/40 group-hover:to-blue-500/40 transition-all">
                  <Icon className="text-purple-400 group-hover:text-purple-300" size={24} />
                </div>
                <span className="font-medium text-white group-hover:text-purple-300 transition-colors">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
