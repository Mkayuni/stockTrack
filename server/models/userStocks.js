module.exports = (sequelize, DataTypes) => {
    const UserStocks = sequelize.define(
        'UserStocks',
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true, // Set as part of composite primary key
            },
            stockSymbolId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'StockSymbols',
                    key: 'id',
                },
                allowNull: false, // Ensure stock association is required
                primaryKey: true, // Set as part of composite primary key
            },
            favorite: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true, // Default to favorite
            },
        },
        {
            timestamps: true, // Add createdAt and updatedAt fields
            indexes: [
                {
                    unique: true,
                    fields: ['email', 'stockSymbolId'], // Enforce composite uniqueness
                },
            ],
            id: false, // Disable default id column
        }
    );

    UserStocks.associate = (models) => {
        UserStocks.belongsTo(models.StockSymbol, {
            foreignKey: 'stockSymbolId',
            as: 'stockSymbol',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    };

    return UserStocks;
};
