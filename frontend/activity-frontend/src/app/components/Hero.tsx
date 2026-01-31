export function Hero() {
  const scrollToRecommendations = () => {
    const element = document.getElementById('recommendations');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero"
      className="relative bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1e40af] py-40 px-6 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-[1200px] mx-auto text-center relative z-10">
        <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
          <p className="text-white/90 text-[14px] font-medium">Powered by AI</p>
        </div>
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          Find the Perfect Activity
        </h1>
        <p className="text-[18px] text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
          Discover personalized activities tailored to your preferences, goals, and available time. Let AURA guide you to your next adventure.
        </p>
        <button
          onClick={scrollToRecommendations}
          className="group bg-white text-[var(--primary-blue)] hover:bg-white/95 text-[16px] font-semibold px-10 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          <span className="flex items-center gap-2">
            Get Started
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
}