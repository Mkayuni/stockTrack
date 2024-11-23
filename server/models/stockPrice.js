module.exports = (sequelize, DataTypes) => {
  const StockPrice = sequelize.define(
    'StockPrice',
    {
      stockId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Stocks', // Updated to match the table name in the database
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE', // Ensure cascading delete
        onUpdate: 'CASCADE', // Ensure cascading updates
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      open: {
        type: DataTypes.DECIMAL(10, 2), // Define precision for DECIMAL
        allowNull: false,
      },
      close: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      high: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      low: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      volume: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      tableName: 'StockPrices', // Explicitly specify the table name
      timestamps: true, // Ensure createdAt and updatedAt fields are included
    }
  );

  // Define associations for StockPrice
  StockPrice.associate = (models) => {
    StockPrice.belongsTo(models.Stock, {
      foreignKey: 'stockId',
      as: 'stock', // Alias for the association
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return StockPrice;
};
