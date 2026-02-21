import type { Roadmap, RoadmapSection, RoadmapTopic } from "@/types/roadmap";

export interface GamificationMetrics {
    total_topics: number;
    completed_topics: number;
    completion_percent: number;
    current_section: string;
    current_stage: string;
    next_topic_title: string;
    milestones: {
        section_completed: boolean;
        milestone_25: boolean;
        milestone_50: boolean;
        milestone_75: boolean;
        milestone_complete: boolean;
    };
}

/**
 * Calculates gamification metrics and milestones based on roadmap and completed topic IDs.
 */
export function calculateGamificationMetrics(
    roadmap: Roadmap,
    completedTopicIds: string[]
): GamificationMetrics {
    const allTopics: RoadmapTopic[] = roadmap.sections.flatMap(s => s.topics);
    const total_topics = allTopics.length;
    const completed_topics = completedTopicIds.length;
    const completion_percent = total_topics > 0 ? Math.floor((completed_topics / total_topics) * 100) : 0;

    // Determine current section and next topic
    let current_section = "Not Started";
    let current_stage = "Beginner";
    let next_topic_title = "None";
    let section_completed = false;

    // Find the first section that is NOT fully completed
    const activeSection = roadmap.sections.find(section => {
        const sectionTopicIds = section.topics.map(t => t.id);
        const isSectionComplete = sectionTopicIds.every(id => completedTopicIds.includes(id));
        return !isSectionComplete;
    });

    if (activeSection) {
        current_section = activeSection.title;
        current_stage = activeSection.stage;
        const nextTopic = activeSection.topics.find(t => !completedTopicIds.includes(t.id));
        next_topic_title = nextTopic?.title || "None";
    } else if (total_topics > 0) {
        // All sections complete
        const lastSection = roadmap.sections[roadmap.sections.length - 1];
        current_section = lastSection.title;
        current_stage = lastSection.stage;
        section_completed = true;
    }

    return {
        total_topics,
        completed_topics,
        completion_percent,
        current_section,
        current_stage,
        next_topic_title,
        milestones: {
            section_completed,
            milestone_25: completion_percent >= 25,
            milestone_50: completion_percent >= 50,
            milestone_75: completion_percent >= 75,
            milestone_complete: completion_percent === 100
        }
    };
}
