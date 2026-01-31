export function Footer() {
  return (
    <footer className="py-12 px-6 bg-gradient-to-br from-[var(--dark-gray)] to-[#0f172a] border-t border-[var(--border-gray)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-[18px]">AURA</p>
              <p className="text-white/60 text-[13px]">Activity Generator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/80 hover:text-white text-[14px] transition-colors">Privacy</a>
            <a href="#" className="text-white/80 hover:text-white text-[14px] transition-colors">Terms</a>
            <a href="#" className="text-white/80 hover:text-white text-[14px] transition-colors">Contact</a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-white/60 text-[14px]">
            © 2026 AURA. Crafted with care for your wellbeing.
          </p>
        </div>
      </div>
    </footer>
  );
}