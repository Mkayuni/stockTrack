module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define('Stock', {
      symbol: {
        type: DataTypes.STRING,
        allowNull: false
      },
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
  
    return Stock;
  };
  