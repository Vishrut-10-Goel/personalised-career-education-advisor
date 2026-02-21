'use client';

import DashboardCard from '@/components/DashboardCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Target, MessageCircle, TrendingUp, ArrowRight, Loader2, Trophy, Star, CheckCircle2 } from 'lucide-react';
import type { UserProfile } from '@/types/user';
import { calculateGamificationMetrics, type GamificationMetrics } from '@/lib/gamification';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<any>(null);
  const [metrics, setMetrics] = useState<GamificationMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      const storedUser = localStorage.getItem('activeUser');
      if (!storedUser) {
        router.push('/onboarding');
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);

        // 1. Fetch full profile
        const userRes = await fetch(`/api/user?id=${parsedUser.id}`);
        const userData = await userRes.json();
        if (userData.success) {
          setUser(userData.data);
        }

        // 2. Fetch latest roadmap
        const roadmapRes = await fetch(`/api/roadmap?user_id=${parsedUser.id}`);
        const roadmapData = await roadmapRes.json();

        if (roadmapData.success && roadmapData.data?.roadmap) {
          const roadmap = roadmapData.data.roadmap;

          // 3. Fetch progress for this specific roadmap
          const progressRes = await fetch(`/api/progress?user_id=${parsedUser.id}&roadmap_id=${roadmap.id}`);
          const progressData = await progressRes.json();

          const completedTopicIds = progressData.success ? progressData.data.completed_topic_ids || [] : [];

          setActiveRoadmap(roadmap);

          // 4. Calculate Gamification Metrics
          const computedMetrics = calculateGamificationMetrics(roadmap, completedTopicIds);
          setMetrics(computedMetrics);
        }
      } catch (error) {
        console.error("Dashboard init failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  const quickAccess = [
    { href: '/dashboard/roadmap', label: 'View Roadmap', icon: BookOpen },
    { href: '/dashboard/chatbot', label: 'Chat with AI', icon: MessageCircle },
    { href: '/dashboard/progress', label: 'Track Progress', icon: TrendingUp },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
        <p className="text-gray-400">Loading your profile...</p>
      </div>
    );
  }

  const completionPercent = metrics?.completion_percent || 0;

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Section */}
      <div className="glass-card p-10 rounded-3xl border-l-[6px] border-purple-500 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-br from-white/5 to-transparent">
        <div>
          <h1 className="text-4xl font-black text-white mb-3">Welcome back, {user?.full_name || 'Explorer'}!</h1>
          <p className="text-lg text-gray-400 max-w-xl">You're making great progress on your career journey. Let's keep the momentum going!</p>
        </div>

        {/* Milestone Badges */}
        <div className="flex gap-4">
          {metrics?.milestones.milestone_25 && (
            <div className="group relative">
              <div className="w-14 h-14 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-500/20 hover:scale-110 transition-all cursor-default">
                <Star size={24} />
              </div>
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black border border-white/10 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">25% Starter</span>
            </div>
          )}
          {metrics?.milestones.milestone_50 && (
            <div className="group relative">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20 hover:scale-110 transition-all cursor-default">
                <Trophy size={24} />
              </div>
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black border border-white/10 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">50% Achiever</span>
            </div>
          )}
          {metrics?.milestones.milestone_complete && (
            <div className="group relative">
              <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400 shadow-lg shadow-green-500/20 hover:scale-110 transition-all cursor-default">
                <CheckCircle2 size={24} />
              </div>
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black border border-white/10 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">100% Master</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Gamified HUD */}
        <div className="lg:col-span-4 space-y-8">
          <DashboardCard title="Journey Evolution">
            <div className="space-y-8">
              <div className="relative w-48 h-48 mx-auto group">
                {/* Outer Glow */}
                <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-xl group-hover:bg-purple-500/20 transition-all" />

                <svg className="transform -rotate-90 relative" width="192" height="192">
                  <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="url(#journey-grad)"
                    strokeWidth="12"
                    strokeDasharray={`${completionPercent * 5.53} 552.92`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="journey-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-black text-white tracking-tight">
                    {completionPercent}%
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-gray-500 font-black mt-1">Growth</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl font-bold text-white leading-none">{metrics?.completed_topics || 0}</div>
                  <div className="text-[10px] uppercase text-gray-500 font-bold mt-2">Topics Mastered</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl font-bold text-white leading-none">{metrics?.total_topics || 0}</div>
                  <div className="text-[10px] uppercase text-gray-500 font-bold mt-2">Total Journey</div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] uppercase text-gray-500 font-black tracking-widest block mb-1">Current Focus</span>
                    <span className="text-lg font-bold text-white">{metrics?.current_section || "N/A"}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                      {metrics?.current_stage || "Beginner"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>

        {/* Active Path & Quick Links */}
        <div className="lg:col-span-8 space-y-8">
          <DashboardCard title="Active Learning Intelligence">
            {activeRoadmap ? (
              <div className="p-4">
                <div className="flex items-start justify-between mb-8">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white capitalize leading-tight">{activeRoadmap.career}</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-bold">{activeRoadmap.domain}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-purple-400 text-xs font-bold">{activeRoadmap.total_estimated_weeks} Weeks Estimated</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5 shadow-2xl">
                    <BookOpen size={32} className="text-purple-400" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/10 space-y-4">
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase tracking-wider">
                      <Target size={16} />
                      Next Recommendation
                    </div>
                    <p className="text-xl font-bold text-white leading-tight">
                      {metrics?.next_topic_title || "Journey Complete!"}
                    </p>
                    <button
                      onClick={() => router.push(`/dashboard/roadmap`)}
                      className="text-purple-300 text-xs font-black underline underline-offset-4 hover:text-purple-200 transition-colors"
                    >
                      OPEN MODULE →
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="text-gray-500 font-bold text-sm uppercase tracking-wider">Overview</div>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {activeRoadmap.overview}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push(`/roadmap?id=${activeRoadmap.id}`)}
                    className="flex-1 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-[1.02] active:scale-95 rounded-2xl text-white font-black transition-all flex items-center justify-center gap-3 group shadow-xl shadow-purple-500/20"
                  >
                    CONTINUE CAREER TRANSFORMATION
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                  <Target className="text-gray-600" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No active roadmap found</h3>
                <p className="text-gray-400 mb-8 max-w-sm mx-auto">Ready to start your expert-guided career journey? Let's find your path.</p>
                <button
                  onClick={() => router.push('/recommendations')}
                  className="gradient-button px-10 py-4 rounded-2xl text-white font-black hover-lift text-lg"
                >
                  Explore Career Paths
                </button>
              </div>
            )}
          </DashboardCard>

          {/* Quick Nav */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">System Utilities</h2>
              <div className="h-0.5 flex-1 bg-white/5 mx-6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickAccess.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="glass-card p-8 rounded-2xl hover-lift flex flex-col items-center gap-4 text-center transition-all group border border-transparent hover:border-purple-500/30"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-all border border-white/5`}>
                      <Icon className="text-gray-400 group-hover:text-purple-400" size={28} />
                    </div>
                    <span className="text-sm font-black text-gray-400 group-hover:text-white transition-colors uppercase tracking-[0.1em]">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
