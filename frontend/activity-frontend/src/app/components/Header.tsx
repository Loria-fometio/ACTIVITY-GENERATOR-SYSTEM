import { Brain } from 'lucide-react';

export function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-[var(--border-gray)]">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => scrollToSection('hero')}
        >
          <div className="p-2 bg-gradient-to-br from-[var(--primary-blue)] to-[var(--dark-blue)] rounded-lg group-hover:scale-110 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-[24px] font-bold text-[var(--dark-gray)] tracking-tight">
            AURA
          </h1>
        </div>
        <nav className="flex gap-8">
          <button
            onClick={() => scrollToSection('recommendations')}
            className="text-[15px] font-medium text-[var(--muted-gray)] hover:text-[var(--primary-blue)] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary-blue)] hover:after:w-full after:transition-all"
          >
            Recommend
          </button>
          <button
            onClick={() => scrollToSection('history')}
            className="text-[15px] font-medium text-[var(--muted-gray)] hover:text-[var(--primary-blue)] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[var(--primary-blue)] hover:after:w-full after:transition-all"
          >
            History
          </button>
        </nav>
      </div>
    </header>
  );
}