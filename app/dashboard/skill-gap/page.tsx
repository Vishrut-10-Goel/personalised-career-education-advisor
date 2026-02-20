'use client';

import DashboardCard from '@/components/DashboardCard';
import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';

export default function SkillGapPage() {
  const [resume, setResume] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<boolean>(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setResults(true);
    }, 1500);
  };

  const targetRoles = ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer'];

  const missingTechnicalSkills = [
    { skill: 'Advanced React Patterns', importance: 'High', resources: '5 courses' },
    { skill: 'Database Optimization', importance: 'High', resources: '3 courses' },
    { skill: 'Docker & Kubernetes', importance: 'Medium', resources: '4 courses' },
    { skill: 'System Design', importance: 'Medium', resources: '2 courses' },
  ];

  const missingSoftSkills = [
    { skill: 'Technical Communication', importance: 'High', resources: '2 courses' },
    { skill: 'Leadership', importance: 'Medium', resources: '3 courses' },
  ];

  const suggestions = [
    'Focus on completing the React course first - it will significantly boost your skills.',
    'Start learning Docker basics - it\'s increasingly demanded in job postings.',
    'Work on system design problems to prepare for interviews.',
    'Build 2-3 portfolio projects showcasing your full-stack skills.',
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="glass-card p-8 rounded-2xl border-l-4 border-orange-500">
        <h1 className="text-3xl font-bold text-white mb-2">Career Readiness Analyzer</h1>
        <p className="text-gray-400">Analyze your profile and identify what you need to succeed in your target career</p>
      </div>

      {/* Input Section */}
      {!results && (
        <DashboardCard title="Analyze Your Career Readiness">
          <form onSubmit={handleAnalyze} className="space-y-6">
            {/* Profile Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Your Profile or Background
              </label>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Describe your educational background, work experience, skills, and qualifications..."
                className="w-full p-4 rounded-lg glass-card-dark bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all min-h-32 resize-none"
                required
              />
            </div>

            {/* Target Career */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Target Career
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-3 rounded-lg glass-card-dark bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                required
              >
                <option value="">Select a career...</option>
                {targetRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Analyze Button */}
            <button
              type="submit"
              disabled={isAnalyzing || !resume.trim() || !targetRole}
              className="w-full py-3 rounded-lg gradient-button text-white font-semibold hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Readiness
                  <Send size={18} />
                </>
              )}
            </button>
          </form>
        </DashboardCard>
      )}

      {/* Results Section */}
      {results && (
        <>
          {/* Summary */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="text-orange-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Analysis Complete</h3>
                <p className="text-gray-400">Based on your profile and target career, here's what you need to succeed:</p>
              </div>
            </div>
          </div>

          {/* Required Qualifications */}
          <DashboardCard title="Required Qualifications">
            <div className="space-y-3">
              {missingTechnicalSkills.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card-dark p-4 rounded-lg border-l-4 border-orange-500/50 hover:border-orange-400 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{item.skill}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.importance === 'High'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {item.importance} Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{item.resources} available</p>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Required Skills */}
          <DashboardCard title="Required Skills">
            <div className="space-y-3">
              {missingSoftSkills.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card-dark p-4 rounded-lg border-l-4 border-blue-500/50 hover:border-blue-400 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{item.skill}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.importance === 'High'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {item.importance} Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{item.resources} available</p>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Improvement Areas */}
          <DashboardCard title="Improvement Areas">
            <div className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 glass-card-dark rounded-lg hover:bg-white/5 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-400">{idx + 1}</span>
                  </div>
                  <p className="text-gray-300">{suggestion}</p>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Analyze Again Button */}
          <button
            onClick={() => {
              setResults(false);
              setResume('');
              setTargetRole('');
            }}
            className="w-full py-3 rounded-lg glass-card text-white font-semibold hover-lift border-2 border-orange-500/50 hover:border-orange-400 text-center transition-all"
          >
            New Analysis
          </button>
        </>
      )}
    </div>
  );
}
