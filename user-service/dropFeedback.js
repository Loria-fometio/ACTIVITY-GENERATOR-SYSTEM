const sequelize = require('./config/database');

const dropFeedbackTable = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // Drop the user_feedback table since it's managed by another service
    await sequelize.query('DROP TABLE IF EXISTS user_feedback;');
    console.log('user_feedback table dropped successfully.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
};

dropFeedbackTable();