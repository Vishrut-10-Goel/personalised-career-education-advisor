'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <TrendingUp size={20} className="text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">CareerVibe</span>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Sign In</Link>
          <Link href="/signup" className="neon-button text-sm px-6 py-2.5">
            Start Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
