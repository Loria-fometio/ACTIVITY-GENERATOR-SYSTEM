const sequelize = require('./config/database');

const renameColumn = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // Rename column password to password_hash
    await sequelize.query('ALTER TABLE users CHANGE password password_hash VARCHAR(255) NOT NULL;');
    console.log('Column renamed successfully.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
};

renameColumn();