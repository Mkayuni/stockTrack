'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Stocks', 'stockSymbolId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null first so you can update existing records
      references: {
        model: 'StockSymbols', // This references the StockSymbols table
        key: 'id',
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Stocks', 'stockSymbolId');
  }
};
