'use client';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import CareerDomainCard from '@/components/CareerDomainCard';
import { Zap, BookOpen, Brain, Bot, Code2, Stethoscope, Palette, Briefcase, Building2, Microscope, Lightbulb, Scale, Pencil, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: 'AI Career Recommendation',
      description:
        'Get personalized career suggestions based on your skills, interests, and market trends. Our AI analyzes thousands of career paths to find your perfect match.',
    },
    {
      icon: BookOpen,
      title: 'Personalised Learning Roadmaps',
      description:
        'Receive adaptive learning paths tailored to your pace and style. Each roadmap is customized with resources, projects, and milestones for your journey.',
    },
    {
      icon: Brain,
      title: 'Skill Gap Analyzer',
      description:
        'Identify the skills you need to succeed in your target role. Get actionable insights and recommendations to bridge your skill gaps efficiently.',
    },
    {
      icon: Bot,
      title: 'AI Mentor Chatbot',
      description:
        'Chat with our AI mentor anytime for guidance, explanations, and support. Get instant answers to your career and learning questions.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Create Your Profile',
      description: 'Tell us about your education, skills, and career goals.',
    },
    {
      number: '2',
      title: 'Get Personalized Roadmap',
      description: 'Receive a customized learning path designed for your goals.',
    },
    {
      number: '3',
      title: 'Learn & Progress',
      description: 'Follow your roadmap, track progress, and engage with your AI mentor.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-purple-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
              <br />
              <span className="text-white">for Your Success</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to discover your ideal career and prepare for success.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Explore Career Domains Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-blue-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">Explore </span>
              <span className="gradient-text">Career Domains</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose from diverse career fields and get personalized guidance for your chosen path.
            </p>
          </div>

          {/* Domain Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <CareerDomainCard title="Technology & IT" icon={Code2} />
            <CareerDomainCard title="Medical & Healthcare" icon={Stethoscope} />
            <CareerDomainCard title="Arts & Creative" icon={Palette} />
            <CareerDomainCard title="Commerce & Finance" icon={Briefcase} />
            <CareerDomainCard title="Government & Civil Services" icon={Building2} />
            <CareerDomainCard title="Research & Academia" icon={Microscope} />
            <CareerDomainCard title="Entrepreneurship" icon={Lightbulb} />
            <CareerDomainCard title="Law & Judiciary" icon={Scale} />
            <CareerDomainCard title="Design & Media" icon={Pencil} />
            <CareerDomainCard title="Skilled Trades" icon={Wrench} />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">How It </span>
              <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Get started in just 3 simple steps.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Line connector */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 -z-10" />
                )}

                {/* Step card */}
                <div className="glass-card p-8 text-center hover-lift">
                  {/* Step number */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">
                    {step.number}
                  </div>

                  {/* Step title and description */}
                  <h3 className="text-2xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold">
            <span className="gradient-text">Ready to Transform</span>
            <br />
            <span className="text-white">Your Career?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of students who are already on their journey to success with our AI-powered career advisor.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 rounded-lg gradient-button text-white font-semibold hover-lift"
          >
            Start Free Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="gradient-text font-bold">CareerAI</span>
              </Link>
              <p className="text-gray-400 text-sm">Your AI-powered career guidance platform.</p>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white transition">About</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 CareerAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
