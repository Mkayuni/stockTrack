'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Stocks', 'stockSymbolId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'StockSymbols',  // The table being referenced
        key: 'id'
      },
      allowNull: true  // Make it nullable initially
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Stocks', 'stockSymbolId');
  }
};
