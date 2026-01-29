// src/services/mock-services.js

// Mock User Service
export const mockUserService = {
  getCurrentUser: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: {
        userId: 'user_12345',
        username: 'demo_user',
        email: 'demo@example.com',
        isActive: true
      }
    };
  },
  
  getUserById: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Return mock user based on ID
    return {
      success: true,
      data: {
        userId: userId,
        username: `user_${userId.substring(0, 8)}`,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      }
    };
  },
  
  validateUser: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Always return valid for demo
    return {
      success: true,
      isValid: true,
      message: 'User is valid'
    };
  }
};

// Mock Activity Service
export const mockActivityService = {
  getUserActivities: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Return mock activities
    return {
      success: true,
      data: [
        {
          activityId: 'act_001',
          userId: userId,
          name: 'Morning Exercise',
          category: 'fitness',
          defaultDuration: 45,
          description: 'Daily workout routine',
          color: '#FF6B6B',
          isActive: true
        },
        {
          activityId: 'act_002',
          userId: userId,
          name: 'Read Technical Book',
          category: 'education',
          defaultDuration: 60,
          description: 'Learn new technologies',
          color: '#4ECDC4',
          isActive: true
        },
        {
          activityId: 'act_003',
          userId: userId,
          name: 'Meditation',
          category: 'wellness',
          defaultDuration: 20,
          description: 'Mindfulness practice',
          color: '#FFD166',
          isActive: true
        },
        {
          activityId: 'act_004',
          userId: userId,
          name: 'Project Work',
          category: 'productivity',
          defaultDuration: 120,
          description: 'Main project development',
          color: '#06D6A0',
          isActive: true
        }
      ]
    };
  },
  
  getActivityById: async (activityId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Return mock activity
    return {
      success: true,
      data: {
        activityId: activityId,
        name: `Activity ${activityId}`,
        category: 'general',
        defaultDuration: 30,
        description: 'Sample activity description'
      }
    };
  },
  
  validateActivity: async (activityId) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      isValid: true,
      message: 'Activity is valid'
    };
  }
};

// Mock Preference Service
export const mockPreferenceService = {
  getUserPreferences: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: {
        userId: userId,
        preferences: {
          theme: 'light',
          notifications: true,
          defaultGenerationMethod: 'balanced',
          preferredCategories: ['fitness', 'education', 'wellness'],
          timeConstraints: {
            morningStart: '07:00',
            eveningEnd: '22:00',
            maxDailyActivities: 5,
            maxActivityDuration: 120
          }
        }
      }
    };
  },
  
  getTimetablePreferences: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return {
      success: true,
      data: {
        userId: userId,
        timetablePreferences: {
          weekStartsOn: 'monday', // or 'sunday'
          includeWeekends: true,
          defaultActivityDuration: 45,
          categoryDistribution: {
            fitness: 2,    // 2 days per week
            education: 3,  // 3 days per week
            wellness: 2    // 2 days per week
          },
          timeSlots: [
            { time: '07:00', label: 'Morning' },
            { time: '12:00', label: 'Afternoon' },
            { time: '18:00', label: 'Evening' }
          ]
        }
      }
    };
  }
};