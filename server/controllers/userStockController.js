const { UserStocks, StockSymbol, Stock} = require('../models');

/**
 * Add or Toggle Favorite Status
 */
const addFavorite = async (req, res) => {
    const { stockSymbol } = req.body;
    const { email } = req.user;

    try {
        if (!stockSymbol) {
            return res.status(400).json({ error: 'Stock symbol is required.' });
        }

        // Gets the symbol id from the symbol
        const record = await StockSymbol.findOne({
            where: { symbol: stockSymbol },
        });

        const stockSymbolId = record.id;

        if (!stockSymbolId) return res.status(404).json({ error: 'Stock symbol not found.' });

        console.log(stockSymbolId);

        const [favorite, created] = await UserStocks.findOrCreate({
            where: { email, stockSymbolId },
            defaults: { favorite: true },
        });

        if (!created) {
            await favorite.update({ favorite: true });
            return res.status(200).json({ message: 'Stock is already in favorites and updated to favorite.' });
        }

        res.status(201).json({ message: 'Stock added to favorites.' });
    } catch (error) {
        console.error('Error adding favorite stock:', error.message);
        res.status(500).json({ error: 'Failed to add stock to favorites.' });
    }
};

/**
 * Get All Favorite Stocks for the User
 */
const getFavorites = async (req, res) => {
    const { email } = req.user;

    try {
        // Fetch all favorite UserStocks, including associated StockSymbol
        const favorites = await UserStocks.findAll({
            where: { email, favorite: true },
            include: [{
                model: StockSymbol,
                as: 'stockSymbol',  // Use the alias here
            }],
        });

        // Fetch all stocks
        const stocks = await Stock.findAll();

        // Map favorite stock symbols to a list
        const favoriteSymbols = favorites.map(fav => fav.stockSymbol.symbol); // Access the symbol from the associated StockSymbol

        // Filter stocks to include only those in the favorites list
        const favoriteStocks = stocks.filter(stock => favoriteSymbols.includes(stock.symbol)); // Compare stock.symbol

        // Return filtered stock objects
        res.status(200).json(favoriteStocks);
    } catch (error) {
        console.error('Error fetching favorite stocks:', error.message);
        res.status(500).json({ error: 'Failed to fetch favorites.' });
    }
};

/**
 * Check if a Specific Stock is Favorited
 */
const isFavorite = async (req, res) => {
    const { stockSymbol } = req.params;
    const { email } = req.user;

    try {

        if (!stockSymbol) {
            return res.status(400).json({ error: 'Stock symbol is required.' });
        }

        // Gets the symbol id from the symbol
        const record = await StockSymbol.findOne({
            where: { symbol: stockSymbol },
        });

        const stockSymbolId = record.id;

        const favorite = await UserStocks.findOne({
            where: { email, stockSymbolId },
        });

        res.status(200).json({ isFavorite: !!favorite && favorite.favorite });
    } catch (error) {
        console.error('Error checking favorite status:', error.message);
        res.status(500).json({ error: 'Failed to check favorite status.' });
    }
};

/**
 * Remove a Stock from Favorites
 */
const removeFavorite = async (req, res) => {
    const { stockSymbol } = req.body;
    const { email } = req.user;

    try {

        if (!stockSymbol) {
            return res.status(400).json({ error: 'Stock symbol is required.' });
        }

        // Gets the symbol id from the symbol
        const record = await StockSymbol.findOne({
            where: { symbol: stockSymbol },
        });

        const stockSymbolId = record.id;

        const favorite = await UserStocks.findOne({
            where: { email, stockSymbolId },
        });

        if (!favorite) {
            return res.status(404).json({ error: 'Stock not found in favorites.' });
        }

        favorite.favorite = false;
        await favorite.save();

        res.status(200).json({ message: 'Stock removed from favorites.' });
    } catch (error) {
        console.error('Error removing favorite stock:', error.message);
        res.status(500).json({ error: 'Failed to remove stock from favorites.' });
    }
};

/**
 * Export All Methods
 */
module.exports = {
    addFavorite,
    getFavorites,
    isFavorite,
    removeFavorite,
};
