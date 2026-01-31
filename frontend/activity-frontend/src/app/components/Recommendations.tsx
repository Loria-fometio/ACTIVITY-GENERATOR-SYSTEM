import { useState } from 'react';
import { ActivityCard, Activity } from '@/app/components/ActivityCard';

interface RecommendationsProps {
  onActivitySelect: (activity: Activity) => void;
}

// Mock data for activities
const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Morning Yoga',
    description: 'Start your day with energizing yoga poses and breathing exercises',
    duration: '30 minutes'
  },
  {
    id: '2',
    title: 'Nature Walk',
    description: 'Explore local trails and enjoy the outdoors',
    duration: '45 minutes'
  },
  {
    id: '3',
    title: 'Reading Session',
    description: 'Dive into a good book and expand your knowledge',
    duration: '60 minutes'
  },
  {
    id: '4',
    title: 'Meditation Practice',
    description: 'Calm your mind with guided meditation',
    duration: '20 minutes'
  },
  {
    id: '5',
    title: 'Creative Writing',
    description: 'Express yourself through journaling or storytelling',
    duration: '40 minutes'
  },
  {
    id: '6',
    title: 'Cooking Class',
    description: 'Learn a new recipe and improve your culinary skills',
    duration: '90 minutes'
  }
];

export function Recommendations({ onActivitySelect }: RecommendationsProps) {
  const [preferences, setPreferences] = useState('');
  const [goal, setGoal] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');
  const [maxActivities, setMaxActivities] = useState('6');
  const [activities, setActivities] = useState<Activity[]>(mockActivities);

  const handleGenerateRecommendations = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = {
    preferences: preferences.split(',').map(p => p.trim()), // multiple preferences
    goal,
    timeAvailable: parseInt(timeAvailable) || 0,
    maxActivities: parseInt(maxActivities) || 6,
  };

  try {
    const res = await fetch('http://localhost:5000/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error('Failed to fetch recommendations');

    const data = await res.json();
    setActivities(data);
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    setActivities([]);
  }
};


  // Calculate stats for displayed activities
  const totalActivitiesShown = activities.length;
  const averageDuration = activities.length > 0 
    ? Math.round(activities.reduce((sum, act) => sum + parseInt(act.duration), 0) / activities.length)
    : 0;
  const totalTimeNeeded = activities.reduce((sum, act) => sum + parseInt(act.duration), 0);

  return (
    <section id="recommendations" className="py-24 px-6 bg-gradient-to-b from-white to-[var(--light-gray)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-5 py-2 bg-gradient-to-r from-[var(--primary-blue)]/10 to-[var(--dark-blue)]/10 rounded-full">
            <p className="text-[var(--primary-blue)] text-[14px] font-bold uppercase tracking-wide">
              AI-Powered Suggestions
            </p>
          </div>
          <h2 className="text-[40px] font-bold text-[var(--dark-gray)] mb-4">
            Personalized Recommendations
          </h2>
          <p className="text-[17px] text-[var(--muted-gray)] max-w-2xl mx-auto leading-relaxed">
            Share your preferences and let our intelligent system curate the perfect activities tailored just for you
          </p>
        </div>
        
        {/* Preference Form Card */}
        <div className="bg-white border-2 border-[var(--border-gray)] rounded-3xl shadow-2xl mb-16 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[var(--primary-blue)] to-[var(--dark-blue)] px-8 py-6">
            <h3 className="text-[24px] font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              Customize Your Experience
            </h3>
            <p className="text-white/90 text-[15px]">
              Fine-tune your preferences to get the most relevant activity suggestions
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleGenerateRecommendations} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Preferences Input */}
              <div className="group">
                <label htmlFor="preferences" className="flex items-center gap-2 text-[15px] font-bold text-[var(--dark-gray)] mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-blue)]/10 to-[var(--dark-blue)]/10 rounded-lg flex items-center justify-center group-hover:from-[var(--primary-blue)]/20 group-hover:to-[var(--dark-blue)]/20 transition-colors">
                    <svg className="w-4 h-4 text-[var(--primary-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  Your Preferences
                </label>
                <input
                  id="preferences"
                  type="text"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g., outdoors, creative, fitness"
                  className="w-full px-5 py-4 text-[15px] border-2 border-[var(--border-gray)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-[var(--primary-blue)] transition-all bg-[var(--light-gray)]/30 hover:bg-white"
                />
                <p className="mt-2 text-[13px] text-[var(--muted-gray)]">
                  What activities do you enjoy most?
                </p>
              </div>
              
              {/* Goal Input */}
              <div className="group">
                <label htmlFor="goal" className="flex items-center gap-2 text-[15px] font-bold text-[var(--dark-gray)] mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#10b981]/10 to-[#059669]/10 rounded-lg flex items-center justify-center group-hover:from-[#10b981]/20 group-hover:to-[#059669]/20 transition-colors">
                    <svg className="w-4 h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  Your Goal
                </label>
                <input
                  id="goal"
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., relaxation, learning, exercise"
                  className="w-full px-5 py-4 text-[15px] border-2 border-[var(--border-gray)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981] transition-all bg-[var(--light-gray)]/30 hover:bg-white"
                />
                <p className="mt-2 text-[13px] text-[var(--muted-gray)]">
                  What do you want to achieve?
                </p>
              </div>
              
              {/* Time Available Input */}
              <div className="group">
                <label htmlFor="timeAvailable" className="flex items-center gap-2 text-[15px] font-bold text-[var(--dark-gray)] mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#f59e0b]/10 to-[#d97706]/10 rounded-lg flex items-center justify-center group-hover:from-[#f59e0b]/20 group-hover:to-[#d97706]/20 transition-colors">
                    <svg className="w-4 h-4 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Time Available
                </label>
                <div className="relative">
                  <input
                    id="timeAvailable"
                    type="number"
                    value={timeAvailable}
                    onChange={(e) => setTimeAvailable(e.target.value)}
                    placeholder="60"
                    className="w-full pl-5 pr-20 py-4 text-[15px] border-2 border-[var(--border-gray)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f59e0b] focus:border-[#f59e0b] transition-all bg-[var(--light-gray)]/30 hover:bg-white"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[var(--muted-gray)]">
                    minutes
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-[var(--muted-gray)]">
                  How much time do you have?
                </p>
              </div>
              
              {/* Max Activities Input */}
              <div className="group">
                <label htmlFor="maxActivities" className="flex items-center gap-2 text-[15px] font-bold text-[var(--dark-gray)] mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8b5cf6]/10 to-[#7c3aed]/10 rounded-lg flex items-center justify-center group-hover:from-[#8b5cf6]/20 group-hover:to-[#7c3aed]/20 transition-colors">
                    <svg className="w-4 h-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  Max Activities
                </label>
                <input
                  id="maxActivities"
                  type="number"
                  value={maxActivities}
                  onChange={(e) => setMaxActivities(e.target.value)}
                  placeholder="6"
                  min="1"
                  max="10"
                  className="w-full px-5 py-4 text-[15px] border-2 border-[var(--border-gray)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all bg-[var(--light-gray)]/30 hover:bg-white"
                />
                <p className="mt-2 text-[13px] text-[var(--muted-gray)]">
                  Maximum number of suggestions
                </p>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[var(--primary-blue)] to-[var(--dark-blue)] hover:from-[var(--dark-blue)] hover:to-[var(--primary-blue)] text-white text-[17px] font-bold px-8 py-5 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Personalized Recommendations
              </span>
            </button>
          </form>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--border-gray)] overflow-hidden group hover:shadow-xl hover:border-[var(--primary-blue)]/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--primary-blue)]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary-blue)] to-[var(--dark-blue)] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[var(--muted-gray)] uppercase tracking-wide">
                    Available Activities
                  </p>
                  <p className="text-[36px] font-bold text-[var(--dark-gray)] leading-none">
                    {totalActivitiesShown}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--border-gray)] overflow-hidden group hover:shadow-xl hover:border-[#f59e0b]/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f59e0b]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[var(--muted-gray)] uppercase tracking-wide">
                    Average Duration
                  </p>
                  <p className="text-[36px] font-bold text-[var(--dark-gray)] leading-none">
                    {averageDuration}<span className="text-[18px] ml-1">min</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-6 shadow-lg border-2 border-[var(--border-gray)] overflow-hidden group hover:shadow-xl hover:border-[#10b981]/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#10b981]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[var(--muted-gray)] uppercase tracking-wide">
                    Total Time
                  </p>
                  <p className="text-[36px] font-bold text-[var(--dark-gray)] leading-none">
                    {totalTimeNeeded}<span className="text-[18px] ml-1">min</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Cards Section */}
        <div className="mb-8">
          <h3 className="text-[28px] font-bold text-[var(--dark-gray)] mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-blue)]/10 to-[var(--dark-blue)]/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--primary-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            Suggested Activities
          </h3>
          <p className="text-[15px] text-[var(--muted-gray)] mb-8">
            Explore curated activities that match your preferences and goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onSelect={onActivitySelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}