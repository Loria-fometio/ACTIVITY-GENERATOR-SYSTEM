require('dotenv').config();
const sequelize = require('./config/database');
const User = require('./models/user');

const showUsers = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    console.log('Users in database:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Created: ${user.createdAt}`);
    });

    if (users.length === 0) {
      console.log('No users found.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
};

showUsers();