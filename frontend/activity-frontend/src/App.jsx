import { useState } from "react";

export default function App() {
  // Example state for testing (later will connect to backend)
  const [activities] = useState([
    { title: "Dance workout", description: "Dance to upbeat songs", duration: 24 },
    { title: "Cook a healthy meal", description: "Prepare a nutritious dish", duration: 24 },
    { title: "Go hiking", description: "Enjoy fresh air and scenery", duration: 60 }
  ]);

  return (
    <div className="bg-lightGray min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-content mx-auto px-page py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-darkGray">Activity Generator</h1>
          <nav className="space-x-6">
            <a href="#recommend" className="text-mutedGray hover:text-primary transition">
              Recommend
            </a>
            <a href="#history" className="text-mutedGray hover:text-primary transition">
              History
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 text-center">
        <h2 className="text-3xl font-semibold text-darkGray">Find the Perfect Activity</h2>
        <p className="text-mutedGray mt-2">Tailored to your preferences and goals</p>
        <button className="mt-6 bg-primary text-white rounded-button px-6 py-3 hover:bg-primaryDark transition-transform hover:scale-105">
          Get Started
        </button>
      </section>

      {/* Main Content */}
      <main className="max-w-content mx-auto px-page space-y-sectionGap">
        {/* Recommendation Section */}
        <section
          id="recommend"
          className="bg-white border border-borderGray rounded-card p-card shadow-sm"
        >
          <h3 className="text-xl font-semibold text-darkGray mb-4">Recommendations</h3>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((act, index) => (
              <div
                key={index}
                className="bg-white border border-borderGray rounded-card p-card shadow-md hover:shadow-lg transition-transform hover:scale-105"
              >
                <h4 className="text-lg font-semibold text-darkGray">{act.title}</h4>
                <p className="text-mutedGray">{act.description}</p>
                <p className="text-sm text-darkGray mt-2">Duration: {act.duration} min</p>
                <button className="mt-3 bg-primary text-white rounded-button px-4 py-2 hover:bg-primaryDark transition">
                  Select
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* History Section */}
        <section
          id="history"
          className="bg-white border border-borderGray rounded-card p-card shadow-sm"
        >
          <h3 className="text-xl font-semibold text-darkGray mb-4">History</h3>
          <div className="space-y-4">
            <div className="border border-borderGray rounded-card p-card">
              <h4 className="text-lg font-semibold text-darkGray">Session #1</h4>
              <ul className="list-disc list-inside text-mutedGray">
                <li>Dance workout</li>
                <li>Cook a healthy meal</li>
                <li>Go hiking</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-mutedGray">
        © 2026 Activity Generator
      </footer>
    </div>
  );
}
