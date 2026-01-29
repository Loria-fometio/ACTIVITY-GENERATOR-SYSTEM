// src/components/WeeklyCalendar.js
import React from 'react';

function WeeklyCalendar({ timetable, onActivityComplete }) {
  const days = [
    { id: 0, name: 'Monday' },
    { id: 1, name: 'Tuesday' },
    { id: 2, name: 'Wednesday' },
    { id: 3, name: 'Thursday' },
    { id: 4, name: 'Friday' },
    { id: 5, name: 'Saturday' },
    { id: 6, name: 'Sunday' }
  ];

  if (!timetable || !timetable.activities) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        <p>No timetable data available</p>
      </div>
    );
  }

  // Group activities by day
  const activitiesByDay = days.map(day => ({
    ...day,
    activities: timetable.activities.filter(activity => activity.day_number === day.id)
  }));

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '15px',
      marginTop: '20px'
    }}>
      {activitiesByDay.map(day => (
        <div 
          key={day.id}
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <h3 style={{ 
            margin: '0 0 15px 0', 
            paddingBottom: '10px',
            borderBottom: '2px solid #f0f0f0',
            color: '#333'
          }}>
            {day.name}
          </h3>
          
          {day.activities.length === 0 ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center',
              color: '#999',
              fontStyle: 'italic'
            }}>
              No activities scheduled
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {day.activities.map(activity => (
                <div
                  key={activity.id}
                  style={{
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    backgroundColor: activity.is_completed ? '#f0fff4' : '#f9f9f9',
                    position: 'relative'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div>
                      <strong style={{ color: '#333', display: 'block' }}>
                        {activity.activity_name}
                      </strong>
                      <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        marginTop: '5px',
                        fontSize: '14px',
                        color: '#666'
                      }}>
                        <span>⏱️ {activity.duration_minutes} min</span>
                        <span>🏷️ {activity.category}</span>
                        {activity.start_time && (
                          <span>🕒 {activity.start_time}</span>
                        )}
                      </div>
                    </div>
                    
                    {activity.is_completed ? (
                      <span style={{ 
                        backgroundColor: '#48bb78',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        ✓ Done
                      </span>
                    ) : (
                      <button
                        onClick={() => onActivityComplete && onActivityComplete(activity.id)}
                        style={{
                          backgroundColor: '#4299e1',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                  
                  {activity.user_notes && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px',
                      backgroundColor: 'rgba(0,0,0,0.03)',
                      borderRadius: '4px',
                      fontSize: '14px',
                      color: '#555'
                    }}>
                      📝 {activity.user_notes}
                    </div>
                  )}
                  
                  {activity.user_rating && (
                    <div style={{
                      marginTop: '5px',
                      fontSize: '14px',
                      color: '#f6ad55'
                    }}>
                      {'⭐'.repeat(activity.user_rating)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default WeeklyCalendar;