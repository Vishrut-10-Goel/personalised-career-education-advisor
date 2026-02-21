'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import RoadmapSection from '@/components/RoadmapCard'; // Re-using logic or redirecting
import type { Roadmap } from '@/types/roadmap';

export default function DashboardRoadmapPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestAndRedirect = async () => {
      const storedUser = localStorage.getItem('activeUser');
      if (!storedUser) {
        router.push('/onboarding');
        return;
      }

      try {
        const user = JSON.parse(storedUser);
        const res = await fetch(`/api/roadmap?user_id=${user.id}`);
        const data = await res.json();

        if (data.success && data.data?.roadmap) {
          router.push(`/roadmap?id=${data.data.roadmap.id}`);
        } else {
          router.push('/recommendations');
        }
      } catch (error) {
        console.error("Failed to fetch roadmap:", error);
        router.push('/dashboard');
      }
    };

    fetchLatestAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
      <p className="text-gray-400">Loading your roadmap...</p>
    </div>
  );
}
