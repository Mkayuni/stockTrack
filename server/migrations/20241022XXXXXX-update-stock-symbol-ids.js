'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column already exists before adding it
    const tableInfo = await queryInterface.describeTable('Stocks');
    
    if (!tableInfo.stockSymbolId) {
      await queryInterface.addColumn('Stocks', 'stockSymbolId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'StockSymbols',  // The table being referenced
          key: 'id'
        },
        allowNull: true  // You can adjust this based on your requirements
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Stocks', 'stockSymbolId');
  }
};
