'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock, Map, BookOpen, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import type { Roadmap } from '@/types/roadmap';
import type { UserProfile } from '@/types/user';
import type { UserProgress } from '@/types/roadmap';

export default function RoadmapPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        }>
            <RoadmapContent />
        </Suspense>
    );
}

function RoadmapContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roadmapId = searchParams.get('id');

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
                setRoadmap(data.data.roadmap);

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
                setCompletedTopics(data.data.completed_topic_ids || []);
                setProgressPercent(data.data.overall_progress_percent || 0);
            }
        } catch (error) {
            console.error("Error fetching progress:", error);
        }
    };

    const handleMarkComplete = async (topicId: string) => {
        if (!user || !roadmap || isUpdating) return;

        setIsUpdating(topicId);
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
                setCompletedTopics(data.data.completed_topic_ids);
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
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                <p className="text-gray-400">Loading your roadmap...</p>
            </div>
        );
    }

    if (!roadmap) {
        return null; // Should be handled by router.push
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft size={20} /> Back to Dashboard
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                            <Map size={24} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white capitalize">{roadmap.career}</h1>
                            <p className="text-gray-400">{roadmap.domain}</p>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <p className="text-gray-300 leading-relaxed mb-4">{roadmap.overview}</p>
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-purple-400">
                                <Clock size={16} />
                                <span>{roadmap.total_estimated_weeks} Weeks Total</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-400">
                                <BookOpen size={16} />
                                <span>{(roadmap.sections || []).length} Main Sections</span>
                            </div>
                        </div>

                        {/* Progress Bar - Task 3 */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-medium text-gray-400">Completion Progress</span>
                                <span className="text-2xl font-bold gradient-text">{progressPercent}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {(roadmap.sections || []).map((section, sIndex) => (
                        <div key={sIndex} className="relative">
                            {/* Connection Line */}
                            {sIndex !== roadmap.sections.length - 1 && (
                                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 to-transparent" />
                            )}

                            <div className="flex gap-6">
                                <div className="w-12 h-12 flex-shrink-0 glass-card-dark border border-white/10 rounded-full flex items-center justify-center text-white font-bold z-10">
                                    {sIndex + 1}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                        {section.stage}
                                        <span className="text-sm font-normal text-gray-500 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                            Stage {sIndex + 1}
                                        </span>
                                    </h2>

                                    <div className="grid gap-4">
                                        {(section.topics || []).map((topic, tIndex) => {
                                            const isCompleted = completedTopics.includes(topic.id);
                                            return (
                                                <div
                                                    key={tIndex}
                                                    className={`glass-card p-5 rounded-xl transition-all group border-2 ${isCompleted ? 'border-green-500/50 bg-green-500/5' : 'border-transparent hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                                                                    {topic.title}
                                                                </h3>
                                                                {isCompleted && <CheckCircle2 className="text-green-500" size={18} />}
                                                            </div>
                                                            <p className="text-gray-400 text-sm leading-relaxed">{topic.description}</p>
                                                        </div>

                                                        <button
                                                            onClick={() => handleMarkComplete(topic.id)}
                                                            disabled={isCompleted || isUpdating === topic.id}
                                                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isCompleted
                                                                ? 'bg-green-500/20 text-green-400 cursor-default'
                                                                : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 active:scale-95'
                                                                }`}
                                                        >
                                                            {isUpdating === topic.id ? (
                                                                <Loader2 size={16} className="animate-spin" />
                                                            ) : isCompleted ? (
                                                                'Completed'
                                                            ) : (
                                                                'Mark Complete'
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
