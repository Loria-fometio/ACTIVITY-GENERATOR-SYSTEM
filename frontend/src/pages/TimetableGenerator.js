// src/pages/TimetableGenerator.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import timetableAPI from '../services/api'; // Fixed: removed extra space
import { generateActivityId } from '../utils/helpers';

// Material-UI Icons (only the ones actually used)
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import TimerIcon from '@mui/icons-material/Timer';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// TimetableGenerator Component
const TimetableGenerator = () => {
  const navigate = useNavigate();
  
  // Add debug logging at component start
  console.log('🟢 TimetableGenerator loaded');
  console.log('🔍 timetableAPI:', timetableAPI);
  console.log('🔍 timetableAPI.generate:', timetableAPI?.generate);
  
  // Design System Constants from Word document
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
    small: { fontSize: '14px', fontWeight: 400 },
    hint: { fontSize: '13px', fontWeight: 400, color: '#6B7280' }
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

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    weekStart: new Date().toISOString().split('T')[0],
    generationMethod: 'balanced',
    activities: [
      { 
        id: generateActivityId(), 
        name: '', 
        category: 'work', 
        duration: 60,
        priority: 3,
        timeOfDay: 'any'
      }
    ]
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Activity categories
  const activityCategories = [
    { value: 'work', label: 'Work', color: '#3B82F6' },
    { value: 'study', label: 'Study', color: '#8B5CF6' },
    { value: 'fitness', label: 'Fitness', color: '#10B981' },
    { value: 'break', label: 'Break', color: '#F59E0B' },
    { value: 'personal', label: 'Personal', color: '#EF4444' },
    { value: 'social', label: 'Social', color: '#EC4899' },
    { value: 'other', label: 'Other', color: '#6B7280' }
  ];

  // Time of day options
  const timeOfDayOptions = [
    { value: 'any', label: 'Any Time' },
    { value: 'morning', label: 'Morning (6am-12pm)' },
    { value: 'afternoon', label: 'Afternoon (12pm-6pm)' },
    { value: 'evening', label: 'Evening (6pm-10pm)' },
    { value: 'night', label: 'Night (10pm-6am)' }
  ];

  // Generation methods
  const generationMethods = [
    { value: 'balanced', label: 'Balanced', description: 'Evenly distributes activities across the week' },
    { value: 'focused', label: 'Focused', description: 'Prioritizes high-priority activities in optimal slots' },
    { value: 'random', label: 'Random', description: 'Randomly assigns activities to time slots' }
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle activity changes
  const handleActivityChange = (index, field, value) => {
    console.log(`Activity ${index} changed: ${field} = ${value}`);
    setFormData(prev => {
      const updatedActivities = [...prev.activities];
      updatedActivities[index] = {
        ...updatedActivities[index],
        [field]: value
      };
      return { ...prev, activities: updatedActivities };
    });

    if (errors[`activities.${index}.${field}`]) {
      setErrors(prev => ({ ...prev, [`activities.${index}.${field}`]: '' }));
    }
  };

  // Add activity
  const addActivity = () => {
    console.log('Add activity button clicked');
    setFormData(prev => ({
      ...prev,
      activities: [
        ...prev.activities,
        { 
          id: generateActivityId(), 
          name: '', 
          category: 'work', 
          duration: 60,
          priority: 3,
          timeOfDay: 'any'
        }
      ]
    }));
  };

  // Remove activity
  const removeActivity = (index) => {
    console.log(`Remove activity button clicked for index ${index}`);
    if (formData.activities.length > 1) {
      setFormData(prev => ({
        ...prev,
        activities: prev.activities.filter((_, i) => i !== index)
      }));
    }
  };

  // Duplicate activity
  const duplicateActivity = (index) => {
    console.log(`Duplicate activity button clicked for index ${index}`);
    const activityToDuplicate = formData.activities[index];
    setFormData(prev => ({
      ...prev,
      activities: [
        ...prev.activities,
        { ...activityToDuplicate, id: generateActivityId(), name: `${activityToDuplicate.name} (Copy)` }
      ]
    }));
  };

  // Clear all activities
  const clearActivities = () => {
    console.log('Clear all activities button clicked');
    if (window.confirm('Clear all activities?')) {
      setFormData(prev => ({
        ...prev,
        activities: [{ 
          id: generateActivityId(), 
          name: '', 
          category: 'work', 
          duration: 60,
          priority: 3,
          timeOfDay: 'any'
        }]
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    console.log('Validating form...');
    const newErrors = {};
    
    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    // Validate activities
    formData.activities.forEach((activity, index) => {
      if (!activity.name.trim()) {
        newErrors[`activities.${index}.name`] = 'Activity name is required';
      }
      
      // FIXED: Better duration validation
      const duration = parseInt(activity.duration);
      if (isNaN(duration) || duration <= 0) {
        newErrors[`activities.${index}.duration`] = 'Duration must be a positive number';
      } else if (duration < 5) {
        newErrors[`activities.${index}.duration`] = 'Duration should be at least 5 minutes';
      } else if (duration > 720) {
        newErrors[`activities.${index}.duration`] = 'Duration should not exceed 12 hours (720 minutes)';
      }
    });
    
    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add validation for balanced method
  const validateBalancedMethod = () => {
    console.log('Validating balanced method...');
    if (formData.generationMethod === 'balanced') {
      // Check for single activity with Balanced method
      if (formData.activities.length < 2) {
        return {
          valid: false,
          message: 'The "Balanced" method requires at least 2 activities. Please add more activities or select a different generation method.'
        };
      }
      
      // Check for very short total duration
      const totalDuration = formData.activities.reduce((sum, activity) => sum + (parseInt(activity.duration) || 0), 0);
      const totalDays = 7; // Assuming a full week
      const minPerDay = 15; // Minimum minutes per day for distribution
      
      if (totalDuration < totalDays * minPerDay) {
        return {
          valid: false,
          message: `For "Balanced" method, total duration should be at least ${totalDays * minPerDay} minutes (${minPerDay} min × ${totalDays} days) to distribute evenly. Currently: ${totalDuration} min.`
        };
      }
      
      return { valid: true };
    }
    
    return { valid: true };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submit button clicked');
    
    // Validate basic form
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    // Validate balanced method specific rules
    const balancedValidation = validateBalancedMethod();
    if (!balancedValidation.valid) {
      console.log('Balanced method validation failed:', balancedValidation.message);
      setResult({
        success: false,
        message: balancedValidation.message
      });
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const requestData = {
        title: formData.title.trim(),
        week_start_date: formData.weekStart,
        generation_method: formData.generationMethod,
        activities: formData.activities.map(activity => ({
          name: activity.name.trim(),
          category: activity.category,
          duration: parseInt(activity.duration) || 60,
          priority: activity.priority,
          preferred_time: activity.timeOfDay
        }))
      };
      
      console.log('Sending request data:', requestData);
      console.log('Calling timetableAPI.generate...');
      
      // Check if timetableAPI exists
      if (!timetableAPI || !timetableAPI.generate) {
        console.error('timetableAPI.generate is not available');
        throw new Error('Generate function not available');
      }
      
      const response = await timetableAPI.generate(requestData);
      console.log('API Response:', response);
      
      // FIXED: Check response.success (not response.data.success)
      if (response.success) {
        setResult({
          success: true,
          message: response.message || 'Timetable generated successfully!',
          timetableId: response.data?.timetable_id
        });
        
        console.log('Generated timetable ID:', response.data?.timetable_id);
        
        // Only navigate if we have a timetable ID
        if (response.data?.timetable_id) {
          setTimeout(() => {
            navigate(`/timetable/${response.data.timetable_id}`);
          }, 1500);
        }
      } else {
        // Handle API returning success: false
        console.error('API returned success: false', response);
        throw new Error(response.message || response.error || 'Failed to generate timetable');
      }
      
    } catch (error) {
      console.error('Generation error:', error);
      
      // Handle different error formats
      let errorMessage = 'Failed to generate timetable';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      setResult({
        success: false,
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    console.log('Reset form button clicked');
    if (window.confirm('Reset form?')) {
      setFormData({
        title: '',
        weekStart: new Date().toISOString().split('T')[0],
        generationMethod: 'balanced',
        activities: [
          { 
            id: generateActivityId(), 
            name: '', 
            category: 'work', 
            duration: 60,
            priority: 3,
            timeOfDay: 'any'
          }
        ]
      });
      setErrors({});
      setResult(null);
    }
  };

  // Handle back to dashboard
  const handleBackToDashboard = () => {
    console.log('Back to Dashboard button clicked');
    navigate('/');
  };

  // Calculate totals
  const totalDuration = formData.activities.reduce((sum, activity) => sum + (parseInt(activity.duration) || 0), 0);
  const avgPriority = formData.activities.reduce((sum, activity) => sum + (parseInt(activity.priority) || 3), 0) / formData.activities.length;

  return (
    <div style={{
      backgroundColor: COLORS.background,
      minHeight: '100vh',
      padding: SPACING.pagePadding,
      fontFamily: "'Inter', 'Roboto', sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: SPACING.gap.sections }}>
          <button
            onClick={handleBackToDashboard}
            style={{
              ...COMPONENTS.secondaryButton,
              padding: '8px 16px',
              borderRadius: SPACING.borderRadius.button,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <ArrowBackIcon style={{ fontSize: '18px' }} />
            Back to Dashboard
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <DashboardIcon style={{ fontSize: '32px', color: COLORS.primary }} />
            <h1 style={{
              ...TYPOGRAPHY.pageTitle,
              color: COLORS.textPrimary,
              margin: 0
            }}>
              Generate New Timetable
            </h1>
          </div>
          
          <p style={{
            ...TYPOGRAPHY.hint,
            margin: 0
          }}>
            Create a personalized weekly schedule with your preferred activities
          </p>
        </div>

        {/* Result Message */}
        {result && (
          <div style={{
            ...COMPONENTS.card,
            padding: SPACING.cardPadding,
            marginBottom: SPACING.gap.sections,
            borderColor: result.success ? COLORS.success : COLORS.error,
            backgroundColor: result.success ? '#D1FAE5' : '#FEE2E2',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {result.success ? (
                  <CheckCircleIcon style={{ color: COLORS.success, fontSize: '24px' }} />
                ) : (
                  <ErrorIcon style={{ color: COLORS.error, fontSize: '24px' }} />
                )}
                <div>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>
                    {result.success ? 'Success!' : 'Error!'}
                  </strong>
                  <p style={{ margin: 0, fontSize: TYPOGRAPHY.small.fontSize }}>
                    {result.message}
                  </p>
                  {result.success && result.timetableId && (
                    <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: COLORS.textSecondary }}>
                      Redirecting to timetable...
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setResult(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  color: COLORS.textSecondary
                }}
              >
                <CloseIcon style={{ fontSize: '20px' }} />
              </button>
            </div>
          </div>
        )}

        {/* Warning for Balanced method with single activity */}
        {formData.generationMethod === 'balanced' && formData.activities.length < 2 && (
          <div style={{
            ...COMPONENTS.card,
            padding: SPACING.cardPadding,
            marginBottom: SPACING.gap.sections,
            borderColor: COLORS.warning,
            backgroundColor: '#FEF3C7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ErrorIcon style={{ color: COLORS.warning, fontSize: '24px', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', color: '#92400E', marginBottom: '4px' }}>
                  Balanced Method Warning
                </strong>
                <p style={{ margin: 0, fontSize: TYPOGRAPHY.small.fontSize, color: '#92400E' }}>
                  The "Balanced" method requires at least 2 activities. Add another activity or select a different generation method.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 320px', 
            gap: SPACING.gap.sections 
          }}>
            
            {/* Left Column - Main Form */}
            <div>
              {/* Basic Information */}
              <div style={{ ...COMPONENTS.card, padding: SPACING.cardPadding, marginBottom: SPACING.gap.sections }}>
                <h2 style={{
                  ...TYPOGRAPHY.sectionTitle,
                  color: COLORS.textPrimary,
                  margin: '0 0 20px 0'
                }}>
                  Basic Information
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: TYPOGRAPHY.small.fontSize,
                      fontWeight: 500,
                      color: COLORS.textPrimary,
                      marginBottom: '6px'
                    }}>
                      Timetable Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Weekly Workout Plan, Study Schedule"
                      style={{
                        ...COMPONENTS.input,
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px'
                      }}
                      disabled={loading}
                    />
                    {errors.title && (
                      <div style={{ color: COLORS.error, fontSize: '13px', marginTop: '4px' }}>
                        {errors.title}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: TYPOGRAPHY.small.fontSize,
                      fontWeight: 500,
                      color: COLORS.textPrimary,
                      marginBottom: '6px'
                    }}>
                      Week Start Date
                    </label>
                    <input
                      type="date"
                      name="weekStart"
                      value={formData.weekStart}
                      onChange={handleInputChange}
                      style={{
                        ...COMPONENTS.input,
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px'
                      }}
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: TYPOGRAPHY.small.fontSize,
                      fontWeight: 500,
                      color: COLORS.textPrimary,
                      marginBottom: '6px'
                    }}>
                      Generation Method
                    </label>
                    <select
                      name="generationMethod"
                      value={formData.generationMethod}
                      onChange={handleInputChange}
                      style={{
                        ...COMPONENTS.input,
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px'
                      }}
                      disabled={loading}
                    >
                      {generationMethods.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                    <p style={{ ...TYPOGRAPHY.hint, margin: '8px 0 0 0' }}>
                      {generationMethods.find(m => m.value === formData.generationMethod)?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activities Section */}
              <div style={{ ...COMPONENTS.card, padding: SPACING.cardPadding }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{
                    ...TYPOGRAPHY.sectionTitle,
                    color: COLORS.textPrimary,
                    margin: 0
                  }}>
                    Activities
                  </h2>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Show/Hide Advanced button clicked');
                        setShowAdvanced(!showAdvanced);
                      }}
                      style={{
                        ...COMPONENTS.secondaryButton,
                        padding: '6px 12px',
                        borderRadius: SPACING.borderRadius.button,
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                      disabled={loading}
                    >
                      <SettingsIcon style={{ fontSize: '16px' }} />
                      {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={clearActivities}
                      style={{
                        ...COMPONENTS.secondaryButton,
                        padding: '6px 12px',
                        borderRadius: SPACING.borderRadius.button,
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        color: COLORS.error,
                        borderColor: COLORS.error
                      }}
                      disabled={loading || formData.activities.length <= 1}
                    >
                      <ClearAllIcon style={{ fontSize: '16px' }} />
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Activity Statistics */}
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '16px',
                  backgroundColor: formData.generationMethod === 'balanced' && formData.activities.length < 2 ? '#FEF3C7' : '#F3F4F6',
                  border: formData.generationMethod === 'balanced' && formData.activities.length < 2 ? `1px solid ${COLORS.warning}` : 'none',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AddIcon style={{ fontSize: '14px' }} />
                      Activities
                    </div>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      color: formData.generationMethod === 'balanced' && formData.activities.length < 2 ? '#92400E' : COLORS.textPrimary 
                    }}>
                      {formData.activities.length}
                    </div>
                    {formData.generationMethod === 'balanced' && formData.activities.length < 2 && (
                      <div style={{ fontSize: '11px', color: '#92400E', marginTop: '2px' }}>
                        Need 2+ for Balanced
                      </div>
                    )}
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TimerIcon style={{ fontSize: '14px' }} />
                      Total Duration
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textPrimary }}>
                      {totalDuration} min
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PriorityHighIcon style={{ fontSize: '14px' }} />
                      Avg Priority
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textPrimary }}>
                      {avgPriority.toFixed(1)}/5
                    </div>
                  </div>
                </div>

                {/* Activities List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {formData.activities.map((activity, index) => (
                    <div key={activity.id} style={{
                      ...COMPONENTS.card,
                      padding: '16px',
                      borderColor: errors[`activities.${index}.name`] || errors[`activities.${index}.duration`] ? COLORS.error : COLORS.border
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: COLORS.textPrimary }}>
                          Activity #{index + 1}
                        </h3>
                        
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => duplicateActivity(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '4px',
                              color: COLORS.textSecondary
                            }}
                            disabled={loading}
                            title="Duplicate"
                          >
                            <ContentCopyIcon style={{ fontSize: '18px' }} />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => removeActivity(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '4px',
                              color: COLORS.error
                            }}
                            disabled={loading || formData.activities.length <= 1}
                            title="Remove"
                          >
                            <DeleteIcon style={{ fontSize: '18px' }} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Activity Fields */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Name */}
                        <div>
                          <label style={{
                            display: 'block',
                            fontSize: TYPOGRAPHY.small.fontSize,
                            fontWeight: 500,
                            color: COLORS.textPrimary,
                            marginBottom: '6px'
                          }}>
                            Activity Name *
                          </label>
                          <input
                            type="text"
                            value={activity.name}
                            onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
                            placeholder="e.g., Morning Workout, Study Session"
                            style={{
                              ...COMPONENTS.input,
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: '6px'
                            }}
                            disabled={loading}
                          />
                          {errors[`activities.${index}.name`] && (
                            <div style={{ color: COLORS.error, fontSize: '13px', marginTop: '4px' }}>
                              {errors[`activities.${index}.name`]}
                            </div>
                          )}
                        </div>
                        
                        {/* Category and Duration */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: TYPOGRAPHY.small.fontSize,
                              fontWeight: 500,
                              color: COLORS.textPrimary,
                              marginBottom: '6px'
                            }}>
                              Category
                            </label>
                            <select
                              value={activity.category}
                              onChange={(e) => handleActivityChange(index, 'category', e.target.value)}
                              style={{
                                ...COMPONENTS.input,
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '6px'
                              }}
                              disabled={loading}
                            >
                              {activityCategories.map(category => (
                                <option key={category.value} value={category.value}>
                                  {category.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label style={{
                              display: 'block',
                              fontSize: TYPOGRAPHY.small.fontSize,
                              fontWeight: 500,
                              color: COLORS.textPrimary,
                              marginBottom: '6px'
                            }}>
                              Duration (min) *
                            </label>
                            <input
                              type="number"
                              value={activity.duration}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                // Allow empty or valid numbers
                                if (e.target.value === '' || (!isNaN(value) && value >= 1 && value <= 720)) {
                                  handleActivityChange(index, 'duration', value || '');
                                }
                              }}
                              min="1"
                              max="720"
                              step="5"
                              style={{
                                ...COMPONENTS.input,
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '6px'
                              }}
                              disabled={loading}
                            />
                            {errors[`activities.${index}.duration`] && (
                              <div style={{ color: COLORS.error, fontSize: '13px', marginTop: '4px' }}>
                                {errors[`activities.${index}.duration`]}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Advanced Fields */}
                        {showAdvanced && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label style={{
                                display: 'block',
                                fontSize: TYPOGRAPHY.small.fontSize,
                                fontWeight: 500,
                                color: COLORS.textPrimary,
                                marginBottom: '6px'
                              }}>
                                Priority (1-5)
                              </label>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                {[1, 2, 3, 4, 5].map(level => (
                                  <button
                                    key={level}
                                    type="button"
                                    onClick={() => handleActivityChange(index, 'priority', level)}
                                    style={{
                                      flex: 1,
                                      padding: '8px',
                                      border: `1px solid ${activity.priority === level ? COLORS.primary : COLORS.border}`,
                                      background: activity.priority === level ? COLORS.primary : 'white',
                                      color: activity.priority === level ? 'white' : COLORS.textPrimary,
                                      borderRadius: '4px',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      fontWeight: 500
                                    }}
                                    disabled={loading}
                                  >
                                    {level}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <label style={{
                                display: 'block',
                                fontSize: TYPOGRAPHY.small.fontSize,
                                fontWeight: 500,
                                color: COLORS.textPrimary,
                                marginBottom: '6px'
                              }}>
                                Preferred Time
                            </label>
                              <select
                                value={activity.timeOfDay}
                                onChange={(e) => handleActivityChange(index, 'timeOfDay', e.target.value)}
                                style={{
                                  ...COMPONENTS.input,
                                  width: '100%',
                                  padding: '10px 12px',
                                  borderRadius: '6px'
                                }}
                                disabled={loading}
                              >
                                {timeOfDayOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add Activity Button */}
                <button
                  type="button"
                  onClick={addActivity}
                  style={{
                    ...COMPONENTS.secondaryButton,
                    width: '100%',
                    padding: '12px',
                    borderRadius: SPACING.borderRadius.button,
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                  disabled={loading}
                >
                  <AddIcon style={{ fontSize: '18px' }} />
                  Add Another Activity
                </button>
              </div>
            </div>

            {/* Right Column - Summary & Actions */}
            <div>
              {/* Summary Card */}
              <div style={{ ...COMPONENTS.card, padding: SPACING.cardPadding, marginBottom: SPACING.gap.sections }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: COLORS.textPrimary,
                  margin: '0 0 16px 0'
                }}>
                  Generation Summary
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: COLORS.textSecondary, fontSize: TYPOGRAPHY.small.fontSize }}>Title:</span>
                    <span style={{ fontWeight: 500, color: COLORS.textPrimary }}>
                      {formData.title || 'Untitled Timetable'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: COLORS.textSecondary, fontSize: TYPOGRAPHY.small.fontSize }}>Method:</span>
                    <span style={{ fontWeight: 500, color: COLORS.textPrimary }}>
                      {generationMethods.find(m => m.value === formData.generationMethod)?.label}
                      {formData.generationMethod === 'balanced' && formData.activities.length < 2 && (
                        <span style={{ color: COLORS.warning, fontSize: '12px', marginLeft: '8px' }}>
                          ⚠️
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: COLORS.textSecondary, fontSize: TYPOGRAPHY.small.fontSize }}>Week Starts:</span>
                    <span style={{ fontWeight: 500, color: COLORS.textPrimary }}>
                      {new Date(formData.weekStart).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: COLORS.textSecondary, fontSize: TYPOGRAPHY.small.fontSize }}>Total Activities:</span>
                    <span style={{ fontWeight: 500, color: COLORS.textPrimary }}>
                      {formData.activities.length}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: COLORS.textSecondary, fontSize: TYPOGRAPHY.small.fontSize }}>Total Time:</span>
                    <span style={{ fontWeight: 500, color: COLORS.textPrimary }}>
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ ...COMPONENTS.card, padding: SPACING.cardPadding }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    type="submit"
                    disabled={loading || (formData.generationMethod === 'balanced' && formData.activities.length < 2)}
                    style={{
                      ...COMPONENTS.primaryButton,
                      padding: '12px 16px',
                      borderRadius: SPACING.borderRadius.button,
                      fontSize: TYPOGRAPHY.button.fontSize,
                      fontWeight: TYPOGRAPHY.button.fontWeight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: (loading || (formData.generationMethod === 'balanced' && formData.activities.length < 2)) ? 'not-allowed' : 'pointer',
                      opacity: (formData.generationMethod === 'balanced' && formData.activities.length < 2) ? 0.6 : 1,
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => !loading && !(formData.generationMethod === 'balanced' && formData.activities.length < 2) && (e.target.style.backgroundColor = COMPONENTS.primaryButton.hoverBackground)}
                    onMouseLeave={(e) => !loading && !(formData.generationMethod === 'balanced' && formData.activities.length < 2) && (e.target.style.backgroundColor = COMPONENTS.primaryButton.background)}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: `2px solid rgba(255,255,255,0.3)`,
                          borderTopColor: 'white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <DashboardIcon style={{ fontSize: '20px' }} />
                        Generate Timetable
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    style={{
                      ...COMPONENTS.secondaryButton,
                      padding: '10px 16px',
                      borderRadius: SPACING.borderRadius.button,
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = COMPONENTS.secondaryButton.hoverBackground)}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = COMPONENTS.secondaryButton.background)}
                  >
                    Reset Form
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Cancel button clicked');
                      navigate('/');
                    }}
                    disabled={loading}
                    style={{
                      background: 'none',
                      border: `1px solid ${COLORS.border}`,
                      color: COLORS.textSecondary,
                      padding: '10px 16px',
                      borderRadius: SPACING.borderRadius.button,
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#F3F4F6')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'transparent')}
                  >
                    Cancel
                  </button>
                </div>
                
                <p style={{
                  ...TYPOGRAPHY.hint,
                  margin: '16px 0 0 0',
                  textAlign: 'center',
                  lineHeight: 1.5
                }}>
                  * Required fields. Your timetable will be generated based on the activities and method selected.
                </p>
                
                {/* Warning for Balanced method */}
                {formData.generationMethod === 'balanced' && formData.activities.length < 2 && (
                  <p style={{
                    ...TYPOGRAPHY.hint,
                    margin: '12px 0 0 0',
                    textAlign: 'center',
                    lineHeight: 1.5,
                    color: COLORS.warning,
                    backgroundColor: '#FEF3C7',
                    padding: '8px',
                    borderRadius: '4px'
                  }}>
                    Balanced method requires 2+ activities
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* CSS Animation */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TimetableGenerator;