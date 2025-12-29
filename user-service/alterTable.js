const sequelize = require('./config/database');

const alterTable = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // Rename column password to password_hash
    await sequelize.query('ALTER TABLE users CHANGE password password_hash VARCHAR(255) NOT NULL;');
    console.log('Column renamed successfully.');

    // Add missing columns
    await sequelize.query('ALTER TABLE users ADD COLUMN goal VARCHAR(50) DEFAULT NULL;');
    await sequelize.query('ALTER TABLE users ADD COLUMN skill_level VARCHAR(20) DEFAULT NULL;');
    await sequelize.query('ALTER TABLE users ADD COLUMN available_time INT DEFAULT NULL;');
    console.log('Columns added successfully.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
};

alterTable();