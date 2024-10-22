module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    companyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sector: {
      type: DataTypes.STRING
    },
    marketCap: {
      type: DataTypes.DECIMAL
    },
    stockSymbolId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'StockSymbols',  // Referencing the StockSymbol table
        key: 'id'
      },
      allowNull: true  // Make it nullable initially
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  // Set up associations
  Stock.associate = (models) => {
    Stock.belongsTo(models.StockSymbol, { foreignKey: 'stockSymbolId', as: 'stockSymbol' });
  };

  return Stock;
};
