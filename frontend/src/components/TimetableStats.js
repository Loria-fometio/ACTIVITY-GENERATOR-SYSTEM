import React from 'react';

function TimetableStats({ timetable }) {
  if (!timetable || !timetable.activities) {
    return null;
  }

  const totalActivities = timetable.activities.length;
  const completedActivities = timetable.activities.filter(a => a.is_completed).length;
  const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
  
  // Calculate total time
  const totalMinutes = timetable.activities.reduce((sum, activity) => sum + (activity.duration_minutes || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  
  // Category distribution
  const categories = {};
  timetable.activities.forEach(activity => {
    const category = activity.category || 'Uncategorized';
    categories[category] = (categories[category] || 0) + 1;
  });

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '30px'
    }}>
      {/* Completion Stats */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#ebf8ff',
        borderRadius: '8px',
        border: '1px solid #bee3f8'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#2b6cb0' }}>Completion</h4>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#2b6cb0' }}>
            {completionRate}%
          </span>
          <span style={{ color: '#718096' }}>
            ({completedActivities}/{totalActivities})
          </span>
        </div>
        <div style={{ 
          height: '8px', 
          backgroundColor: '#cbd5e0', 
          borderRadius: '4px',
          marginTop: '10px',
          overflow: 'hidden'
        }}>
          <div 
            style={{ 
              height: '100%', 
              backgroundColor: '#4299e1',
              width: `${completionRate}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
      
      {/* Time Stats */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#f0fff4',
        borderRadius: '8px',
        border: '1px solid #c6f6d5'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#276749' }}>Total Time</h4>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#276749' }}>
          {totalHours > 0 ? `${totalHours}h ` : ''}{remainingMinutes}m
        </div>
        <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>
          Across all activities
        </p>
      </div>
      
      {/* Generation Info */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#faf5ff',
        borderRadius: '8px',
        border: '1px solid #e9d8fd'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#553c9a' }}>Generation</h4>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#553c9a', marginBottom: '5px' }}>
          {timetable.generation_method || 'random'}
        </div>
        <p style={{ margin: '5px 0 0 0', color: '#718096', fontSize: '14px' }}>
          Method used
        </p>
      </div>
      
      {/* Category Breakdown */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#fff5f5',
        borderRadius: '8px',
        border: '1px solid #fed7d7'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#c53030' }}>Categories</h4>
        <div>
          {Object.entries(categories).map(([category, count]) => (
            <div 
              key={category}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '14px'
              }}
            >
              <span>{category}</span>
              <span style={{ fontWeight: 'bold' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimetableStats;