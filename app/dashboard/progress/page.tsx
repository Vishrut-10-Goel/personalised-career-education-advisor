'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardCard from '@/components/DashboardCard';
import { TrendingUp, Zap, Target, Loader2 } from 'lucide-react';
import type { UserProgress, Roadmap } from '@/types/roadmap';

export default function ProgressPage() {
  const router = useRouter();
  const [progressRows, setProgressRows] = useState<UserProgress[]>([]);
  const [completedTopicTitles, setCompletedTopicTitles] = useState<string[]>([]);
  const [totalTopicsCount, setTotalTopicsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllProgress = async () => {
      const storedUser = localStorage.getItem('activeUser');
      if (!storedUser) {
        router.push('/onboarding');
        return;
      }
      const user = JSON.parse(storedUser);

      try {
        // 1. Fetch all progress rows
        const res = await fetch(`/api/progress?user_id=${user.id}`);
        const data = await res.json();

        if (data.success) {
          const rows: UserProgress[] = data.data || [];
          setProgressRows(rows);

          // 2. Fetch all unique roadmaps to count total topics and get titles
          const roadmapIds = Array.from(new Set(rows.map(r => r.roadmap_id)));
          let totalCount = 0;
          let completedTitles: string[] = [];

          if (roadmapIds.length > 0) {
            const roadmapPromises = roadmapIds.map(id => fetch(`/api/roadmap?id=${id}`).then(r => r.json()));
            const roadmapsResponses = await Promise.all(roadmapPromises);

            roadmapsResponses.forEach(rr => {
              if (rr.success && rr.data?.roadmap) {
                const roadmap: Roadmap = rr.data.roadmap;
                const roadmapProgress = rows.find(r => r.roadmap_id === roadmap.id);

                // Count all topics in this roadmap
                roadmap.sections.forEach(s => {
                  totalCount += (s.topics || []).length;

                  // Collect titles of completed topics
                  if (roadmapProgress) {
                    s.topics.forEach(t => {
                      if (roadmapProgress.completed_topic_ids.includes(t.id)) {
                        completedTitles.push(t.title);
                      }
                    });
                  }
                });
              }
            });
          }

          setTotalTopicsCount(totalCount);
          setCompletedTopicTitles(completedTitles);
        }
      } catch (error) {
        console.error("Failed to fetch progress metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProgress();
  }, [router]);

  const totalCompleted = completedTopicTitles.length;
  const overallPercent = totalTopicsCount > 0 ? Math.floor((totalCompleted / totalTopicsCount) * 100) : 0;

  // Simulated stats for UI consistency (as DB doesn't track these yet)
  const streak = progressRows.length > 0 ? 3 : 0;
  const totalHours = (totalCompleted * 0.5); // Estimate 30 mins per topic

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
        <p className="text-gray-400">Loading your progress data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="glass-card p-8 rounded-2xl border-l-4 border-green-500">
        <h1 className="text-3xl font-bold text-white mb-2">Your Progress Tracker</h1>
        <p className="text-gray-400">Monitor your learning journey and track your achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <DashboardCard title="Estimated Effort">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Estimated Effort</p>
              <p className="text-3xl font-bold gradient-text">{totalHours.toFixed(1)}h</p>
              <p className="text-xs text-gray-500 mt-1">Total invested</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="text-purple-400" size={24} />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Active Paths">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Paths</p>
              <p className="text-3xl font-bold gradient-text">{progressRows.length}</p>
              <p className="text-xs text-gray-500 mt-1">Roadmaps in progress</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Zap className="text-orange-400" size={24} />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Topics">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Topics</p>
              <p className="text-3xl font-bold gradient-text">{totalCompleted}</p>
              <p className="text-xs text-gray-500 mt-1">Completed across all paths</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Target className="text-green-400" size={24} />
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Main Progress Tracker */}
      <div className="glass-card p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Global Completion</h3>
            <p className="text-gray-400 text-sm">Overall mastery across all enrolled careers</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-white">{overallPercent}%</span>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Progress</p>
          </div>
        </div>

        <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-12">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
            style={{ width: `${overallPercent}%` }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Recently Completed</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {completedTopicTitles.length > 0 ? completedTopicTitles.map((title, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 glass-card-dark rounded-lg border-l-2 border-green-500/50">
                  <Target className="text-green-500" size={16} />
                  <span className="text-sm text-gray-200">{title}</span>
                </div>
              )) : (
                <p className="text-gray-500 text-sm italic">No topics completed yet. Keep learning!</p>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center bg-white/3 rounded-2xl p-6 border border-white/5">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-4">
                <Zap className="text-green-400" size={32} />
              </div>
              <h4 className="text-white font-bold mb-2">Keep the Momentum!</h4>
              <p className="text-gray-400 text-sm mb-6">
                You have completed {totalCompleted} out of {totalTopicsCount} topics.
                Stay consistent to reach your career goals.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2 rounded-lg gradient-button text-white text-sm font-medium hover-lift"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Fallback */}
      <DashboardCard title="Achievements & Badges">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🌱', label: 'Starter', active: totalCompleted >= 1 },
            { icon: '🔥', label: 'Motivated', active: totalCompleted >= 5 },
            { icon: '📚', label: 'Learner', active: totalCompleted >= 15 },
            { icon: '🎓', label: 'Expert', active: totalCompleted >= 30 },
          ].map((badge, idx) => (
            <div key={idx} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${badge.active ? 'glass-card border-green-500/30' : 'bg-white/2 opacity-30 border-transparent grayscale'
              }`}>
              <span className="text-3xl">{badge.icon}</span>
              <span className={`text-xs font-bold ${badge.active ? 'text-white' : 'text-gray-500'}`}>{badge.label}</span>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
