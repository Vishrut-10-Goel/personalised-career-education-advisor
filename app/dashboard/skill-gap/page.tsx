'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  BrainCircuit, 
  ArrowRight,
  ShieldAlert,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { toTitleCase } from '@/lib/utils';
import type { RoadmapTopic, RoadmapResource } from '@/types/roadmap';
import { Youtube, PlayCircle, Book, ExternalLink } from 'lucide-react';

interface SkillGap {
  skill: string;
  status: 'mastered' | 'missing' | 'in-progress';
  importance: 'critical' | 'base' | 'bonus';
  resources?: RoadmapResource[];
}

export default function SkillGapPage() {
  const router = useRouter();
  const { user, setUser, activeRoadmap, setActiveRoadmap, completedTopicIds } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [gaps, setGaps] = useState<SkillGap[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const hydrateAndAnalyze = async () => {
      let currentUser = user;
      let currentRoadmap = activeRoadmap;

      // 1. Hydrate User from LocalStorage if missing
      if (!currentUser) {
        const stored = localStorage.getItem('activeUser');
        if (stored) {
          currentUser = JSON.parse(stored);
          setUser(currentUser!);
        } else {
          router.push('/signup');
          return;
        }
      }

      // 2. Fetch Roadmap if missing
      if (!currentRoadmap && currentUser?.id) {
        try {
          const res = await fetch(`/api/roadmap?user_id=${currentUser.id}`);
          const data = await res.json();
          if (data.success && data.data?.roadmap) {
            currentRoadmap = data.data.roadmap;
            setActiveRoadmap(currentRoadmap);
          } else {
            router.push('/dashboard');
            return;
          }
        } catch (err) {
          console.error("Hydration error:", err);
          router.push('/dashboard');
          return;
        }
      }

      if (currentUser && currentRoadmap) {
        analyzeGap(currentUser, currentRoadmap);
      }
    };

    hydrateAndAnalyze();
  }, [user, activeRoadmap, completedTopicIds]);

  const analyzeGap = (currUser: any, currRoadmap: any) => {
    setLoading(true);
    
    // Use the passed in values to avoid stale closure issues
    const allTopics: RoadmapTopic[] = currRoadmap.sections.flatMap((s: any) => s.topics);
    const userSkills = (currUser.skills || []).map((s: string) => s.toLowerCase());
    
    const analysis: SkillGap[] = allTopics.map(topic => {
      const topicTitle = topic.title.toLowerCase();
      const isCompleted = completedTopicIds.includes(topic.id);
      const isInitiallyKnown = userSkills.some((sk: string) => topicTitle.includes(sk) || sk.includes(topicTitle));
      
      let status: 'mastered' | 'missing' | 'in-progress' = 'missing';
      if (isCompleted) status = 'mastered';
      else if (isInitiallyKnown) status = 'mastered';

      // Assign importance based on section level (mock logic)
      const section = currRoadmap.sections.find((s: any) => s.topics.some((t: any) => t.id === topic.id));
      const importance = section?.stage === 'Beginner' ? 'critical' : section?.stage === 'Intermediate' ? 'base' : 'bonus';

      return {
        skill: topic.title,
        status,
        importance,
        resources: topic.resources
      };
    });

    setGaps(analysis);
    
    const masteredCount = analysis.filter(g => g.status === 'mastered').length;
    setScore(Math.round((masteredCount / analysis.length) * 100));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 gap-6">
        <div className="relative">
            <BrainCircuit size={64} className="text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        </div>
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Scanning Skill Matrix...</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Comparing profile DNA with industry requirements</p>
        </div>
      </div>
    );
  }

  const missingCritical = gaps.filter(g => g.status === 'missing' && g.importance === 'critical');
  const mastered = gaps.filter(g => g.status === 'mastered');

  return (
    <div className="max-w-6xl mx-auto space-y-12 fade-in pt-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-white">
          Skill <span className="text-primary">Gap</span> Analyzer
        </h1>
        <p className="text-gray-500 font-medium tracking-wide">Identifying the missing links in your {toTitleCase(activeRoadmap?.career || '')} career arc.</p>
      </div>

      {/* Analysis Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Score Card */}
        <div className="vibe-card p-10 flex flex-col items-center justify-center gap-6 text-center border-primary/20 bg-primary/[0.02]">
           <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 absolute">
                <circle cx="64" cy="64" r="58" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                <circle 
                  cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="none"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * score) / 100}
                  className="text-primary transition-all duration-1000"
                />
              </svg>
              <span className="text-5xl font-black">{score}%</span>
           </div>
           <div className="space-y-1">
              <h3 className="text-xl font-black uppercase">Readiness Score</h3>
              <p className="text-[10px] text-gray-500 font-black tracking-widest">Industry Alignment Rating</p>
           </div>
        </div>

        {/* Priority Actions */}
        <div className="md:col-span-2 vibe-card p-10 space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                   <ShieldAlert size={24} />
                </div>
                <div>
                   <h3 className="text-xl font-black uppercase">Critical Deficits</h3>
                   <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">Immediate focus required for employment</p>
                </div>
              </div>
              <div className="hidden lg:block max-w-[200px] text-right">
                 <p className="text-[10px] font-bold text-gray-600 uppercase leading-relaxed">
                   The analyzer compares your profile DNA with industry-standard benchmarks.
                 </p>
              </div>
           </div>

           <div className="grid sm:grid-cols-2 gap-4">
              {missingCritical.length > 0 ? missingCritical.slice(0, 4).map((g, i) => (
                <div key={i} className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-between">
                   <span className="text-sm font-bold text-gray-200">{toTitleCase(g.skill)}</span>
                   <Zap size={14} className="text-red-500" />
                </div>
              )) : (
                <div className="sm:col-span-2 p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                   <CheckCircle2 size={32} className="text-primary mx-auto mb-3" />
                   <p className="font-bold text-primary">No critical gaps! You have the foundation.</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Explanation Section */}
      <div className="grid md:grid-cols-2 gap-8">
         <div className="vibe-card p-8 space-y-4 bg-white/[0.01]">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary">What is the Skill Gap?</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              The Skill Gap Analyzer is your career "Mastery Ledger." It identifies the difference between your current skill set (from onboarding) and the professional requirements of your chosen career path. It calculates your <strong>Readiness Score</strong> by weighting critical foundational topics higher than advanced elective skills.
            </p>
         </div>
         <div className="vibe-card p-8 space-y-4 bg-white/[0.01]">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary">How to improve?</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Every topic you mark as <strong>Mastered</strong> in your Roadmap instantly updates your readiness score. Focusing on "Critical Requirements" (highlighted in red) will provide the fastest boost to your employability rating.
            </p>
         </div>
      </div>

      {/* Detailed Matrix */}
      <div className="vibe-card p-12 space-y-10">
         <h3 className="text-2xl font-black uppercase tracking-tight">Requirement Matrix</h3>
         
         <div className="grid gap-4">
            {gaps.map((g, i) => (
               <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all">
                  <div className="flex-1">
                     <div className="flex items-center gap-6">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                           g.status === 'mastered' ? 'bg-primary shadow-[0_0_8px_rgba(198,255,0,0.5)]' : 
                           g.status === 'in-progress' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 
                           'bg-gray-800'
                        }`} />
                        <div className="space-y-3">
                           <div>
                              <p className="font-bold text-white group-hover:text-primary transition-colors">{toTitleCase(g.skill)}</p>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${
                                 g.importance === 'critical' ? 'text-red-500' : 'text-gray-600'
                              }`}>{g.importance} Requirement</p>
                           </div>

                           {/* Resources Integration */}
                           {g.resources && g.resources.length > 0 && g.status !== 'mastered' && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                 {g.resources.map((res, rIdx) => (
                                    <a 
                                       key={rIdx}
                                       href={res.url}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white"
                                    >
                                       {res.type === 'video' ? <Youtube size={12} className="text-red-500" /> : res.type === 'course' ? <PlayCircle size={12} className="text-blue-500" /> : <Book size={12} className="text-green-500" />}
                                       {res.title}
                                       <ExternalLink size={10} className="opacity-30" />
                                    </a>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                     {g.status === 'missing' && (
                        <button 
                           onClick={() => router.push(`/dashboard/roadmap?id=${activeRoadmap?.id}`)}
                           className="text-[10px] font-black text-primary hover:underline flex items-center gap-1"
                        >
                           DETAILS <ArrowRight size={12} />
                        </button>
                     )}
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        g.status === 'mastered' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500'
                     }`}>
                        {g.status}
                     </span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
