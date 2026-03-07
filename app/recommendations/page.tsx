'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Loader2, AlertCircle, TrendingUp, Target, Sparkles, ArrowRight } from 'lucide-react';
import type { UserProfile } from '@/types/user';
import { toTitleCase } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';

interface Career {
    title: string;
    description: string;
    domain: string;
}

export default function RecommendationsPage() {
    const router = useRouter();
    const [careers, setCareers] = useState<Career[]>([]);
    const [isGenerating, setIsGenerating] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            const storedUser = localStorage.getItem('activeUser');
            if (!storedUser) return router.push('/onboarding');

            try {
                const user: UserProfile = JSON.parse(storedUser);
                const profileRes = await fetch(`/api/user?id=${user.id}`);
                const profileData = await profileRes.json();

                if (profileData.success && profileData.data) {
                    const profile: UserProfile = profileData.data;
                    const recommendRes = await fetch('/api/recommend', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            skills: profile.skills || [],
                            interests: profile.interests || [],
                            domain: profile.domain,
                            education_level: profile.education_level
                        }),
                    });

                    const recommendData = await recommendRes.json();
                    if (recommendData.success && recommendData.data?.recommendations) {
                        setCareers(recommendData.data.recommendations);
                    } else {
                        setError(recommendData.error || "Failed to generate recommendations.");
                    }
                }
            } catch (err) {
                console.error(err);
                setError("An error occurred while loading your career paths.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [router]);

    const handleGenerateRoadmap = async (career: Career) => {
        const storedUser = localStorage.getItem('activeUser');
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        setIsGenerating(career.title);
        try {
            const res = await fetch('/api/roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    career: career.title,
                    domain: career.domain,
                }),
            });

            const data = await res.json();
            if (data.success) {
                router.push(`/roadmap?id=${data.data.roadmap.id}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center gap-6">
                <Loader2 className="w-16 h-16 animate-spin text-primary" />
                <div className="space-y-2">
                   <h2 className="text-2xl font-black uppercase tracking-tighter">AI Optimization in Progress...</h2>
                   <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Scanning high-growth industries for your match</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080808] text-white">
            <div className="max-w-5xl mx-auto py-20 px-6 space-y-16 fade-in">
                {/* Header */}
                <div className="space-y-8 flex flex-col items-center text-center">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(198,255,0,0.2)]">
                            <TrendingUp size={24} className="text-black" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter">CareerVibe</span>
                    </Link>
                    
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                          <Sparkles size={14} />
                          Top AI Recommendations
                        </div>
                          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">THE SHIFT IS <span className="text-primary">ON</span></h1>
                        <p className="text-gray-500 max-w-2xl font-bold uppercase tracking-widest text-xs">We found industry gaps that perfectly match your current DNA. Choose your path to initialize.</p>
                    </div>
                </div>

                {error && (
                    <div className="vibe-card p-6 border-red-500/20 bg-red-500/5 text-red-500 flex items-center gap-4 font-black uppercase tracking-widest text-sm">
                        <AlertCircle size={24} />
                        {error}
                    </div>
                )}

                {/* Careers Grid */}
                <div className="grid gap-6">
                    {careers.map((career, index) => (
                        <div key={index} className="vibe-card p-10 flex flex-col md:flex-row items-center justify-between gap-10 hover:border-primary/40">
                             <div className="flex-1 space-y-6 text-center md:text-left">
                                <div className="space-y-3">
                                  <div className="inline-block text-[10px] font-black uppercase text-gray-600 tracking-[0.3em]">{career.domain}</div>
                                  <h2 className="text-4xl font-black tracking-tight">{toTitleCase(career.title)}</h2>
                                </div>
                                <p className="text-gray-400 leading-relaxed font-bold text-sm uppercase tracking-wider max-w-xl">
                                  {career.description}
                                </p>
                             </div>

                             <button
                                onClick={() => handleGenerateRoadmap(career)}
                                disabled={isGenerating !== null}
                                className="neon-button px-10 py-5 text-xl whitespace-nowrap min-w-[280px]"
                             >
                                {isGenerating === career.title ? (
                                    <><Loader2 className="w-6 h-6 animate-spin mr-2" /> BUILDING...</>
                                ) : (
                                    <>MAP THIS PATH <ArrowRight size={22} className="ml-2" /></>
                                )}
                             </button>
                        </div>
                    ))}
                </div>

                <div className="pt-20 text-center">
                    <button onClick={() => router.push('/onboarding')} className="text-gray-700 font-bold text-xs uppercase tracking-[0.4em] hover:text-white transition-colors border-b border-white/5 pb-2">
                        Redo Intel Sync // Re-Onboard
                    </button>
                </div>
            </div>
        </div>
    );
}
