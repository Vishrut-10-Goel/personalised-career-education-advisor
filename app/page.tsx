'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Target, BookOpen, Activity } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-black" />
            </div>
            <span className="text-2xl font-black tracking-tighter">CareerVibe</span>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Sign In</Link>
            <Link href="/onboarding" className="neon-button text-sm px-6 py-2.5">
              Start Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-48 pb-32 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} />
            AI-Driven Career Architect
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
            HUSTLE SMARTER.<br />
            <span className="text-primary">LEVEL UP</span> FASTER.
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Personalized career roadmaps built by high-power AI. Map your shift, master new skills, and land your dream role with precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/onboarding" className="neon-button text-lg px-10 py-5">
              Build My Roadmap
              <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features (Real ones only) */}
      <section className="py-32 px-6 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: Target, 
              title: 'Career Discovery', 
              desc: 'Our AI analyzes your unique skills and education to match you with high-growth industries.' 
            },
            { 
              icon: BookOpen, 
              title: 'Dynamic Roadmaps', 
              desc: 'Custom step-by-step learning paths that adapt to your experience level and goals.' 
            },
            { 
              icon: Activity, 
              title: 'Progress Tracking', 
              desc: 'Keep track of your milestones and see exactly how close you are to becoming career-ready.' 
            },
          ].map((f, i) => (
            <div key={i} className="vibe-card p-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                <f.icon size={28} />
              </div>
              <h3 className="text-2xl font-black">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-700 font-bold text-xs uppercase tracking-[0.3em]">
        © {new Date().getFullYear()} CareerVibe — Next Gen Career Intel
      </footer>
    </div>
  );
}
