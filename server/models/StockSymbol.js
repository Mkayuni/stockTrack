module.exports = (sequelize, DataTypes) => {
  const StockSymbol = sequelize.define('StockSymbol', {
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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

  StockSymbol.associate = (models) => {
    StockSymbol.hasMany(models.Stock, {
      foreignKey: 'stockSymbolId',
      as: 'stocks',
      onDelete: 'CASCADE', // Optional: ensures cascading delete
      onUpdate: 'CASCADE', // Optional: ensures cascading updates
    });
  };

  return StockSymbol;
};
