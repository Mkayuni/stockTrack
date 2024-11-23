module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Optional: if each stock symbol must be unique
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
    },
    marketCap: {
      type: DataTypes.DECIMAL(20, 2), // Optional: Adjust precision/scale as needed
    },
    stockSymbolId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'StockSymbols',
        key: 'id',
      },
      allowNull: true, // Nullable if stock can exist without a symbol
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
    Stock.belongsTo(models.StockSymbol, {
      foreignKey: 'stockSymbolId',
      as: 'stockSymbol',
      onDelete: 'SET NULL', // Optional: Adjust to 'CASCADE' if required
      onUpdate: 'CASCADE', // Optional: Ensure updates in StockSymbol reflect here
    });
  };

  return Stock;
};
