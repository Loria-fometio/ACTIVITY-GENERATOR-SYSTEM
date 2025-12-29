const sequelize = require('./config/database');

const describeTable = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const [results] = await sequelize.query('DESCRIBE users;');
    console.log('Table structure:');
    console.log(results);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
};

describeTable();