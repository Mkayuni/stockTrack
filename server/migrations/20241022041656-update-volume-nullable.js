'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('StockPrices', 'volume', {
      type: Sequelize.BIGINT,
      allowNull: true,  // Allow null values
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('StockPrices', 'volume', {
      type: Sequelize.BIGINT,
      allowNull: false,  // Revert to not allowing null values
    });
  }
};
