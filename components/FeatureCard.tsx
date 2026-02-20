import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <div
      className="glass-card group h-full flex flex-col p-6 hover-lift border-l-2 border-transparent hover:border-l-purple-500 transition-all"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:from-purple-500/40 group-hover:to-blue-500/40 transition-all">
        <Icon className="w-6 h-6 text-purple-400" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>

      {/* Description */}
      <p className="text-gray-400 flex-1 leading-relaxed">{description}</p>

      {/* Arrow */}
      <div className="mt-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
