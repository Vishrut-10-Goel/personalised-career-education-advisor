'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import type { UserProfile } from '@/types/user';

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
            if (!storedUser) {
                router.push('/onboarding');
                return;
            }

            try {
                const user: UserProfile = JSON.parse(storedUser);

                // Fetch full profile to get latest skills/domain
                const profileRes = await fetch(`/api/user?id=${user.id}`);
                const profileData = await profileRes.json();

                if (profileData.success && profileData.data) {
                    const profile: UserProfile = profileData.data;

                    // Call recommend API
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
                } else {
                    router.push('/onboarding');
                }
            } catch (err) {
                console.error("Failed to load recommendations:", err);
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    career: career.title,
                    domain: career.domain,
                }),
            });

            const data = await res.json();
            if (data.success) {
                router.push(`/roadmap?id=${data.data.roadmap.id}`);
            } else {
                alert(data.error || 'Failed to generate roadmap.');
            }
        } catch (error) {
            console.error('Error generating roadmap:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsGenerating(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                <p className="text-gray-400">Finding careers that match your profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">C</span>
                        </div>
                        <span className="gradient-text font-bold text-lg">Career Compass</span>
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-2">Tailored Career Paths</h1>
                    <p className="text-gray-400">Based on your background and the {careers[0]?.domain} domain, here's where you could excel.</p>
                </div>

                {error && (
                    <div className="glass-card p-6 rounded-2xl border-l-4 border-red-500 bg-red-500/10 mb-8 flex items-center gap-4">
                        <AlertCircle className="text-red-400" size={24} />
                        <p className="text-red-300">{error}</p>
                    </div>
                )}

                {careers.length === 0 && !error ? (
                    <div className="glass-card rounded-xl p-10 text-center">
                        <p className="text-gray-400 text-lg">No recommendations found.</p>
                        <Link href="/onboarding" className="inline-block mt-6 px-6 py-3 rounded-lg gradient-button text-white font-medium">
                            Update Profile
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {careers.map((career, index) => (
                            <div key={index} className="glass-card rounded-xl p-6 hover-lift transition-all border-l-2 border-transparent hover:border-purple-500/50">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-white mb-2">{career.title}</h2>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-6">{career.description}</p>

                                        <button
                                            onClick={() => handleGenerateRoadmap(career)}
                                            disabled={isGenerating !== null}
                                            className="px-6 py-2.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-sm font-bold transition-all border border-purple-500/20 flex items-center gap-2 group"
                                        >
                                            {isGenerating === career.title ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Preparing Roadmap...</>
                                            ) : (
                                                <>Build My Roadmap <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                                            )}
                                        </button>
                                    </div>
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 font-bold shrink-0">
                                        {index + 1}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 flex justify-center">
                            <Link href="/onboarding" className="text-gray-500 hover:text-white text-sm transition-colors border-b border-transparent hover:border-gray-500">
                                Want to change your domain? Redo Onboarding
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
