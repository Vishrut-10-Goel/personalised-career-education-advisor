'use client';

import RoadmapCard from '@/components/RoadmapCard';
import DashboardCard from '@/components/DashboardCard';
import { useState } from 'react';

export default function RoadmapPage() {
  const [selectedDomain, setSelectedDomain] = useState('Technology');

  const domains = {
    Technology: {
      title: 'Technology & IT Career Path',
      sections: {
        'Foundation': [
          { title: 'Computer Science Basics', description: 'Fundamental concepts of programming and data structures', duration: '4 weeks' },
          { title: 'Programming Languages', description: 'Learn industry-standard languages', duration: '6 weeks' },
          { title: 'Version Control', description: 'Git and collaboration workflows', duration: '1 week' },
        ],
        'Specialization': [
          { title: 'Web Development', description: 'Frontend and backend web technologies', duration: '8 weeks' },
          { title: 'Databases', description: 'SQL and NoSQL database design', duration: '4 weeks' },
          { title: 'System Architecture', description: 'Design scalable systems', duration: '4 weeks' },
        ],
        'Advanced': [
          { title: 'Cloud Platforms', description: 'AWS, Azure, or GCP mastery', duration: '6 weeks' },
          { title: 'DevOps & CI/CD', description: 'Deployment and automation', duration: '4 weeks' },
          { title: 'Interview Preparation', description: 'Technical interviews and assessments', duration: '3 weeks' },
        ],
      },
    },
    Medical: {
      title: 'Medical & Healthcare Career Path',
      sections: {
        'Foundation': [
          { title: 'Biology & Life Sciences', description: 'Foundation in biological sciences', duration: '12 weeks' },
          { title: 'Chemistry', description: 'Organic and inorganic chemistry', duration: '8 weeks' },
          { title: 'Entrance Exams Prep', description: 'Medical entrance exam preparation', duration: '6 months' },
        ],
        'Specialization': [
          { title: 'Clinical Practice', description: 'Hands-on clinical experience', duration: '12 weeks' },
          { title: 'Anatomy & Physiology', description: 'Deep dive into human body', duration: '8 weeks' },
          { title: 'Medical Terminology', description: 'Professional medical language', duration: '4 weeks' },
        ],
        'Advanced': [
          { title: 'Specialization Training', description: 'Choose your medical specialty', duration: '3 years' },
          { title: 'Licensing & Certification', description: 'Professional certifications', duration: '12 weeks' },
          { title: 'Continuous Education', description: 'Stay updated with latest advances', duration: 'Ongoing' },
        ],
      },
    },
    Creative: {
      title: 'Arts & Creative Career Path',
      sections: {
        'Foundation': [
          { title: 'Art & Design Fundamentals', description: 'Color theory, composition, visual principles', duration: '6 weeks' },
          { title: 'Digital Tools Mastery', description: 'Adobe Creative Suite and industry tools', duration: '8 weeks' },
          { title: 'Portfolio Building', description: 'Create your first portfolio pieces', duration: '4 weeks' },
        ],
        'Specialization': [
          { title: 'Your Chosen Medium', description: 'Focus on illustration, animation, or graphic design', duration: '8 weeks' },
          { title: 'Professional Techniques', description: 'Advanced skills in your specialty', duration: '6 weeks' },
          { title: 'Client Communication', description: 'Working with clients and stakeholders', duration: '2 weeks' },
        ],
        'Advanced': [
          { title: 'Advanced Projects', description: 'Complex client projects', duration: '8 weeks' },
          { title: 'Freelancing Skills', description: 'Build your freelance business', duration: '4 weeks' },
          { title: 'Industry Networking', description: 'Connect with industry professionals', duration: 'Ongoing' },
        ],
      },
    },
  };

  const currentDomain = domains[selectedDomain as keyof typeof domains] || domains.Technology;

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="glass-card p-8 rounded-2xl border-l-4 border-blue-500">
        <h1 className="text-3xl font-bold text-white mb-2">Your Personalised Learning Roadmap</h1>
        <p className="text-gray-400">Follow this structured path to your career goal. Select your domain and adjust the pace as needed.</p>      
      </div>

      {/* Domain Selector */}
      <DashboardCard title="Select Your Career Domain">
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="w-full p-3 rounded-lg glass-card-dark bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="Technology">Technology & IT</option>
          <option value="Medical">Medical & Healthcare</option>
          <option value="Creative">Arts & Creative</option>
        </select>
      </DashboardCard>

      {/* Progress Bar */}
      <DashboardCard>
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-400">Overall Progress</span>
            <span className="text-sm font-semibold text-white">50%</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: '50%' }} />
          </div>
        </div>
      </DashboardCard>

      {/* Dynamic Sections */}
      {Object.entries(currentDomain.sections).map((entry, sectionIdx) => {
        const [sectionName, topics] = entry;
        const colors = ['green', 'blue', 'purple'];
        const color = colors[sectionIdx];
        const statusTexts = ['Completed', 'In Progress', 'Upcoming'];

        return (
          <div key={sectionName}>
            <div className="mb-4 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full bg-${color}-500/20 flex items-center justify-center`}>
                <span className={`text-xs font-bold text-${color}-400`}>{sectionIdx + 1}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{sectionName}</h2>
              <span className={`text-xs px-2 py-1 rounded-full bg-${color}-500/20 text-${color}-400 font-medium`}>
                {statusTexts[sectionIdx]}
              </span>
            </div>
            <div className="space-y-4">
              {topics.map((topic, idx) => (
                <RoadmapCard
                  key={idx}
                  title={topic.title}
                  description={topic.description}
                  duration={topic.duration}
                  index={idx + 1}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
