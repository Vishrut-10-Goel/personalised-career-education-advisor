'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Zap, Target, Loader2, BookOpen, Clock, ChevronRight } from 'lucide-react';
import type { UserProgress, Roadmap } from '@/types/roadmap';
import { toTitleCase } from '@/lib/utils';

export default function ProgressPage() {
  const router = useRouter();
  const [progressRows, setProgressRows] = useState<UserProgress[]>([]);
  const [completedTopicTitles, setCompletedTopicTitles] = useState<string[]>([]);
  const [totalTopicsCount, setTotalTopicsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllProgress = async () => {
      const storedUser = localStorage.getItem('activeUser');
      if (!storedUser) return router.push('/onboarding');
      const user = JSON.parse(storedUser);

      try {
        const res = await fetch(`/api/progress?user_id=${user.id}`);
        const data = await res.json();

        if (data.success) {
          const rows: UserProgress[] = data.data || [];
          setProgressRows(rows);

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

                roadmap.sections.forEach(s => {
                  totalCount += (s.topics || []).length;
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
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProgress();
  }, [router]);

  const totalCompleted = completedTopicTitles.length;
  const overallPercent = totalTopicsCount > 0 ? Math.floor((totalCompleted / totalTopicsCount) * 100) : 0;
  const totalHours = (totalCompleted * 0.5);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 fade-in pt-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-white">
          My <span className="text-primary font-bold">Library</span>
        </h1>
        <p className="text-gray-500 font-medium">Archive of your mastered skills and active paths.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="vibe-card p-8 flex items-center justify-between group">
            <div className="space-y-1">
               <p className="text-xs font-black uppercase tracking-widest text-gray-600">Time Invested</p>
               <p className="text-4xl font-black text-white">{totalHours.toFixed(1)}h</p>
            </div>
            <Clock size={32} className="text-primary/20 group-hover:text-primary transition-colors" />
        </div>

        <div className="vibe-card p-8 flex items-center justify-between group">
            <div className="space-y-1">
               <p className="text-xs font-black uppercase tracking-widest text-gray-600">Active Path Count</p>
               <p className="text-4xl font-black text-white">{progressRows.length}</p>
            </div>
            <BookOpen size={32} className="text-primary/20 group-hover:text-primary transition-colors" />
        </div>

        <div className="vibe-card p-8 flex items-center justify-between group">
            <div className="space-y-1">
               <p className="text-xs font-black uppercase tracking-widest text-gray-600">Total Mastery</p>
               <p className="text-4xl font-black text-white">{totalCompleted}</p>
            </div>
            <Target size={32} className="text-primary/20 group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Real Progress Metrics */}
      <div className="vibe-card p-12 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
               <h3 className="text-3xl font-black text-white leading-none">Global Mastery Matrix</h3>
               <p className="text-gray-500 font-medium">Your overall performance across all sectors.</p>
            </div>
            <div className="flex items-baseline gap-2">
               <span className="text-6xl font-black text-primary">{overallPercent}%</span>
               <span className="text-gray-700 font-black text-xs uppercase tracking-widest">Global Rank</span>
            </div>
          </div>

          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
             <div 
               className="h-full bg-primary transition-all duration-1000 ease-out"
               style={{ width: `${overallPercent}%` }}
             />
          </div>

          <div className="grid md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
             <div className="space-y-6">
                <h4 className="text-xs font-black text-gray-600 uppercase tracking-[0.3em]">Freshly Mastered</h4>
                <div className="space-y-3">
                   {completedTopicTitles.length > 0 ? completedTopicTitles.slice(0, 10).map((title, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 vibe-card bg-white/[0.02]">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(198,255,0,0.8)]" />
                         <span className="text-sm font-bold text-gray-200">{toTitleCase(title)}</span>
                      </div>
                   )) : (
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No intel collected yet.</p>
                   )}
                </div>
             </div>

             <div className="vibe-card p-8 bg-primary/5 border-primary/20 flex flex-col items-center justify-center text-center gap-6">
                 <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Zap size={32} />
                 </div>
                 <h4 className="text-xl font-black">Hustle Logic Active</h4>
                 <p className="text-gray-500 font-medium">You have initialized {progressRows.length} career paths. Keep shipping topics to level up your Matrix rank.</p>
                 <button onClick={() => router.push('/dashboard')} className="neon-button px-8 py-3 w-full">
                    Resume Active Path
                 </button>
             </div>
          </div>
      </div>
    </div>
  );
}
