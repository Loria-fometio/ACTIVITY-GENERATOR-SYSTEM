// src/pages/TimetableView.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import timetableAPI from '../services/api';
import WeeklyCalendar from '../components/WeeklyCalendar';
import TimetableStats from '../components/TimetableStats';

// Icons for better UI
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

function TimetableView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);

  // Design System Constants
  const COLORS = {
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    background: '#F9FAFB',
    card: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B'
  };

  const TYPOGRAPHY = {
    pageTitle: { fontSize: '24px', fontWeight: 600 },
    sectionTitle: { fontSize: '20px', fontWeight: 600 },
    body: { fontSize: '16px', fontWeight: 400 },
    button: { fontSize: '16px', fontWeight: 600 },
    small: { fontSize: '14px', fontWeight: 400 }
  };

  // Load demo data if API fails - MOVE THIS OUTSIDE useCallback
  const loadDemoData = useCallback(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    const mockTimetable = {
      timetable_id: id,
      title: 'Sample Weekly Plan',
      week_start_date: formatDate(weekStart),
      week_end_date: formatDate(weekEnd),
      generation_method: 'balanced',
      user_notes: 'This is a sample timetable for demonstration purposes.',
      total_activities: 15,
      completed_activities: 8,
      total_hours: 25,
      activities: [
        { 
          id: 'act1', 
          day_number: 1, 
          day_name: 'Monday',
          activity_name: 'Morning Exercise', 
          category: 'fitness',
          duration_minutes: 45,
          start_time: '07:00:00',
          end_time: '07:45:00',
          is_completed: true,
          user_rating: 5,
          user_notes: 'Great workout!'
        },
        { 
          id: 'act2', 
          day_number: 1, 
          day_name: 'Monday',
          activity_name: 'Work Project', 
          category: 'work',
          duration_minutes: 180,
          start_time: '09:00:00',
          end_time: '12:00:00',
          is_completed: true,
          user_rating: 4
        },
        { 
          id: 'act3', 
          day_number: 1, 
          day_name: 'Monday',
          activity_name: 'Study Session', 
          category: 'study',
          duration_minutes: 120,
          start_time: '14:00:00',
          end_time: '16:00:00',
          is_completed: false,
          user_rating: null
        },
        { 
          id: 'act4', 
          day_number: 2, 
          day_name: 'Tuesday',
          activity_name: 'Yoga Session', 
          category: 'fitness',
          duration_minutes: 60,
          start_time: '08:00:00',
          end_time: '09:00:00',
          is_completed: false,
          user_rating: null
        },
        { 
          id: 'act5', 
          day_number: 3, 
          day_name: 'Wednesday',
          activity_name: 'Team Meeting', 
          category: 'work',
          duration_minutes: 90,
          start_time: '10:00:00',
          end_time: '11:30:00',
          is_completed: true,
          user_rating: 5
        },
      ]
    };
    
    setTimetable(mockTimetable);
    setNotes(mockTimetable.user_notes || '');
  }, [id]); // Add id as dependency since it's used

  // Load timetable data
  const loadTimetable = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🟢 Loading timetable for ID:', id);
      
      // Check if timetableAPI exists
      if (!timetableAPI) {
        console.error('❌ timetableAPI is undefined!');
        setError('API not available. Using demo data.');
        loadDemoData();
        return;
      }
      
      const response = await timetableAPI.getById(id);
      console.log('🔍 API Response:', response);
      
      if (response.success && response.data) {
        setTimetable(response.data);
        setNotes(response.data.user_notes || '');
        setError('');
      } else if (response.data) {
        setTimetable(response.data);
        setNotes(response.data.user_notes || '');
        setError('');
      } else {
        console.warn('Unexpected response structure:', response);
        setError('Unexpected data format. Using demonstration data.');
        loadDemoData();
      }
    } catch (err) {
      console.error('❌ Error loading timetable:', err);
      setError('Failed to load timetable. Using demonstration data.');
      loadDemoData();
    } finally {
      setLoading(false);
    }
  }, [id, loadDemoData]); // Add loadDemoData to dependencies

  useEffect(() => {
    console.log('🟢 TimetableView mounted');
    loadTimetable();
  }, [loadTimetable]);

  const handleCompleteActivity = async (activityId) => {
    console.log('🟢 Complete activity button clicked for:', activityId);
    
    try {
      const rating = prompt('Rate this activity (1-5 stars):', '5');
      const notes = prompt('Add any notes (optional):', '');
      
      if (rating === null) return; // User cancelled
      
      const ratingValue = parseInt(rating);
      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        alert('Please enter a valid rating between 1 and 5');
        return;
      }
      
      console.log('🟡 Calling timetableAPI.completeActivity');
      
      // Check if timetableAPI exists
      if (!timetableAPI || !timetableAPI.completeActivity) {
        console.error('❌ timetableAPI.completeActivity is not available');
        alert('Complete activity function not available. Using mock data.');
        // Update local state for demo
        const updatedTimetable = { ...timetable };
        const activity = updatedTimetable.activities?.find(a => a.id === activityId);
        if (activity) {
          activity.is_completed = true;
          activity.user_rating = ratingValue;
          activity.user_notes = notes || '';
          setTimetable(updatedTimetable);
        }
        alert('Activity marked as completed! (Demo mode)');
        return;
      }
      
      await timetableAPI.completeActivity(activityId, { 
        rating: ratingValue, 
        notes: notes || '' 
      });
      
      console.log('✅ Activity marked as completed');
      alert('Activity marked as completed!');
      loadTimetable(); // Reload to get updated data
    } catch (err) {
      console.error('❌ Error completing activity:', err);
      alert('Failed to update activity. Check console for details.');
    }
  };

  const handleDeleteTimetable = async () => {
    console.log('🟢 Delete button clicked');
    
    if (window.confirm('Are you sure you want to delete this timetable? This action cannot be undone.')) {
      try {
        console.log('🟡 Calling timetableAPI.delete for:', id);
        
        // Check if timetableAPI exists
        if (!timetableAPI || !timetableAPI.delete) {
          console.error('❌ timetableAPI.delete is not available');
          alert('Delete function not available. Using mock data.');
          alert('Timetable deleted successfully! (Demo mode)');
          navigate('/');
          return;
        }
        
        await timetableAPI.delete(id);
        console.log('✅ Delete successful');
        
        alert('Timetable deleted successfully');
        navigate('/');
      } catch (err) {
        console.error('❌ Error deleting timetable:', err);
        alert('Failed to delete timetable. Please try again.');
      }
    }
  };

  const handleExportPDF = () => {
    console.log('🟢 Export PDF button clicked');
    // Implement PDF export functionality
    alert('PDF export feature coming soon! For now, use the Print button.');
  };

  const handlePrint = () => {
    console.log('🟢 Print button clicked');
    window.print();
  };

  const handleSaveNotes = async () => {
    console.log('🟢 Save Notes button clicked');
    try {
      // Check if timetableAPI exists
      if (!timetableAPI || !timetableAPI.updateNotes) {
        console.log('❌ timetableAPI.updateNotes not available, using localStorage');
        // Save to localStorage for demo
        localStorage.setItem(`timetable_notes_${id}`, notes);
        setShowNotesModal(false);
        alert('Notes saved successfully! (Demo mode)');
        return;
      }
      
      await timetableAPI.updateNotes(id, { notes });
      setShowNotesModal(false);
      alert('Notes saved successfully!');
    } catch (err) {
      console.error('❌ Error saving notes:', err);
      alert('Failed to save notes');
    }
  };

  const handleAddNotes = () => {
    console.log('🟢 Add Notes button clicked');
    setShowNotesModal(true);
  };

  const handleBackToDashboard = () => {
    console.log('🟢 Back to Dashboard button clicked');
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: COLORS.background,
        minHeight: '100vh',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        fontFamily: "'Inter', 'Roboto', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: `4px solid ${COLORS.border}`,
            borderTop: `4px solid ${COLORS.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <h3 style={{ color: COLORS.textPrimary, margin: '0 0 8px 0' }}>
            Loading Timetable
          </h3>
          <p style={{ color: COLORS.textSecondary }}>
            Please wait while we load your schedule...
          </p>
          <style jsx="true">{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: COLORS.background,
      minHeight: '100vh',
      padding: '24px',
      fontFamily: "'Inter', 'Roboto', sans-serif"
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button 
            onClick={handleBackToDashboard}
            style={{
              backgroundColor: 'white',
              color: COLORS.primary,
              border: `1px solid ${COLORS.primary}`,
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <ArrowBackIcon style={{ fontSize: '18px' }} />
            Back to Dashboard
          </button>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <CalendarMonthIcon style={{ fontSize: '32px', color: COLORS.primary }} />
                <h1 style={{ 
                  ...TYPOGRAPHY.pageTitle,
                  color: COLORS.textPrimary,
                  margin: 0
                }}>
                  {timetable?.title || 'Weekly Timetable'}
                </h1>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                color: COLORS.textSecondary,
                fontSize: TYPOGRAPHY.small.fontSize,
                marginBottom: '8px',
                flexWrap: 'wrap'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px'
                }}>
                  <span>📅</span>
                  <span>
                    {timetable?.week_start_date} to {timetable?.week_end_date}
                  </span>
                </div>
                
                <div style={{ 
                  backgroundColor: '#F3F4F6',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <SettingsIcon style={{ fontSize: '14px' }} />
                  <span style={{ fontWeight: 500 }}>
                    {timetable?.generation_method || 'balanced'} generation
                  </span>
                </div>
                
                {timetable?.total_activities && (
                  <div style={{ 
                    backgroundColor: '#F3F4F6',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>📋</span>
                    <span style={{ fontWeight: 500 }}>
                      {timetable.total_activities} activities
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleAddNotes}
                style={{
                  backgroundColor: 'white',
                  color: COLORS.textPrimary,
                  border: `1px solid ${COLORS.border}`,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <NoteAddIcon style={{ fontSize: '18px' }} />
                Add Notes
              </button>
              
              <button
                onClick={handleExportPDF}
                style={{
                  backgroundColor: 'white',
                  color: COLORS.primary,
                  border: `1px solid ${COLORS.primary}`,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <DownloadIcon style={{ fontSize: '18px' }} />
                Export PDF
              </button>
              
              <button
                onClick={handlePrint}
                style={{
                  backgroundColor: 'white',
                  color: COLORS.textPrimary,
                  border: `1px solid ${COLORS.border}`,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <PrintIcon style={{ fontSize: '18px' }} />
                Print
              </button>
              
              <button
                onClick={handleDeleteTimetable}
                style={{
                  backgroundColor: COLORS.error,
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 500,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.error}
              >
                <DeleteIcon style={{ fontSize: '18px' }} />
                Delete
              </button>
            </div>
          </div>
          
          {error && (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              borderRadius: '8px',
              marginTop: '20px',
              border: `1px solid ${COLORS.error}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <strong>Note:</strong> {error}
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div style={{ marginBottom: '32px' }}>
          <TimetableStats timetable={timetable} />
        </div>

        {/* Weekly Calendar */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            ...TYPOGRAPHY.sectionTitle,
            color: COLORS.textPrimary,
            margin: '0 0 20px 0',
            paddingBottom: '12px',
            borderBottom: `2px solid ${COLORS.border}`
          }}>
            Weekly Schedule
          </h2>
          <WeeklyCalendar 
            timetable={timetable} 
            onActivityComplete={handleCompleteActivity}
          />
        </div>

        {/* Notes Section */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${COLORS.border}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ 
              ...TYPOGRAPHY.sectionTitle,
              fontSize: '18px',
              color: COLORS.textPrimary,
              margin: 0
            }}>
              📝 Notes & Instructions
            </h3>
            <button
              onClick={handleAddNotes}
              style={{
                backgroundColor: COLORS.primary,
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
            >
              Edit Notes
            </button>
          </div>
          
          <div style={{ 
            color: COLORS.textSecondary,
            lineHeight: 1.6,
            fontSize: TYPOGRAPHY.body.fontSize,
            whiteSpace: 'pre-wrap',
            minHeight: '60px',
            padding: '12px',
            backgroundColor: notes ? '#F9FAFB' : 'transparent',
            borderRadius: '8px',
            border: notes ? `1px solid ${COLORS.border}` : 'none'
          }}>
            {notes || 'No notes added yet. Click "Edit Notes" to add your thoughts or instructions.'}
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '20px',
            marginTop: '20px',
            fontSize: '14px',
            color: COLORS.textSecondary,
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '50%' }}></div>
              <span>Completed activity</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#F59E0B', borderRadius: '50%' }}></div>
              <span>Incomplete activity</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⭐</span>
              <span>Activity rating (1-5 stars)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{
              ...TYPOGRAPHY.sectionTitle,
              color: COLORS.textPrimary,
              margin: '0 0 16px 0'
            }}>
              Edit Notes
            </h3>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes, instructions, or thoughts about this timetable..."
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                fontSize: TYPOGRAPHY.body.fontSize,
                color: COLORS.textPrimary,
                resize: 'vertical',
                marginBottom: '20px',
                fontFamily: 'inherit'
              }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowNotesModal(false)}
                style={{
                  backgroundColor: 'white',
                  color: COLORS.textSecondary,
                  border: `1px solid ${COLORS.border}`,
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Cancel
              </button>
              
              <button
                onClick={handleSaveNotes}
                style={{
                  backgroundColor: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimetableView;