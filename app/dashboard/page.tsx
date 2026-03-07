'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronRight,
  Share2
} from 'lucide-react';
import { calculateGamificationMetrics } from '@/lib/gamification';
import { useAppStore } from '@/lib/store/useAppStore';
import { toTitleCase } from '@/lib/utils';

async function fetchDashboardData(userId: string) {
  const [userRes, roadmapRes] = await Promise.all([
    fetch(`/api/user?id=${userId}`),
    fetch(`/api/roadmap?user_id=${userId}`),
  ]);
  const [userData, roadmapData] = await Promise.all([userRes.json(), roadmapRes.json()]);

  let completedTopicIds: string[] = [];
  let roadmap = null;

  if (roadmapData.success && roadmapData.data?.roadmap) {
    roadmap = roadmapData.data.roadmap;
    const progressRes = await fetch(`/api/progress?user_id=${userId}&roadmap_id=${roadmap.id}`);
    const progressData = await progressRes.json();
    completedTopicIds = progressData.success ? progressData.data.completed_topic_ids || [] : [];
  }

  return {
    user: userData.success ? userData.data : null,
    roadmap,
    completedTopicIds,
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { setUser, setActiveRoadmap, completedTopicIds: storedCompleted } = useAppStore();

  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('activeUser') : null;
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!parsedUser) router.push('/onboarding');
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', parsedUser?.id],
    queryFn: () => fetchDashboardData(parsedUser!.id),
    enabled: !!parsedUser?.id,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data?.user) setUser(data.user);
    if (data?.roadmap) setActiveRoadmap(data.roadmap);
  }, [data]);

  const [showToast, setShowToast] = useState(false);

  if (isLoading || !parsedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const allCompleted = [...new Set([...(data?.completedTopicIds || []), ...storedCompleted])];
  const metrics = data?.roadmap ? calculateGamificationMetrics(data.roadmap, allCompleted) : null;
  const completionPercent = metrics?.completion_percent || 0;

  const handleShare = () => {
    if (!data?.roadmap) return;
    const shareUrl = `${window.location.origin}/roadmap?id=${data.roadmap.id}`;
    const text = `\ud83d\ude80 Track my ${toTitleCase(data.roadmap.career)} progress on CareerVibe! \n\nMastery: ${completionPercent}% \ud83d\udcc8\n\nView Roadmap: ${shareUrl}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 fade-in pt-4">
      {/* Custom Toast */}
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${
          showToast ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}>
         <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary shadow-[0_0_30px_rgba(198,255,0,0.3)] border border-white/20">
            <CheckCircle2 size={18} className="text-black" />
            <p className="text-black font-black uppercase tracking-widest text-[10px]">Link Copied Successfully</p>
         </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-white">
            Welcome back, <span className="text-primary">{toTitleCase(parsedUser.name)}</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Ready to continue your {toTitleCase(data?.roadmap?.career || 'career')} journey?</p>
        </div>
        {data?.roadmap && (
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-primary hover:border-primary/40 transition-all text-xs font-black uppercase tracking-widest"
          >
            <Share2 size={16} />
            Share Progress
          </button>
        )}
      </div>

      {/* Main Roadmap Card */}
      {data?.roadmap ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Progress Gauge */}
          <div className="vibe-card p-8 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-[#121212] to-[#0a0a0a]">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                <circle 
                  cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="none"
                  className="text-primary progress-ring"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * completionPercent) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">{completionPercent}%</span>
                <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Progress</span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="font-black text-xl">{allCompleted.length} / {data.roadmap.sections.reduce((acc: any, s: any) => acc + s.topics.length, 0)} Topics</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Mastery Level</p>
            </div>
          </div>

          {/* Path Details */}
          <div className="md:col-span-2 vibe-card p-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                Active Roadmap
              </div>
              <h2 className="text-5xl font-black leading-none">{toTitleCase(data.roadmap.career)}</h2>
              <div className="flex gap-8">
                 <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={18} />
                    <span className="text-sm font-bold">{data.roadmap.total_estimated_weeks} Week Sprint</span>
                 </div>
                 <div className="flex items-center gap-2 text-gray-400">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-bold">{allCompleted.length} Completed</span>
                 </div>
              </div>
            </div>

            <div className="pt-12">
              <button 
                onClick={() => router.push('/dashboard/roadmap')}
                className="neon-button text-lg px-8 py-4 w-full md:w-auto"
              >
                Continue Learning
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="vibe-card p-20 text-center space-y-6">
          <BookOpen className="w-16 h-16 text-gray-800 mx-auto" />
          <h2 className="text-3xl font-black">No Active Path</h2>
          <p className="text-gray-500 max-w-sm mx-auto font-medium">Head over to the Onboarding to generate your first AI-driven career roadmap.</p>
          <button onClick={() => router.push('/onboarding')} className="neon-button px-8 py-4">
             Get Personalized Roadmaps
          </button>
        </div>
      )}

      {/* Sections Overview (Real data) */}
      {data?.roadmap && (
        <div className="space-y-6 pt-6">
          <h2 className="text-xl font-black uppercase tracking-widest text-gray-600">Roadmap Sections</h2>
          <div className="grid md:grid-cols-2 gap-4">
             {data.roadmap.sections.map((section: any, i: number) => {
               const completedInSec = section.topics.filter((t: any) => allCompleted.includes(t.id)).length;
               const isComplete = completedInSec === section.topics.length;
               return (
                 <div key={i} className="vibe-card p-6 flex items-center justify-between group hover:bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isComplete ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                          {i + 1}
                       </div>
                       <div>
                          <p className="font-bold text-white">{toTitleCase(section.title)}</p>
                          <p className="text-xs text-gray-500 font-bold">{completedInSec} / {section.topics.length} topics</p>
                       </div>
                    </div>
                    <ChevronRight className="text-gray-700 group-hover:text-primary transition-colors" size={20} />
                 </div>
               );
             })}
          </div>
        </div>
      )}
    </div>
  );
}
