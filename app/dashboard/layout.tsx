'use client';

import Sidebar from '@/components/Sidebar';
import { Bell, Settings, User } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Navbar */}
        <nav className="glass-card-dark sticky top-0 z-40 border-b border-white/10">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2 hover:glass-card-dark rounded-lg transition-colors hover:bg-white/5">
                <Bell size={20} className="text-gray-400 hover:text-white" />
              </button>

              {/* Settings */}
              <button className="p-2 hover:glass-card-dark rounded-lg transition-colors hover:bg-white/5">
                <Settings size={20} className="text-gray-400 hover:text-white" />
              </button>

              {/* User Avatar */}
              <button className="w-10 h-10 rounded-lg gradient-button flex items-center justify-center text-white font-semibold hover:scale-105 transition-transform">
                <User size={20} />
              </button>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="p-6 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
