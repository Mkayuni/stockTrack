import React, {useEffect, useState} from 'react';
import api from '../services/api';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import SearchFields from "./SearchFields";

// Simplifies number to smaller format (1B or 2.03M)
function numberToMoney (num) {

    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1) + 'B'; // Billions
    } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + 'M'; // Millions
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + 'K'; // Thousands
    } else {
        return num.toString();
    }

}

// Definition for a card which holds stock information
const StockCard = (props) => (
    <div className="StockList-Card">
        <div className="StockList-Card-Title">{props.stock.symbol}</div>
        <div className="StockList-Card-Company">{props.stock.companyName}</div>
        <div className="StockList-Card-Sector">{props.stock.sector}</div>
        <br/>
        <br/>
        <div className="StockList-Card-MarketCap">${numberToMoney(props.stock.marketCap)}</div>
    </div>
);

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);  // State for loading
    const [error, setError] = useState(null);  // State for error handling
    const [orderBy, setOrderBy] = useState("Newest"); // When orderBy updates
    const [sortedStocks, setSortedStocks] = useState([]); // For Sorted Stocks
    const [currentSector, setSectors] = useState("");

    // Fetches data from database
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/stocks');  // Make sure your backend route is '/api/stocks'
                setStocks(response.data);  // Set fetched data to state
            } catch (err) {
                setError('Failed to fetch stock data');  // Handle errors
            } finally {
                setLoading(false);  // Stop loading after the request completes
            }
        };

        fetchData();
    }, []);

    // Sorts & Filters the cards based on OrderBy
    useEffect(() => {
        // Copy of the stocks array
        let sorted = [...stocks];

        /** Filters **/

        // Sector Filter
        if (currentSector !== "") sorted = sorted.filter(stock => stock.sector === currentSector);

        /** Sorting **/
        switch (orderBy) {
            case "Newest":
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "Oldest":
                sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case "Market Low":
                sorted.sort((a, b) => a.marketCap - b.marketCap);
                break;
            case "Market High":
                sorted.sort((a, b) => b.marketCap - a.marketCap);
                break;
        }

        setSortedStocks(sorted); // Update sorted stocks state
    }, [orderBy, stocks, currentSector]); // Re-run when orderBy or stocks or sectors change

    // Display a loading message while fetching data
    if (loading) {
        return <div>Loading...</div>;
    }

    // Display an error message if there's an issue
    if (error) {
        return <div>{error}</div>;
    }

    // Creates a list of cards from stock database
    function generateCards () {
        return sortedStocks.map(stock => {
            return (<StockCard stock={stock}/>)
        });
    }

    // Generate all the sector items that are in the database
    function generateSectorItems() {

        // Creates an array of all sectors with no duplicates from the stock db
        const sectors = [...new Set(stocks.map(stock => stock.sector))];

        return sectors.map((sector, index) => (
            <MenuItem key={sector} value={sector}> {sector} </MenuItem>
        ))
    }

    return (
        <div>
            <div className="StockList-Header">

                {/*** Search options ***/}
                <div className="StockList-Sector-OrderBy-Left">
                    {/* Sectors */}
                    <FormControl className="StockList-Sector" variant="filled" sx={{m : 0, minWidth : 270}}>
                        <InputLabel id="StockList-Sector">Sectors</InputLabel>
                        <Select
                            labelId="StockList-Sector"
                            id="StockList-Sector"
                            value={currentSector}
                            onChange={(event) => setSectors(event.target.value)}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>

                            {generateSectorItems()}

                        </Select>
                    </FormControl>

                    {/* Order By */}
                    <FormControl className="StockList-OrderBy" variant="filled" sx={{m : 0, minWidth : 270}}>
                        <InputLabel id="StockList-OrderBy">Order By</InputLabel>
                        <Select
                            labelId="StockList-OrderBy"
                            id="StockList-OrderBy"
                            value={orderBy}
                            onChange={(event) => setOrderBy(event.target.value)}
                        >
                            <MenuItem value={"Newest"}>Newest</MenuItem>
                            <MenuItem value={"Oldest"}>Oldest</MenuItem>
                            <MenuItem value={"Updated"}>Updated</MenuItem>
                            <MenuItem value={"Percent Change"}>Percent Change (high-to-low)</MenuItem>
                            <MenuItem value={"Price Low"}>Price (low-to-high)</MenuItem>
                            <MenuItem value={"Price High"}>Price (high-to-low)</MenuItem>
                            <MenuItem value={"Market Low"}>Market Value (low-to-high)</MenuItem>
                            <MenuItem value={"Market High"}>Market Value (high-to-low)</MenuItem>
                            <MenuItem value={"Percent Low"}>Percent Change (low-to-high)</MenuItem>
                            <MenuItem value={"Percent High"}>Percent Change (high-to-low)</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className="StockList-Search-Center">
                    <TextField
                        className="StockList-Search"
                        id="filled-search"
                        label="Search"
                        type="search"
                        variant="filled"
                        sx={{minWidth: '350px'}}
                    />
                </div>

                <div className="StockList-SearchFields">
                    <div className='StockList-Right-Space'/>
                    <SearchFields/>
                </div>

            </div>

            <div className="StockList-Cards">
                {stocks.length > 0 ? (
                    generateCards()
                ) : (
                    <li>No stocks available</li>  // If there are no stocks in the database
                )}
            </div>
        </div>
    );
};

export default StockList;
