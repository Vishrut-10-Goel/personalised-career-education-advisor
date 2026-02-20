'use client';

import { LucideIcon } from 'lucide-react';

interface CareerDomainCardProps {
  title: string;
  icon: LucideIcon;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CareerDomainCard({
  title,
  icon: Icon,
  isSelected = false,
  onClick,
}: CareerDomainCardProps) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-xl transition-all text-center group ${
        isSelected
          ? 'glass-card-dark bg-gradient-to-br from-purple-500/30 to-blue-500/30 border-2 border-purple-500 shadow-lg shadow-purple-500/20'
          : 'glass-card hover-lift'
      }`}
    >
      <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${
        isSelected
          ? 'bg-gradient-to-r from-purple-500 to-blue-500'
          : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/40 group-hover:to-blue-500/40'
      } transition-all`}>
        <Icon className={isSelected ? 'text-white' : 'text-purple-400 group-hover:text-purple-300'} size={24} />
      </div>
      <h3 className={`font-semibold transition-colors ${
        isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
      }`}>
        {title}
      </h3>
    </button>
  );
}
