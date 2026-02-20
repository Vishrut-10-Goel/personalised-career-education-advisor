'use client';

import ProgressTracker from '@/components/ProgressTracker';
import DashboardCard from '@/components/DashboardCard';
import { TrendingUp, Zap, Target } from 'lucide-react';

export default function ProgressPage() {
  const completedTopics = [
    'HTML & CSS Fundamentals',
    'JavaScript Essentials',
    'Git & GitHub',
    'React Basics',
    'State Management',
    'Node.js Fundamentals',
    'Express.js',
    'MongoDB Basics',
    'REST APIs',
    'Authentication',
    'Deployment',
    'Testing Basics',
    'Performance Optimization',
    'Security Basics',
    'Project 1: Todo App',
  ];

  const remainingTopics = [
    'Advanced React Patterns',
    'Database Optimization',
    'Docker & Kubernetes',
    'System Design',
    'Technical Communication',
    'Leadership',
    'Advanced Testing',
    'CI/CD Pipeline',
    'Monitoring & Logging',
    'Project 2: E-commerce',
    'Project 3: SaaS Platform',
    'Interview Prep',
    'Code Review Skills',
    'Documentation',
    'Advanced Security',
  ];

  const weeklyStats = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 3 },
    { day: 'Wed', hours: 2.5 },
    { day: 'Thu', hours: 3.5 },
    { day: 'Fri', hours: 2 },
    { day: 'Sat', hours: 4 },
    { day: 'Sun', hours: 1.5 },
  ];

  const totalHours = weeklyStats.reduce((sum, stat) => sum + stat.hours, 0);
  const maxHours = Math.max(...weeklyStats.map((s) => s.hours));

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="glass-card p-8 rounded-2xl border-l-4 border-green-500">
        <h1 className="text-3xl font-bold text-white mb-2">Your Progress Tracker</h1>
        <p className="text-gray-400">Monitor your learning journey and track your achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <DashboardCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Hours</p>
              <p className="text-3xl font-bold gradient-text">{totalHours.toFixed(1)}h</p>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="text-purple-400" size={24} />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Streak</p>
              <p className="text-3xl font-bold gradient-text">7</p>
              <p className="text-xs text-gray-500 mt-1">Days in a row</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Zap className="text-orange-400" size={24} />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Topics</p>
              <p className="text-3xl font-bold gradient-text">{completedTopics.length}</p>
              <p className="text-xs text-gray-500 mt-1">Completed</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Target className="text-green-400" size={24} />
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Main Progress Tracker */}
      <ProgressTracker
        progress={completedTopics.length}
        total={completedTopics.length + remainingTopics.length}
        completedTopics={completedTopics}
        remainingTopics={remainingTopics}
      />

      {/* Weekly Activity */}
      <DashboardCard title="Weekly Learning Activity">
        <div className="space-y-6">
          <div className="flex items-end justify-between h-40 gap-2">
            {weeklyStats.map((stat, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative flex-1 flex items-end group">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-lg opacity-70 hover:opacity-100 transition-opacity"
                    style={{ height: `${(stat.hours / maxHours) * 100}%` }}
                  />
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 px-2 py-1 rounded text-xs text-white whitespace-nowrap z-10">
                    {stat.hours}h
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium">{stat.day}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Great progress! You're averaging <span className="text-white font-semibold">{(totalHours / 7).toFixed(1)} hours</span> per day.
            </p>
          </div>
        </div>
      </DashboardCard>

      {/* Achievements */}
      <DashboardCard title="Recent Achievements">
        <div className="space-y-3">
          {[
            { icon: '🏆', title: 'Beginner Badge', desc: 'Completed all beginner topics' },
            { icon: '🔥', title: '7-Day Streak', desc: 'Learned 7 days in a row' },
            { icon: '📚', title: '15 Topics Done', desc: 'Completed 15 learning topics' },
            { icon: '⭐', title: 'First Project', desc: 'Completed your first project' },
          ].map((achievement, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 glass-card-dark rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="text-3xl">{achievement.icon}</div>
              <div>
                <p className="font-semibold text-white">{achievement.title}</p>
                <p className="text-sm text-gray-400">{achievement.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
