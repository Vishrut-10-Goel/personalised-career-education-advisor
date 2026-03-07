'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock, Map, BookOpen, ChevronRight, CheckCircle2, Loader2, Target, Share2, ExternalLink, Youtube, Book, PlayCircle } from 'lucide-react';
import type { Roadmap, RoadmapTopic } from '@/types/roadmap';
import type { UserProfile } from '@/types/user';
import { toTitleCase } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import { useAppStore } from '@/lib/store/useAppStore';

export default function RoadmapPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#080808] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        }>
            <div className="min-h-screen bg-[#080808] flex">
              <Sidebar />
              <div className="flex-1 md:ml-64 relative min-h-screen">
                <main className="p-6 md:p-8">
                  <RoadmapContent />
                </main>
              </div>
            </div>
        </Suspense>
    );
}

function RoadmapContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roadmapId = searchParams.get('id');
    const { setCompletedTopicIds, addCompletedTopic, setActiveRoadmap } = useAppStore();

    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [completedTopics, setCompletedTopics] = useState<string[]>([]);
    const [progressPercent, setProgressPercent] = useState(0);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (!roadmapId) {
            router.push('/dashboard');
            return;
        }

        const storedUser = localStorage.getItem('activeUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        fetchRoadmap(roadmapId);
    }, [roadmapId, router]);

    const fetchRoadmap = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/roadmap?id=${id}`);
            const data = await res.json();
            if (data.success && data.data) {
                const fetchedRoadmap = data.data.roadmap;
                setRoadmap(fetchedRoadmap);
                setActiveRoadmap(fetchedRoadmap);

                // Fetch progress once we have the roadmap
                const storedUser = localStorage.getItem('activeUser');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    fetchProgress(parsedUser.id, id);
                }
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error("Error fetching roadmap:", error);
            router.push('/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProgress = async (userId: string, roadmapId: string) => {
        try {
            const res = await fetch(`/api/progress?user_id=${userId}&roadmap_id=${roadmapId}`);
            const data = await res.json();
            if (data.success && data.data) {
                const ids = data.data.completed_topic_ids || [];
                setCompletedTopics(ids);
                setCompletedTopicIds(ids); 
                setProgressPercent(data.data.overall_progress_percent || 0);
            }
        } catch (error) {
            console.error("Error fetching progress:", error);
        }
    };

    const handleMarkComplete = async (topicId: string) => {
        if (!user || !roadmap || isUpdating) return;

        setIsUpdating(topicId);
        // Optimistic update
        addCompletedTopic(topicId);

        try {
            const res = await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    roadmap_id: roadmap.id,
                    topic_id: topicId
                }),
            });
            const data = await res.json();
            if (data.success && data.data) {
                const ids = data.data.completed_topic_ids;
                setCompletedTopics(ids);
                setCompletedTopicIds(ids);
                setProgressPercent(data.data.overall_progress_percent);
            }
        } catch (error) {
            console.error("Error updating progress:", error);
        } finally {
            setIsUpdating(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center pt-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Mapping your journey...</p>
            </div>
        );
    }

    if (!roadmap) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-12 fade-in">
            {/* Header Content */}
            <div className="space-y-8">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Hub
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                        Current Trajectory
                      </div>
                      <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-white">
                        {toTitleCase(roadmap.career)}
                      </h1>
                      <p className="text-xl text-gray-500 font-medium max-w-2xl">{roadmap.overview}</p>
                  </div>

                  <div className="vibe-card p-6 flex flex-col items-center justify-center gap-2 min-w-[160px]">
                      <span className="text-4xl font-black text-primary">{progressPercent}%</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mastery</span>
                  </div>
                </div>

                <div className="flex gap-8 border-t border-white/5 pt-8">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={18} className="text-primary" />
                        <span className="text-sm font-bold uppercase tracking-wider">{roadmap.total_estimated_weeks} Weeks</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Target size={18} className="text-primary" />
                        <span className="text-sm font-bold uppercase tracking-wider">{(roadmap.sections || []).length} Milestones</span>
                    </div>
                </div>
            </div>

            {/* Path Execution */}
            <div className="space-y-16 relative">
                {/* Vertical Line */}
                <div className="absolute left-[23px] top-4 bottom-4 w-px bg-white/5" />

                {(roadmap.sections || []).map((section, sIndex) => (
                    <div key={sIndex} className="relative pl-16 space-y-8">
                        {/* Node */}
                        <div className="absolute left-0 top-0 w-12 h-12 bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center text-white font-black text-lg z-10 shadow-xl">
                            {sIndex + 1}
                        </div>

                        <div className="space-y-2">
                          <h2 className="text-2xl font-black text-white">{toTitleCase(section.stage)}</h2>
                          <div className="h-0.5 w-12 bg-primary/30 rounded-full" />
                        </div>

                        <div className="grid gap-4">
                            {(section.topics || []).map((topic, tIndex) => {
                                const isCompleted = completedTopics.includes(topic.id);
                                return (
                                    <div
                                        key={topic.id}
                                        className={`vibe-card p-6 transition-all group ${
                                          isCompleted ? 'border-primary/20 bg-primary/[0.02]' : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="flex-1 space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className={`text-lg font-bold transition-colors ${
                                                          isCompleted ? 'text-primary' : 'text-white group-hover:text-primary'
                                                        }`}>
                                                            {toTitleCase(topic.title)}
                                                        </h3>
                                                        {isCompleted && <CheckCircle2 className="text-primary" size={18} />}
                                                    </div>
                                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{topic.description}</p>
                                                </div>

                                                {/* Resources */}
                                                {topic.resources && topic.resources.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        {topic.resources.map((res, rIdx) => (
                                                            <a 
                                                                key={rIdx}
                                                                href={res.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white"
                                                            >
                                                                {res.type === 'video' ? <Youtube size={14} className="text-red-500" /> : res.type === 'course' ? <PlayCircle size={14} className="text-blue-500" /> : <Book size={14} className="text-green-500" />}
                                                                {res.title}
                                                                <ExternalLink size={12} className="opacity-30" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleMarkComplete(topic.id)}
                                                disabled={isCompleted || isUpdating === topic.id}
                                                className={`flex-shrink-0 neon-button text-xs px-5 py-2.5 min-w-[130px] ${
                                                  isCompleted ? 'opacity-30 cursor-default bg-white/10 text-white shadow-none pointer-events-none' : ''
                                                }`}
                                            >
                                                {isUpdating === topic.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : isCompleted ? (
                                                    'Mastered'
                                                ) : (
                                                    'Mark Done'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="py-20 text-center">
               <p className="text-gray-700 font-bold text-[10px] uppercase tracking-[0.4em]">CareerVibe Engine 4.5 // Deployment Success</p>
            </div>
        </div>
    );
}
