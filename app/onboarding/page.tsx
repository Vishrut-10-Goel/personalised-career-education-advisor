'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Check, Code2, Stethoscope, Palette, Briefcase, Building2, Microscope, Lightbulb, Scale, Pencil, Wrench, Loader2 } from 'lucide-react';
import CareerDomainCard from '@/components/CareerDomainCard';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    careerDomain: '',
    education: '',
    skills: [] as string[],
    interests: [] as string[],
    experience: '',
  });

  useEffect(() => {
    const checkSession = async () => {
      // Check localstorage for the flow we just came from (non-auth bypass)
      const storedUser = localStorage.getItem('activeUser');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.id) {
            setUserId(parsed.id);
            return;
          }
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }

      // If no stored user, redirect to signup
      router.push('/signup');
    };
    checkSession();
  }, [router]);

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

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      try {
        if (!userId) {
          router.push('/signup');
          return;
        }

        const res = await fetch(`/api/user?id=${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain: formData.careerDomain,
            education_level: formData.education,
            skills: formData.skills,
            interests: formData.interests,
            target_career: null,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Failed to update profile. Please try again.');
        } else {
          if (data.data) {
            localStorage.setItem("activeUser", JSON.stringify(data.data));
          }
          router.push("/recommendations");
        }
      } catch (error: any) {
        alert('Network error: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    if (!userId && !isLoading) return false;
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
    <div className="min-h-screen bg-background flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-5xl mx-auto space-y-12 fade-in">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="gradient-text font-bold text-xl">CareerAI</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Let's Get Started</h1>
          <p className="text-sm text-gray-400 mb-10 mx-auto max-w-md">Tell us about yourself so we can personalize your experience</p>
        </div>

        {/* Progress Bar (Stepper) */}
        <div className="mb-12">
          <div className="flex justify-center gap-6 mb-8">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${step <= currentStep
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-gray-800/40 text-gray-500'
                  }`}
              >
                {step < currentStep ? <Check size={20} /> : step}
              </div>
            ))}
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden max-w-md mx-auto">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-8 relative">
          {/* Step 1: Career Domain Selection */}
          {currentStep === 1 && (
            <div className="space-y-8 fade-in flex flex-col items-center">
              <h2 className="text-xl font-semibold text-white">Which domain excites you?</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {careerDomains.map((domain) => (
                  <button
                    key={domain.name}
                    onClick={() => setFormData({ ...formData, careerDomain: domain.name })}
                    className={`rounded-xl p-6 text-center flex flex-col items-center justify-center min-h-[140px] transition-all transform hover:scale-105 hover:shadow-lg border-2 ${formData.careerDomain === domain.name
                      ? "border-purple-500 bg-purple-900/30 text-white"
                      : "bg-gray-800/40 border-transparent text-gray-400 hover:bg-gray-800/70"
                      }`}
                  >
                    <domain.icon className={`mb-4 ${formData.careerDomain === domain.name ? 'text-purple-400' : 'text-gray-500'}`} size={32} />
                    <span className="text-sm leading-relaxed whitespace-normal font-medium">{domain.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Education */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto space-y-6 fade-in">
              <h2 className="text-xl font-semibold text-white text-center">Academic Foundation</h2>
              <div className="grid gap-4">
                {educationOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData({ ...formData, education: option })}
                    className={`w-full p-6 rounded-xl text-left transition-all border-2 ${formData.education === option
                      ? 'border-purple-500 bg-purple-900/30 text-white'
                      : 'bg-gray-800/40 border-transparent text-gray-400 hover:bg-gray-800/70'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{option}</span>
                      {formData.education === option && <Check className="text-purple-400" size={20} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Skills */}
          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto space-y-6 fade-in">
              <h2 className="text-xl font-semibold text-white text-center">Your Arsenal</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`p-4 rounded-xl transition-all border-2 flex items-center justify-between ${formData.skills.includes(skill)
                      ? 'border-purple-500 bg-purple-900/30 text-white'
                      : 'bg-gray-800/40 border-transparent text-gray-400 hover:bg-gray-800/70'
                      }`}
                  >
                    <span className="text-sm font-medium">{skill}</span>
                    {formData.skills.includes(skill) && <Check size={16} className="text-purple-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Interests */}
          {currentStep === 4 && (
            <div className="max-w-2xl mx-auto space-y-6 fade-in">
              <h2 className="text-xl font-semibold text-white text-center">Core Passion</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-4 rounded-xl transition-all border-2 flex items-center justify-between ${formData.interests.includes(interest)
                      ? 'border-blue-500 bg-blue-900/30 text-white'
                      : 'bg-gray-800/40 border-transparent text-gray-400 hover:bg-gray-800/70'
                      }`}
                  >
                    <span className="text-sm font-medium">{interest}</span>
                    {formData.interests.includes(interest) && <Check size={16} className="text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Experience */}
          {currentStep === 5 && (
            <div className="max-w-md mx-auto space-y-6 fade-in text-center">
              <h2 className="text-xl font-semibold text-white">Professional Maturity</h2>
              <div className="grid gap-4">
                {experienceOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData({ ...formData, experience: option })}
                    className={`w-full p-5 rounded-xl text-center transition-all border-2 ${formData.experience === option
                      ? 'border-blue-500 bg-blue-900/30 text-white shadow-lg'
                      : 'bg-gray-800/40 border-transparent text-gray-400 hover:bg-gray-800/70'
                      }`}
                  >
                    <span className="font-bold">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons Section */}
        <div className="mt-12 flex justify-between items-center max-w-2xl mx-auto w-full">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 text-gray-400 font-bold hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
            BACK
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepComplete() || isLoading}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg gradient-button text-white font-bold hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-purple-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                EVOLVING...
              </>
            ) : currentStep === 5 ? 'COMPLETE TRANSFORMATION' : 'CONTINUE'}
            {!isLoading && <ChevronRight size={20} />}
          </button>
        </div>

        {/* Step Info Pagination Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-300 ${s === currentStep ? 'bg-purple-500 w-12' : 'bg-gray-800'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
