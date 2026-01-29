// src/services/service-adapters.js
import { mockUserService, mockActivityService, mockPreferenceService } from '../mock-services';

// Environment variable to toggle between mock and real services
const USE_MOCK_SERVICES = process.env.REACT_APP_USE_MOCK_SERVICES !== 'false';

// User Service Adapter
export const userService = {
  getCurrentUser: async () => {
    if (USE_MOCK_SERVICES) {
      console.log('📱 [MOCK] Fetching current user');
      return mockUserService.getCurrentUser();
    }
    
    // TODO: Replace with actual API call when user service exists
    // const response = await axios.get(`${userServiceContract.baseURL}${userServiceContract.endpoints.getCurrentUser}`);
    // return response.data;
    
    // Fallback to mock for now
    return mockUserService.getCurrentUser();
  },
  
  getUserById: async (userId) => {
    if (USE_MOCK_SERVICES) {
      console.log(`📱 [MOCK] Fetching user ${userId}`);
      return mockUserService.getUserById(userId);
    }
    
    // TODO: Actual API call
    return mockUserService.getUserById(userId);
  },
  
  validateUser: async (userId) => {
    if (!USE_MOCK_SERVICES) {
      // TODO: Actual validation API call
      // This would check if user exists in user service
    }
    
    return mockUserService.validateUser(userId);
  }
};

// Activity Service Adapter
export const activityService = {
  getUserActivities: async (userId) => {
    if (USE_MOCK_SERVICES) {
      console.log(`📱 [MOCK] Fetching activities for user ${userId}`);
      return mockActivityService.getUserActivities(userId);
    }
    
    // TODO: Actual API call
    return mockActivityService.getUserActivities(userId);
  },
  
  getActivityById: async (activityId) => {
    if (USE_MOCK_SERVICES) {
      console.log(`📱 [MOCK] Fetching activity ${activityId}`);
      return mockActivityService.getActivityById(activityId);
    }
    
    // TODO: Actual API call
    return mockActivityService.getActivityById(activityId);
  },
  
  validateActivity: async (activityId) => {
    // In real scenario, this would validate activity exists in activity service
    return mockActivityService.validateActivity(activityId);
  }
};

// Preference Service Adapter
export const preferenceService = {
  getUserPreferences: async (userId) => {
    if (USE_MOCK_SERVICES) {
      console.log(`📱 [MOCK] Fetching preferences for user ${userId}`);
      return mockPreferenceService.getUserPreferences(userId);
    }
    
    // TODO: Actual API call
    return mockPreferenceService.getUserPreferences(userId);
  },
  
  getTimetablePreferences: async (userId) => {
    if (USE_MOCK_SERVICES) {
      console.log(`📱 [MOCK] Fetching timetable preferences for user ${userId}`);
      return mockPreferenceService.getTimetablePreferences(userId);
    }
    
    // TODO: Actual API call
    return mockPreferenceService.getTimetablePreferences(userId);
  }
};