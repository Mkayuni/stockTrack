module.exports = (sequelize, DataTypes) => {
  const StockPrice = sequelize.define(
    'StockPrice',
    {
      stockId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Stock', // Referencing the Stock table
          key: 'id',
        },
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      open: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      close: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      high: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      low: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      volume: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      tableName: 'StockPrices', // Explicitly specify the table name
    }
  );

  StockPrice.associate = (models) => {
    StockPrice.belongsTo(models.Stock, { foreignKey: 'stockId' });
  };

  return StockPrice;
};
