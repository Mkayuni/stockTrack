'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StockPrices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stockId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Stocks',
          key: 'id'
        },
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      open: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      close: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      high: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      low: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      volume: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StockPrices');
  }
};
