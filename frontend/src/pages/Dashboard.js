import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import timetableAPI from '../services/api';

// Icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TemplateIcon from '@mui/icons-material/ViewModule';

function Dashboard() {
  const navigate = useNavigate();
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    total: 0, 
    completed: 0, 
    thisWeek: 0,
    upcoming: 0
  });

  // Design System Constants
  const COLORS = {
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    background: '#F9FAFB',
    card: '#FFFFFF',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    lightBlue: '#EFF6FF',
    blueText: '#1E40AF',
    success: '#10B981',
    warning: '#F59E0B'
  };

  const TYPOGRAPHY = {
    pageTitle: { fontSize: '24px', fontWeight: 600 },
    sectionTitle: { fontSize: '20px', fontWeight: 600 },
    body: { fontSize: '16px', fontWeight: 400 },
    button: { fontSize: '16px', fontWeight: 600 },
    small: { fontSize: '14px', fontWeight: 400 }
  };

  const SPACING = {
    pagePadding: '24px',
    cardPadding: '16px',
    borderRadius: {
      card: '8px',
      button: '6px'
    },
    gap: {
      sections: '24px',
      elements: '16px',
      small: '8px'
    }
  };

  const COMPONENTS = {
    primaryButton: {
      background: COLORS.primary,
      color: '#FFFFFF',
      border: 'none',
      hoverBackground: COLORS.primaryHover
    },
    secondaryButton: {
      background: '#FFFFFF',
      color: COLORS.primary,
      border: `1px solid ${COLORS.primary}`,
      hoverBackground: '#F3F4F6'
    },
    card: {
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: SPACING.borderRadius.card
    },
    input: {
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      color: COLORS.textPrimary
    }
  };

  // Load timetables
  const loadTimetables = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading timetables...');
      
      // Check if timetableAPI exists
      if (!timetableAPI) {
        console.error('timetableAPI is undefined!');
        return;
      }
      
      const response = await timetableAPI.getAll(); 
      console.log('🔍 API Response:', response);
      
      let data = [];
      
      // Handle different response structures
      if (Array.isArray(response)) {
        data = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response && response.success && Array.isArray(response.data)) {
        data = response.data;
      } else {
        console.warn('Unexpected API response structure:', response);
        data = [];
      }
      
      console.log('🔍 Extracted data:', data);
      
      if (data.length > 0) {
        // Ensure each timetable has week_end_date
        const enhancedData = data.map(tt => {
          const processed = { ...tt };
          
          // Ensure week_end_date exists
          if (!processed.week_end_date && processed.week_start_date) {
            try {
              const start = new Date(processed.week_start_date);
              const end = new Date(start);
              end.setDate(end.getDate() + 6);
              processed.week_end_date = end.toISOString().split('T')[0];
            } catch (e) {
              console.warn('Failed to calculate end date:', e);
              processed.week_end_date = processed.week_start_date;
            }
          }
          
          // Determine icon
          if (!processed.icon) {
            const title = (processed.title || '').toLowerCase();
            if (title.includes('workout') || title.includes('fitness') || title.includes('exercise') || processed.category === 'fitness') {
              processed.icon = 'fitness';
            } else if (title.includes('study') || title.includes('learn') || title.includes('exam') || processed.category === 'study') {
              processed.icon = 'study';
            } else if (title.includes('work') || processed.category === 'work') {
              processed.icon = 'work';
            } else {
              processed.icon = 'general';
            }
          }
          
          // Set default status
          if (!processed.status) {
            processed.status = 'active';
          }
          
          return processed;
        });
        
        setTimetables(enhancedData);
        console.log('Set timetables:', enhancedData.length, 'items');
        
        // Calculate statistics
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const newStats = {
          total: enhancedData.length,
          completed: enhancedData.filter(t => t.status === 'completed').length,
          thisWeek: enhancedData.filter(t => {
            try {
              if (!t.week_start_date) return false;
              const ttDate = new Date(t.week_start_date);
              return ttDate >= weekStart && ttDate <= weekEnd;
            } catch {
              return false;
            }
          }).length,
          upcoming: enhancedData.filter(t => {
            try {
              if (!t.week_start_date) return false;
              const ttDate = new Date(t.week_start_date);
              return ttDate > today && t.status !== 'completed';
            } catch {
              return false;
            }
          }).length
        };
        
        setStats(newStats);
        console.log('Stats calculated:', newStats);
        
      } else {
        console.log('ℹNo timetables found');
        setStats({ total: 0, completed: 0, thisWeek: 0, upcoming: 0 });
      }
      
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      // Clear data on error
      setTimetables([]);
      setStats({ total: 0, completed: 0, thisWeek: 0, upcoming: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('🔍 Dashboard mounted, loading timetables...');
    loadTimetables();
  }, [loadTimetables]);

  // Button Handlers
  const handleSettings = () => {
    console.log('Settings button clicked');
    navigate('/settings');
  };

  const handleCreateNew = () => {
    console.log('Create New button clicked');
    navigate('/generate');
  };

  const handleBrowseTemplates = () => {
    console.log('Browse Templates button clicked');
    navigate('/templates');
  };

  const handleGenerateWithAI = () => {
    console.log('Generate with AI button clicked');
    navigate('/ai-generator');
  };

  const handleViewTimetable = (id) => {
    console.log('View Timetable button clicked for ID:', id);
    navigate(`/timetable/${id}`);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    console.log('Delete button clicked for ID:', id);
    
    if (window.confirm('Are you sure you want to delete this timetable?')) {
      try {
        console.log('Calling timetableAPI.delete for:', id);
        
        // Check if timetableAPI exists
        if (!timetableAPI || !timetableAPI.delete) {
          console.error('timetableAPI.delete is not available');
          alert('Delete function not available');
          return;
        }
        
        await timetableAPI.delete(id);
        console.log('Delete successful');
        
        // Show success message
        alert('Timetable deleted successfully!');
        
        // Refresh the list
        loadTimetables();
        
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete timetable. Please try again.');
      }
    }
  };

  const handleDuplicate = async (e, timetable) => {
    e.stopPropagation();
    console.log('Duplicate button clicked for:', timetable.title);
    
    try {
      // Create a copy with new ID
      const copy = {
        ...timetable,
        timetable_id: `tt_copy_${Date.now()}`,
        title: `${timetable.title} (Copy)`
      };
      
      // Save the copy to localStorage
      const savedTimetables = JSON.parse(localStorage.getItem('timetable_app_data_v2') || '{"timetables":[]}');
      savedTimetables.timetables.push(copy);
      localStorage.setItem('timetable_app_data_v2', JSON.stringify(savedTimetables));
      
      console.log('Duplicated timetable:', copy.title);
      alert('Timetable duplicated successfully!');
      
      // Refresh the list
      loadTimetables();
      
    } catch (error) {
      console.error('Duplicate error:', error);
      alert('Failed to duplicate timetable. Please try again.');
    }
  };

  const getTimetableIcon = (type) => {
    if (type === 'fitness') return <FitnessCenterIcon style={{ color: '#3B82F6' }} />;
    if (type === 'study') return <SchoolIcon style={{ color: '#8B5CF6' }} />;
    if (type === 'work') return <CalendarTodayIcon style={{ color: '#10B981' }} />;
    return <CalendarTodayIcon style={{ color: '#64748B' }} />;
  };

  const formatDateRange = (startDate, endDate) => {
    try {
      if (!startDate) return 'No date set';
      
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        console.warn('Invalid start date:', startDate);
        return 'Date error';
      }
      
      let formattedStart = start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      if (!endDate) return formattedStart;
      
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        console.warn('Invalid end date:', endDate);
        return formattedStart;
      }
      
      const formattedEnd = end.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      return `${formattedStart} - ${formattedEnd}`;
    } catch (e) {
      console.error('Date formatting error:', e);
      return startDate || 'Date error';
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      active: { bg: '#DCFCE7', color: '#166534' },
      completed: { bg: '#D1FAE5', color: '#065F46' },
      upcoming: { bg: '#DBEAFE', color: '#1E40AF' },
      draft: { bg: '#F3F4F6', color: '#374151' }
    };
    
    const config = statusColors[status] || statusColors.draft;
    
    return (
      <span style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 500,
        marginLeft: '8px'
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ 
      backgroundColor: COLORS.background, 
      minHeight: '100vh',
      fontFamily: "'Inter', 'Roboto', sans-serif"
    }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: SPACING.pagePadding
      }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: SPACING.gap.sections 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CalendarMonthIcon style={{ 
              fontSize: '32px', 
              color: COLORS.primary 
            }} />
            <h1 style={{ 
              ...TYPOGRAPHY.pageTitle,
              color: COLORS.textPrimary,
              margin: 0 
            }}>
              Activity Schedules
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleSettings}
              style={{ 
                ...COMPONENTS.secondaryButton,
                padding: '8px 16px',
                borderRadius: SPACING.borderRadius.button,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: TYPOGRAPHY.button.fontWeight,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COMPONENTS.secondaryButton.hoverBackground}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COMPONENTS.secondaryButton.background}>
              <SettingsIcon style={{ fontSize: '20px' }} />
              Settings
            </button>
            <button 
              onClick={handleCreateNew}
              style={{ 
                ...COMPONENTS.primaryButton,
                padding: '10px 20px',
                borderRadius: SPACING.borderRadius.button,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: TYPOGRAPHY.button.fontWeight,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COMPONENTS.primaryButton.hoverBackground}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COMPONENTS.primaryButton.background}>
              <AddIcon /> 
              Create New
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '20px', 
          marginBottom: SPACING.gap.sections 
        }}>
          <div style={{ 
            ...COMPONENTS.card,
            padding: SPACING.cardPadding,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ 
              background: '#DBEAFE', 
              padding: '12px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircleIcon style={{ color: COLORS.primary, fontSize: '24px' }} />
            </div>
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: COLORS.textPrimary 
              }}>
                {stats.total}
              </div>
              <div style={{ 
                color: COLORS.textSecondary, 
                fontSize: TYPOGRAPHY.small.fontSize 
              }}>
                Total Schedules
              </div>
            </div>
          </div>

          <div style={{ 
            ...COMPONENTS.card,
            padding: SPACING.cardPadding,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            animation: 'fadeIn 0.3s ease-out 0.1s'
          }}>
            <div style={{ 
              background: '#F0F9FF', 
              padding: '12px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AccessTimeIcon style={{ color: '#0EA5E9', fontSize: '24px' }} />
            </div>
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: COLORS.textPrimary 
              }}>
                {stats.thisWeek}
              </div>
              <div style={{ 
                color: COLORS.textSecondary, 
                fontSize: TYPOGRAPHY.small.fontSize 
              }}>
                This Week
              </div>
            </div>
          </div>

          <div style={{ 
            ...COMPONENTS.card,
            padding: SPACING.cardPadding,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            animation: 'fadeIn 0.3s ease-out 0.2s'
          }}>
            <div style={{ 
              background: '#FEF3C7', 
              padding: '12px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUpIcon style={{ color: '#D97706', fontSize: '24px' }} />
            </div>
            <div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: COLORS.textPrimary 
              }}>
                {stats.upcoming}
              </div>
              <div style={{ 
                color: COLORS.textSecondary, 
                fontSize: TYPOGRAPHY.small.fontSize 
              }}>
                Upcoming
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 320px', 
          gap: SPACING.gap.sections 
        }}>
          
          {/* Timetables List Section */}
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h2 style={{ 
                ...TYPOGRAPHY.sectionTitle,
                color: COLORS.textPrimary,
                margin: 0
              }}>
                Your Schedules
              </h2>
              <span style={{ 
                color: COLORS.textSecondary,
                fontSize: TYPOGRAPHY.small.fontSize
              }}>
                {timetables.length} {timetables.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {loading ? (
              <div style={{ 
                ...COMPONENTS.card,
                padding: '40px',
                textAlign: 'center',
                color: COLORS.textSecondary,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div className="loading-spinner"></div>
                Loading schedules...
              </div>
            ) : timetables.length === 0 ? (
              <div style={{ 
                ...COMPONENTS.card,
                padding: '40px',
                textAlign: 'center',
                color: COLORS.textSecondary
              }}>
                <p style={{ marginBottom: '20px' }}>No schedules found. Create your first one!</p>
                <button 
                  onClick={handleCreateNew}
                  style={{ 
                    ...COMPONENTS.primaryButton,
                    padding: '10px 20px',
                    borderRadius: SPACING.borderRadius.button,
                    cursor: 'pointer'
                  }}>
                  <AddIcon /> Create Your First Schedule
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {timetables.map((tt, index) => (
                  <div 
                    key={tt.timetable_id || index}
                    onClick={() => handleViewTimetable(tt.timetable_id)}
                    style={{ 
                      ...COMPONENTS.card,
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      animation: `fadeIn 0.3s ease-out ${index * 0.05}s`,
                      position: 'relative'
                    }}
                    className="dashboard-card"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ 
                        background: '#F3F4F6',
                        padding: '10px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {getTimetableIcon(tt.icon)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <h4 style={{ 
                            margin: 0, 
                            fontSize: TYPOGRAPHY.body.fontSize, 
                            color: COLORS.textPrimary,
                            fontWeight: 500 
                          }}>
                            {tt.title || 'Untitled Schedule'}
                          </h4>
                          {getStatusBadge(tt.status || 'active')}
                        </div>
                        <p style={{ 
                          margin: 0, 
                          fontSize: TYPOGRAPHY.small.fontSize, 
                          color: COLORS.textSecondary 
                        }}>
                          {formatDateRange(tt.week_start_date, tt.week_end_date)}
                          {tt.generation_method && ` • ${tt.generation_method}`}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        onClick={(e) => handleDuplicate(e, tt)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          color: COLORS.textSecondary,
                          padding: '8px',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Duplicate Schedule">
                        <ContentCopyIcon fontSize="small" />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleViewTimetable(tt.timetable_id); 
                        }}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          color: COLORS.primary,
                          padding: '8px',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="View Schedule">
                        <VisibilityIcon fontSize="small" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, tt.timetable_id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer', 
                          color: '#EF4444',
                          padding: '8px',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title="Delete Schedule">
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Tips & Quick Actions */}
          <aside style={{ 
            background: COLORS.lightBlue, 
            padding: '24px', 
            borderRadius: '16px',
            border: `1px solid #DBEAFE`,
            height: 'fit-content',
            position: 'sticky',
            top: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              color: COLORS.blueText, 
              marginBottom: '16px' 
            }}>
              <LightbulbIcon style={{ fontSize: '20px' }} />
              <h4 style={{ 
                margin: 0,
                fontSize: TYPOGRAPHY.sectionTitle.fontSize,
                fontWeight: TYPOGRAPHY.sectionTitle.fontWeight
              }}>
                Pro Tips
              </h4>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ 
                fontSize: TYPOGRAPHY.small.fontSize, 
                color: COLORS.blueText, 
                lineHeight: '1.6', 
                margin: 0 
              }}>
                • Duplicate successful schedules using the copy icon to save time
                <br />
                • Use AI generation for optimized time blocking
                <br />
                • Start with templates for common scenarios
              </p>
            </div>
            
            <div style={{ 
              paddingTop: '16px',
              borderTop: `1px solid #BFDBFE`
            }}>
              <h5 style={{ 
                margin: '0 0 16px 0',
                fontSize: TYPOGRAPHY.small.fontSize,
                fontWeight: 600,
                color: COLORS.textPrimary
              }}>
                Quick Actions
              </h5>
              
              <button 
                onClick={handleBrowseTemplates}
                style={{ 
                  ...COMPONENTS.secondaryButton,
                  width: '100%',
                  padding: '12px 16px',
                  marginBottom: '12px',
                  fontSize: TYPOGRAPHY.small.fontSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COMPONENTS.secondaryButton.hoverBackground}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COMPONENTS.secondaryButton.background}>
                <TemplateIcon fontSize="small" />
                Browse Templates
              </button>
              
              <button 
                onClick={handleGenerateWithAI}
                style={{ 
                  ...COMPONENTS.primaryButton,
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: TYPOGRAPHY.small.fontSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COMPONENTS.primaryButton.hoverBackground}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COMPONENTS.primaryButton.background}>
                <AutoAwesomeIcon fontSize="small" />
                Generate with AI
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Inline CSS for animations */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .loading-spinner {
          display: inline-block;
          width: 24px;
          height: 24px;
          border: 3px solid rgba(37, 99, 235, 0.1);
          border-radius: 50%;
          border-top-color: #2563EB;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .dashboard-card {
          animation: fadeIn 0.3s ease-out;
          transition: transform 0.2s, box-shadow 0.2s;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;