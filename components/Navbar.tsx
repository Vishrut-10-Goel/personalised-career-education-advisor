'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) return null; // Dashboard has its own navbar

  return (
    <nav className="glass-card-dark fixed top-0 left-0 right-0 z-50 border-0 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="gradient-text font-bold text-lg hidden sm:inline">CareerAI</span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
            How It Works
          </Link>
        </div>

        {/* Auth Links */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup" className="px-4 py-2 rounded-lg gradient-button text-white font-medium hover-lift">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
