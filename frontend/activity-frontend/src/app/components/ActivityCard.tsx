import { toast } from "sonner";

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number;
  instanceId?: string; // Unique ID for each instance when selected
}

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
}

export function ActivityCard({ activity, onSelect }: ActivityCardProps) {
  const handleSelect = () => {
    onSelect(activity);
    toast.success("Activity Selected!", {
      description: `"${activity.title}" has been added to your session.`,
      duration: 3000,
    });
  };

  return (
    <div className="group relative bg-white border border-[var(--border-gray)] rounded-xl p-6 shadow-md hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-blue)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative z-10">
        {/* Icon badge */}
        <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-blue)]/10 to-[var(--dark-blue)]/10 rounded-lg flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-[var(--primary-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <h3 className="text-[20px] font-bold text-[var(--dark-gray)] mb-3 group-hover:text-[var(--primary-blue)] transition-colors">
          {activity.title}
        </h3>
        <p className="text-[15px] text-[var(--muted-gray)] mb-6 leading-relaxed">
          {activity.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[14px] text-[var(--muted-gray)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{activity.duration} min</span>
          </div>
          <button
            onClick={handleSelect}
            className="bg-gradient-to-r from-[var(--primary-blue)] to-[var(--dark-blue)] hover:from-[var(--dark-blue)] hover:to-[var(--primary-blue)] text-white text-[15px] font-semibold px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
