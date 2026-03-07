import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@/types/user';
import type { Roadmap } from '@/types/roadmap';

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Active Roadmap
  activeRoadmap: Roadmap | null;
  setActiveRoadmap: (roadmap: Roadmap | null) => void;

  // Completed Topics (Optimistic UI)
  completedTopicIds: string[];
  setCompletedTopicIds: (topicIds: string[]) => void;
  addCompletedTopic: (topicId: string) => void;

  // Reset all state on logout
  reset: () => void;
}

const initialState = {
  user: null,
  activeRoadmap: null,
  completedTopicIds: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setUser: (user) => set({ user }),
      setActiveRoadmap: (activeRoadmap) => set({ activeRoadmap }),

      setCompletedTopicIds: (topicIds) => set({ completedTopicIds: topicIds }),

      // Optimistic update — instantly reflects in the UI before DB confirms
      addCompletedTopic: (topicId) =>
        set((state) => ({
          completedTopicIds: state.completedTopicIds.includes(topicId)
            ? state.completedTopicIds
            : [...state.completedTopicIds, topicId],
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'career-ai-store',
      // Only persist user ID and completed topics to localStorage
      partialize: (state) => ({
        completedTopicIds: state.completedTopicIds,
        user: { id: state.user?.id }, // Persist enough to identify session
      }),
    }
  )
);
