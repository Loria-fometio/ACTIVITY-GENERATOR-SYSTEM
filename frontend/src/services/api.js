const API_BASE_URL = 'http://localhost:5001/api/timetables';

const timetableAPI = {
  // Get all timetables
  getAll: async () => {
    try {
      const response = await fetch(API_BASE_URL);
      return await response.json();
    } catch (error) {
      console.error('Error fetching timetables:', error);
      return { success: false, data: [] };
    }
  },

  // Generate timetable
  generate: async (data) => {
    try {
      console.log('📡 Sending generate request...');
      
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating timetable:', error);
      throw error;
    }
  },

  // ✅ ADD THIS: Get timetable by ID
  getById: async (id) => {
    try {
      console.log(`📡 Fetching timetable with ID: ${id}`);
      const response = await fetch(`${API_BASE_URL}/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching timetable:', error);
      throw error;
    }
  },

  // ✅ ADD THIS: Complete activity
  completeActivity: async (activityId, data) => {
    try {
      console.log(`📡 Completing activity: ${activityId}`);
      const response = await fetch(`${API_BASE_URL}/activity/${activityId}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error completing activity:', error);
      throw error;
    }
  },

  // Delete timetable
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting timetable:', error);
      throw error;
    }
  }
};

export default timetableAPI;