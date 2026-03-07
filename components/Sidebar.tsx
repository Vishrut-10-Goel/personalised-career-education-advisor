'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  TrendingUp,
  LogOut,
  ChevronRight,
  Target
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toTitleCase } from '@/lib/utils';
import type { UserProfile } from '@/types/user';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/roadmap', label: 'Roadmap', icon: BookOpen },
  { href: '/dashboard/skill-gap', label: 'Skill Gap', icon: Target },
  { href: '/dashboard/chatbot', label: 'AI Chatbot', icon: MessageCircle },
  { href: '/dashboard/progress', label: 'My Library', icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('activeUser');
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/5 p-6 flex flex-col gap-8 z-50">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(198,255,0,0.2)]">
          <TrendingUp size={22} className="text-black" />
        </div>
        <span className="text-2xl font-black tracking-tighter text-white">CareerVibe</span>
      </Link>

      {/* Actual Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 px-2 mb-2">Navigator</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <Icon size={20} />
              <span className="text-sm font-bold">{item.label}</span>
              {isActive && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Clean User Profile (Real Data) */}
      {profile && (
        <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
          <div 
            className="flex items-center gap-3 px-2 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all"
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold">
              {(profile.full_name?.[0] || 'U').toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{toTitleCase(profile.full_name || 'Member')}</p>
              <p className="text-[10px] text-gray-500 truncate font-bold uppercase">Member</p>
            </div>
          </div>

          {showDetails && (
            <div className="px-3 py-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 animate-in slide-in-from-bottom-2 fade-in">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Full Name</p>
                <p className="text-xs font-bold text-white leading-tight">{toTitleCase(profile.full_name || 'N/A')}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Identity</p>
                <p className="text-[10px] font-bold text-white leading-tight truncate">{profile.email}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => {
              localStorage.removeItem('activeUser');
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
