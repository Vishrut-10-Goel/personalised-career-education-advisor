'use client';

import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface RoadmapCardProps {
  title: string;
  description: string;
  duration: string;
  index: number;
}

export default function RoadmapCard({ title, description, duration, index }: RoadmapCardProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <div className="glass-card p-6 rounded-xl hover-lift border-l-4 border-purple-500/50 hover:border-purple-400 transition-all">
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => setIsCompleted(!isCompleted)}
          className="flex-shrink-0 mt-1 transition-transform hover:scale-110"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-purple-400" />
          ) : (
            <Circle className="w-6 h-6 text-gray-500 hover:text-purple-400" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1">
          <h4 className={`font-semibold text-lg mb-2 transition-all ${
            isCompleted ? 'text-gray-400 line-through' : 'text-white'
          }`}>
            {title}
          </h4>
          <p className="text-gray-400 text-sm mb-3">{description}</p>
          <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium">
            {duration}
          </span>
        </div>

        {/* Step Number */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-300 font-semibold text-sm">
          {index}
        </div>
      </div>
    </div>
  );
}
