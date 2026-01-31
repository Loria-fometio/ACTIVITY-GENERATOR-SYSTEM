import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Activity } from "@/app/components/ActivityCard";

export interface Session {
  id: string;
  title: string;
  date: string;
  activities: Activity[];
}

interface HistoryProps {
  sessions: Session[];
}

export function History({ sessions }: HistoryProps) {
  // Calculate statistics
  const totalActivities = sessions.reduce(
    (sum, session) => sum + session.activities.length,
    0
  );
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((sum, session) => {
    return (
      sum +
      session.activities.reduce((actSum, activity) => {
        const minutes = parseInt(activity.duration) || 0;
        return actSum + minutes;
      }, 0)
    );
  }, 0);

  if (sessions.length === 0) {
    return (
      <section id="history" className="py-24 px-6 bg-gradient-to-b from-[var(--light-gray)] to-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[40px] font-bold text-[var(--dark-gray)] mb-4">
              Activity History
            </h2>
            <p className="text-[17px] text-[var(--muted-gray)] max-w-2xl mx-auto">
              Track your journey and review all your completed activity sessions
            </p>
          </div>
          <div className="bg-white border-2 border-dashed border-[var(--border-gray)] rounded-2xl p-20 text-center shadow-sm">
            <div className="w-24 h-24 bg-gradient-to-br from-[var(--primary-blue)]/10 to-[var(--dark-blue)]/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-[var(--primary-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-[24px] font-bold text-[var(--dark-gray)] mb-3">
              No Activity History Yet
            </h3>
            <p className="text-[16px] text-[var(--muted-gray)] max-w-lg mx-auto leading-relaxed">
              Your activity journey starts here. Select activities from the recommendations above to begin tracking your progress and build your personalized history.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="history" className="py-24 px-6 bg-gradient-to-b from-[var(--light-gray)] to-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[40px] font-bold text-[var(--dark-gray)] mb-4">
            Activity History
          </h2>
          <p className="text-[17px] text-[var(--muted-gray)] max-w-2xl mx-auto">
            Your complete journey of selected activities and sessions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-[var(--border-gray)] overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--primary-blue)]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary-blue)] to-[var(--dark-blue)] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--muted-gray)] uppercase tracking-wide">
                    Total Sessions
                  </p>
                  <p className="text-[36px] font-bold text-[var(--dark-gray)] leading-none">
                    {totalSessions}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-[var(--border-gray)] overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#10b981]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--muted-gray)] uppercase tracking-wide">
                    Total Activities
                  </p>
                  <p className="text-[36px] font-bold text-[var(--dark-gray)] leading-none">
                    {totalActivities}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-[var(--border-gray)] overflow-hidden group hover:shadow-xl transition-shadow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f59e0b]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--muted-gray)] uppercase tracking-wide">
                    Total Time
                  </p>
                  <p className="text-[36px] font-bold text-[var(--dark-gray)] leading-none">
                    {totalDuration}<span className="text-[18px] ml-1">min</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sessions Accordion */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[var(--border-gray)]">
          <h3 className="text-[24px] font-bold text-[var(--dark-gray)] mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-blue)]/10 to-[var(--dark-blue)]/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--primary-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Session Timeline
          </h3>
          
          <Accordion type="single" collapsible className="space-y-4">
            {sessions.map((session, sessionIndex) => (
              <AccordionItem
                key={session.id}
                value={session.id}
                className="bg-gradient-to-br from-[var(--light-gray)] to-white border-2 border-[var(--border-gray)] rounded-xl shadow-sm overflow-hidden hover:shadow-md hover:border-[var(--primary-blue)]/30 transition-all"
              >
                <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-white/50 transition-all [&[data-state=open]]:bg-white">
                  <div className="flex items-center gap-4 text-left w-full">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[var(--primary-blue)] to-[var(--dark-blue)] rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-[20px]">
                        {String(sessionIndex + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[22px] font-bold text-[var(--dark-gray)] mb-1 truncate">
                        {session.title}
                      </h4>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[14px] text-[var(--muted-gray)] flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {session.date}
                        </span>
                        <span className="text-[14px] text-[var(--muted-gray)] flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {session.activities.reduce((sum, act) => sum + (parseInt(act.duration) || 0), 0)} min
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="px-4 py-2 bg-gradient-to-r from-[var(--primary-blue)] to-[var(--dark-blue)] rounded-full">
                        <span className="text-[15px] font-bold text-white">
                          {session.activities.length} {session.activities.length === 1 ? 'Activity' : 'Activities'}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <div className="space-y-4">
                    {session.activities.map((activity, index) => (
                      <div
                        key={activity.instanceId || `${activity.id}-${index}`}
                        className="group relative bg-white border-2 border-[var(--border-gray)] rounded-xl p-5 hover:border-[var(--primary-blue)]/50 hover:shadow-md transition-all overflow-hidden"
                      >
                        {/* Activity number badge */}
                        <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-[var(--primary-blue)]/10 to-[var(--dark-blue)]/10 rounded-lg flex items-center justify-center">
                          <span className="text-[14px] font-bold text-[var(--primary-blue)]">
                            {index + 1}
                          </span>
                        </div>
                        
                        <div className="pr-14">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--primary-blue)]/10 to-[var(--dark-blue)]/10 rounded-lg flex items-center justify-center group-hover:from-[var(--primary-blue)]/20 group-hover:to-[var(--dark-blue)]/20 transition-colors">
                              <svg className="w-6 h-6 text-[var(--primary-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-[19px] font-bold text-[var(--dark-gray)] mb-2 group-hover:text-[var(--primary-blue)] transition-colors">
                                {activity.title}
                              </h5>
                              <p className="text-[15px] text-[var(--muted-gray)] leading-relaxed mb-3">
                                {activity.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[var(--primary-blue)]/10 to-[var(--dark-blue)]/10 rounded-lg">
                                  <svg className="w-4 h-4 text-[var(--primary-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-[14px] font-semibold text-[var(--dark-gray)]">
                                    {activity.duration}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}