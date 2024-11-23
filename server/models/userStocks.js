module.exports = (sequelize, DataTypes) => {
    const UserStocks = sequelize.define('UserStocks', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stockSymbolId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'StockSymbols',
                key: 'id',
            },
            allowNull: true, // Nullable if stock can exist without a symbol
        },
    }, {
        indexes: [
            {
                unique: true,
                fields: ['email', 'stockSymbolId'], // Enforces composite uniqueness
            },
        ],
    });

    UserStocks.associate = (models) => {
        UserStocks.belongsTo(models.StockSymbol, {
            foreignKey: 'stockSymbolId',
            as: 'stockSymbol',
            onDelete: 'SET NULL', // Adjust as per requirement
            onUpdate: 'CASCADE', // Adjust as per requirement
        });
    };

    return UserStocks;
};

