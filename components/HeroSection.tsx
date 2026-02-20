'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center space-y-8 fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-dark border border-purple-500/50">
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-sm text-purple-300">AI-Powered Career Guidance</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          <span className="gradient-text">AI-Powered Personalised</span>
          <br />
          <span className="text-white">Career Education Platform</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Explore careers across technology, medical, arts, commerce, government, and more. Get AI-driven roadmaps tailored to your goals.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-lg gradient-button text-white font-semibold hover-lift flex items-center gap-2"
          >
            Get Started
            <ArrowRight size={20} />
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 rounded-lg glass-card text-white font-semibold hover-lift border-2 border-purple-500/50 hover:border-purple-400"
          >
            Explore Features
          </Link>
        </div>


      </div>
    </section>
  );
}
