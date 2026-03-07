'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Code2, 
  Stethoscope, 
  Palette, 
  Briefcase, 
  Building2, 
  Microscope, 
  Lightbulb, 
  Scale, 
  Pencil, 
  Wrench, 
  Loader2,
  TrendingUp,
  Target
} from 'lucide-react';

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
    const storedUser = localStorage.getItem('activeUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.id) setUserId(parsed.id);
    } else {
      router.push('/signup');
    }
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

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      try {
        if (!userId) return router.push('/signup');
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
        if (data.success) {
          localStorage.setItem("activeUser", JSON.stringify(data.data));
          router.push("/recommendations");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-12 py-12 fade-in">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15_px_rgba(198,255,0,0.2)]">
                <TrendingUp size={24} className="text-black" />
              </div>
              <span className="text-3xl font-black tracking-tighter">CareerVibe</span>
            </Link>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-white">Let's Get Started</h1>
              <p className="text-gray-500 font-medium">Define your base profile for AI optimization.</p>
            </div>
        </div>

        {/* HUD Navigation */}
        <div className="flex justify-center gap-4">
           {[1, 2, 3, 4, 5].map(step => (
             <div key={step} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step <= currentStep ? 'bg-primary' : 'bg-white/5'}`} />
           ))}
        </div>

        {/* Interface Cells */}
        <div className="vibe-card p-10 min-h-[400px] flex flex-col items-center justify-center">
          {currentStep === 1 && (
            <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-black uppercase tracking-widest text-center text-gray-400">Phase 01: Industry Vibe</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {careerDomains.map(d => (
                  <button
                    key={d.name}
                    onClick={() => setFormData({...formData, careerDomain: d.name})}
                    className={`p-6 rounded-2xl flex flex-col items-center gap-4 transition-all border-2 ${
                      formData.careerDomain === d.name ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10'
                    }`}
                  >
                    <d.icon size={28} />
                    <span className="text-xs font-black uppercase text-center leading-tight">{d.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-black uppercase tracking-widest text-center text-gray-400">Phase 02: Intel Level</h2>
              <div className="grid gap-3">
                {educationOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFormData({...formData, education: opt})}
                    className={`w-full p-6 py-8 rounded-2xl text-center font-black text-xl transition-all border-2 ${
                      formData.education === opt ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 bg-white/5 text-gray-500'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4">
               <h2 className="text-xl font-black uppercase tracking-widest text-center text-gray-400">Phase 03: Skills Upload</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {skillOptions.map(s => (
                    <button
                      key={s}
                      onClick={() => setFormData({...formData, skills: formData.skills.includes(s) ? formData.skills.filter(x => x!==s) : [...formData.skills, s]})}
                      className={`p-5 rounded-xl font-bold text-sm transition-all border-2 ${
                        formData.skills.includes(s) ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
               </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4">
               <h2 className="text-xl font-black uppercase tracking-widest text-center text-gray-400">Phase 04: Focus Targets</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {interestOptions.map(i => (
                    <button
                      key={i}
                      onClick={() => setFormData({...formData, interests: formData.interests.includes(i) ? formData.interests.filter(x => x!==i) : [...formData.interests, i]})}
                      className={`p-5 rounded-xl font-bold text-sm transition-all border-2 ${
                        formData.interests.includes(i) ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 bg-white/5 text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
               </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-10 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-black uppercase tracking-widest text-center text-gray-400">Phase 05: Experience Rank</h2>
              <div className="grid gap-4">
                {experienceOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFormData({...formData, experience: opt})}
                    className={`w-full p-8 rounded-2xl font-black text-2xl transition-all border-2 ${
                      formData.experience === opt ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 bg-white/5 text-gray-500'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between gap-6">
           <button
             onClick={() => setCurrentStep(prev => prev - 1)}
             disabled={currentStep === 1 || isLoading}
             className="px-8 py-4 text-gray-600 font-black hover:text-white transition-all uppercase tracking-[0.2em] disabled:opacity-0"
           >
             <ChevronLeft size={24} className="inline mr-2" />
             Back
           </button>

           <button
             onClick={handleNext}
             disabled={isLoading}
             className="neon-button px-12 py-5 text-xl"
           >
             {isLoading ? <Loader2 className="animate-spin" /> : currentStep === 5 ? 'INITIALIZE PATH' : 'NEXT PHASE'}
             {!isLoading && <ChevronRight size={24} className="ml-2" />}
           </button>
        </div>
      </div>
    </div>
  );
}
