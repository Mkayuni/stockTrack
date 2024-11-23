const {UserStocks} = require('../models');

// Creates a new entry in the user stock table
const createUserStock = async (req, res) => {
    const {email, id} = req.body;

    // Check to make sure email and id are valid

    // Create new entry
    try {
        const item = await UserStocks.create({email: email, stockSymbolId: id});
    }
    catch (error) {
        console.log(error);
    }


};

const deleteUserStock = async (req, res) => {

};

module.exports = {createUserStock, deleteUserStock}