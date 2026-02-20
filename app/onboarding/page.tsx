'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Check, Code2, Stethoscope, Palette, Briefcase, Building2, Microscope, Lightbulb, Scale, Pencil, Wrench } from 'lucide-react';
import CareerDomainCard from '@/components/CareerDomainCard';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    careerDomain: '',
    education: '',
    skills: [] as string[],
    interests: [] as string[],
    experience: '',
  });

  const careerDomains = [
    { name: 'Technology & IT', icon: Code2 },
    { name: 'Medical & Healthcare', icon: Stethoscope },
    { name: 'Arts & Creative', icon: Palette },
    { name: 'Commerce & Finance', icon: Briefcase },
    { name: 'Government & Civil Services', icon: Building2 },
    { name: 'Research & Academia', icon: Microscope },
    { name: 'Entrepreneurship', icon: Lightbulb },
    { name: 'Law & Judiciary', icon: Scale },
    { name: 'Design & Media', icon: Pencil },
    { name: 'Skilled Trades', icon: Wrench },
  ];

  const skillOptions = ['Communication', 'Project Management', 'Analysis', 'Problem Solving', 'Leadership', 'Teamwork', 'Research', 'Creativity'];
  const interestOptions = ['Learning', 'Innovation', 'Helping Others', 'Entrepreneurship', 'Data Analysis', 'Creative Work', 'Teaching', 'Solving Problems'];
  const educationOptions = ['High School', 'Bachelor\'s', 'Master\'s', 'PhD'];
  const experienceOptions = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      window.location.href = '/dashboard';
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.careerDomain !== '';
      case 2:
        return formData.education !== '';
      case 3:
        return formData.skills.length > 0;
      case 4:
        return formData.interests.length > 0;
      case 5:
        return formData.experience !== '';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="gradient-text font-bold text-xl">CareerAI</span>
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Let's Get Started</h1>
          <p className="text-gray-400">Tell us about yourself so we can personalize your experience</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step <= currentStep
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                    : 'glass-card text-gray-400'
                }`}
              >
                {step < currentStep ? <Check size={20} /> : step}
              </div>
            ))}
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 rounded-2xl min-h-80">
          {/* Step 1: Career Domain */}
          {currentStep === 1 && (
            <div className="space-y-6 fade-in">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">Select your career domain</h2>
                <p className="text-gray-400">Choose the field that interests you most</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {careerDomains.map((domain) => (
                  <CareerDomainCard
                    key={domain.name}
                    title={domain.name}
                    icon={domain.icon}
                    isSelected={formData.careerDomain === domain.name}
                    onClick={() => setFormData({ ...formData, careerDomain: domain.name })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Education */}
          {currentStep === 2 && (
            <div className="space-y-6 fade-in">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">What's your education level?</h2>
                <p className="text-gray-400">This helps us customize your learning path</p>
              </div>
              <div className="space-y-3">
                {educationOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData({ ...formData, education: option })}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      formData.education === option
                        ? 'glass-card-dark border-l-4 border-purple-500 bg-purple-500/10'
                        : 'glass-card-dark hover:border-l-4 hover:border-purple-500/50'
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {currentStep === 3 && (
            <div className="space-y-6 fade-in">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">What skills do you have?</h2>
                <p className="text-gray-400">Select all that apply</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`p-3 rounded-lg transition-all ${
                      formData.skills.includes(skill)
                        ? 'glass-card-dark bg-purple-500/20 border-l-2 border-purple-500 text-purple-300'
                        : 'glass-card-dark hover:border-l-2 hover:border-purple-500/50'
                    }`}
                  >
                    <span className="text-sm font-medium">{skill}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Interests */}
          {currentStep === 4 && (
            <div className="space-y-6 fade-in">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">What are your career interests?</h2>
                <p className="text-gray-400">Choose areas that interest you</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-lg transition-all ${
                      formData.interests.includes(interest)
                        ? 'glass-card-dark bg-blue-500/20 border-l-2 border-blue-500 text-blue-300'
                        : 'glass-card-dark hover:border-l-2 hover:border-blue-500/50'
                    }`}
                  >
                    <span className="text-sm font-medium">{interest}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Experience */}
          {currentStep === 5 && (
            <div className="space-y-6 fade-in">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-2">What's your experience level?</h2>
                <p className="text-gray-400">We'll adjust the difficulty accordingly</p>
              </div>
              <div className="space-y-3">
                {experienceOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData({ ...formData, experience: option })}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      formData.experience === option
                        ? 'glass-card-dark border-l-4 border-blue-500 bg-blue-500/10'
                        : 'glass-card-dark hover:border-l-4 hover:border-blue-500/50'
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-lg glass-card text-white font-medium hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg gradient-button text-white font-medium hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {currentStep === 5 ? 'Complete' : 'Next'}
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Step Info */}
        <p className="text-center text-gray-500 text-sm mt-4">
          Step {currentStep} of 5
        </p>
      </div>
    </div>
  );
}
