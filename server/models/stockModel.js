module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
    },
    marketCap: {
      type: DataTypes.DECIMAL,
    },
    stockSymbolId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'StockSymbols',
        key: 'id',
      },
      allowNull: true, // Nullable initially
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Stock.associate = (models) => {
    Stock.belongsTo(models.StockSymbol, { foreignKey: 'stockSymbolId', as: 'stockSymbol' });
  };

  return Stock;
};
