import { useState } from "react";
import { Toaster } from "sonner";
import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { Recommendations } from "@/app/components/Recommendations";
import { History, Session } from "@/app/components/History";
import { Footer } from "@/app/components/Footer";
import { Activity } from "@/app/components/ActivityCard";

export default function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Activity[]>([]);

  const handleActivitySelect = (activity: Activity) => {
    // Add activity to current session with a unique instance ID
    const activityWithInstanceId = {
      ...activity,
      instanceId: `${activity.id}-${Date.now()}-${Math.random()}`,
    };

    const updatedSession = [...currentSession, activityWithInstanceId];
    setCurrentSession(updatedSession);

    // Create a new session entry
    const newSession: Session = {
      id: Date.now().toString(),
      title: `Session ${sessions.length + 1}`,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      activities: updatedSession,
    };

    // Update or add session
    if (sessions.length > 0 && updatedSession.length > 0) {
      // Update the most recent session
      const updatedSessions = [...sessions];
      updatedSessions[0] = newSession;
      setSessions(updatedSessions);
    } else {
      // Add new session to the beginning
      setSessions([newSession, ...sessions]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        {/* Recommendations component connected to backend */}
        <Recommendations onActivitySelect={handleActivitySelect} />
        {/* History of sessions */}
        <History sessions={sessions} />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
