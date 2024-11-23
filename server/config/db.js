const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Path to your SQLite database
  logging: console.log,
});

sequelize.addHook('afterConnect', async (connection) => {
  try {
    await connection.query('PRAGMA foreign_keys = ON;');
    console.log('Foreign key constraints enabled for this connection.');
  } catch (error) {
    console.error('Error enabling foreign key constraints:', error.message);
  }
});

module.exports = sequelize;
