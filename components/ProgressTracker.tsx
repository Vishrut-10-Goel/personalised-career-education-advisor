'use client';

import { Check } from 'lucide-react';

interface ProgressTrackerProps {
  progress: number;
  total: number;
  completedTopics: string[];
  remainingTopics: string[];
}

export default function ProgressTracker({
  progress,
  total,
  completedTopics,
  remainingTopics,
}: ProgressTrackerProps) {
  const progressPercentage = (progress / total) * 100;

  return (
    <div className="space-y-8">
      {/* Circular Progress */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90" width="128" height="128">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="4"
              strokeDasharray={`${(progressPercentage / 100) * 376.99} 376.99`}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dasharray 0.6s ease',
              }}
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold gradient-text">{progress}</div>
            <div className="text-sm text-gray-400">of {total}</div>
          </div>
        </div>
        <p className="mt-4 text-gray-400">
          {progressPercentage.toFixed(0)}% Complete
        </p>
      </div>

      {/* Completed Topics */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Check size={20} className="text-green-400" />
          Completed Topics
        </h4>
        <div className="space-y-2">
          {completedTopics.map((topic, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-4 py-2 rounded-lg glass-card-dark bg-green-500/10 border border-green-500/30"
            >
              <Check size={16} className="text-green-400" />
              <span className="text-gray-300">{topic}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Remaining Topics */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Remaining Topics</h4>
        <div className="space-y-2">
          {remainingTopics.map((topic, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-4 py-2 rounded-lg glass-card-dark bg-yellow-500/10 border border-yellow-500/30"
            >
              <div className="w-4 h-4 rounded border border-yellow-400" />
              <span className="text-gray-300">{topic}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
