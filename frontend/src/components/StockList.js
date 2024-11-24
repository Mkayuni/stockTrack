import React, {useEffect, useState} from 'react';
import { useMemo } from 'react';
import api from '../services/api';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import {Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

import {StockCard} from "./StockList_Components/StockCard"
import SearchFields from "./StockList_Components/SearchFields";

Chart.register(...registerables);

const StockList = ({user}) => {
    const [stocks, setStocks] = useState([]);
    const [latestStocksPrices, setLatestStockPrices] = useState([]);
    const [loading, setLoading] = useState(true);  // State for loading
    const [error, setError] = useState(null);  // State for error handling
    const [orderBy, setOrderBy] = useState("Newest"); // When orderBy updates
    const [currentSector, setSectors] = useState(""); // For filtering sectors from stocks
    const [searchBarInput, setSearchBar] = useState(""); // For filtering using the search bar
    const [selectedCards, setSelectedCards] = useState(new Set()); // Array of selected or clicked cards

    // Fetches data from database
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/stocks');  // Make sure your backend route is '/api/stocks'
                setStocks(response.data);  // Set fetched data to state

                // Create an array of promises for fetching latest prices
                const pricePromises = response.data.map(async (stock) => {
                    try {
                        const res = await api.get(`http://localhost:3001/api/stocks/${stock.id}/prices/latest`);
                        return { stockId: stock.id, latest: res.data }; // Return stock ID and latest data
                    } catch (error) {
                        console.error(`Failed to fetch latest prices for Stock ID: ${stock.id}`, error);
                        return null; // Handle errors gracefully
                    }
                });

                const latestPrices = await Promise.all(pricePromises);
                const validPrices = latestPrices.filter((price) => price !== null);
                setLatestStockPrices(validPrices);

            } catch (err) {
                setError('Failed to fetch stock data');  // Handle errors
            } finally {
                setLoading(false);  // Stop loading after the request completes
            }
        };

        fetchData();
    }, []);

    // Sorts & Filters the cards based on OrderBy (Live Sorting & Filtering)
    const filteredAndSortedStocks  = useMemo(() => {
        // Copy of the stocks array
        let sorted = [...stocks];

        /** Filters **/

        // Sector Filter
        if (currentSector !== "") sorted = sorted.filter(stock => stock.sector === currentSector);

        // Searchbar Filter
        if (searchBarInput !== "") sorted = sorted.filter(stock => stock.companyName.toLowerCase().includes(searchBarInput.toLowerCase()) || stock.symbol.toLowerCase().includes(searchBarInput.toLowerCase()));


        //setSelectedCards(new Set()); Remove comment to have cards reset expanded section after sorting **NEEDS EDITING **

        /** Sorting **/
        switch (orderBy) {
            case "Newest":
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case "Oldest":
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case "Price Open High":
                return sorted.sort((a, b) => {
                    const latestA = latestStocksPrices.find(price => price.stockId === a.id).latest.open
                    const latestB = latestStocksPrices.find(price => price.stockId === b.id).latest.open
                    return latestB - latestA;
                });
            case "Price Open Low":
                return sorted.sort((a, b) => {
                    const latestA = latestStocksPrices.find(price => price.stockId === a.id).latest.open
                    const latestB = latestStocksPrices.find(price => price.stockId === b.id).latest.open
                    return latestA - latestB;
                });
            case "Price Close High":
                return sorted.sort((a, b) => {
                    const latestA = latestStocksPrices.find(price => price.stockId === a.id).latest.close
                    const latestB = latestStocksPrices.find(price => price.stockId === b.id).latest.close
                    return latestB - latestA;
                });
            case "Price Close Low":
                return sorted.sort((a, b) => {
                    const latestA = latestStocksPrices.find(price => price.stockId === a.id).latest.close
                    const latestB = latestStocksPrices.find(price => price.stockId === b.id).latest.close
                    return latestA - latestB;
                });
            case "Price Low High":
                return sorted.sort((a, b) => {
                    const latestA = latestStocksPrices.find(price => price.stockId === a.id).latest.low
                    const latestB = latestStocksPrices.find(price => price.stockId === b.id).latest.low
                    return latestB - latestA;
                });
            case "Price Low Low":
                return sorted.sort((a, b) => {
                    const latestA = latestStocksPrices.find(price => price.stockId === a.id).latest.low
                    const latestB = latestStocksPrices.find(price => price.stockId === b.id).latest.low
                    return latestA - latestB;
                });
            case "Price High High":
                return sorted.sort((a, b) => {
                    const latestA = latestStocksPrices.find(price => price.stockId === a.id).latest.high
                    const latestB = latestStocksPrices.find(price => price.stockId === b.id).latest.high
                    return latestB - latestA;
                });
            case "Price High Low":
                return sorted.sort((a, b) => {
                    const latestA = latestStocksPrices.find(price => price.stockId === a.id).latest.high
                    const latestB = latestStocksPrices.find(price => price.stockId === b.id).latest.high
                    return latestA - latestB;
                });
            case "Market Low":
                return sorted.sort((a, b) => a.marketCap - b.marketCap);
            case "Market High":
                return sorted.sort((a, b) => b.marketCap - a.marketCap);
            default:
                return sorted;
        }

    }, [orderBy, stocks, currentSector, searchBarInput]); // Re-run when orderBy or stocks or sectors change

    // Toggle card expansion
    const toggleCardExpansion = (stockId) => {
        setSelectedCards(prev => {
            const newExpanded = new Set(prev);

            if (newExpanded.has(stockId)) newExpanded.delete(stockId); // Collapse if already expanded
            else newExpanded.add(stockId); // Expand if not expanded

            return newExpanded;
        });
    };

    // Display a loading message while fetching data
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    // Display an error message if there's an issue
    if (error) {
        return <div>{error}</div>;
    }

    // Creates a list of cards from stock database
    function generateCards () {
        return filteredAndSortedStocks.map(stock => {
            return (<StockCard stock={stock} isSelected={selectedCards.has(stock.id)} user={user} onToggle={() => toggleCardExpansion(stock.id)}/>)
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
                            <MenuItem value={"Newest"}>Newly Added</MenuItem>
                            <MenuItem value={"Oldest"}>First Added</MenuItem>
                            <MenuItem value={"Price Open High"}>Open Price (high-to-low)</MenuItem>
                            <MenuItem value={"Price Open Low"}>Open Price (low-to-high)</MenuItem>
                            <MenuItem value={"Price Close High"}>Close Price (high-to-low)</MenuItem>
                            <MenuItem value={"Price Close Low"}>Close Price (low-to-high)</MenuItem>
                            <MenuItem value={"Price Low High"}>Low Price (high-to-low)</MenuItem>
                            <MenuItem value={"Price Low Low"}>Low Price (low-to-high)</MenuItem>
                            <MenuItem value={"Price High High"}>High Price (high-to-low)</MenuItem>
                            <MenuItem value={"Price High Low"}>High Price (low-to-high)</MenuItem>
                            <MenuItem value={"Market Low"}>Market Value (low-to-high)</MenuItem>
                            <MenuItem value={"Market High"}>Market Value (high-to-low)</MenuItem>
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
                        value={searchBarInput}
                        onChange={(event) => setSearchBar(event.target.value)}
                        sx={{minWidth: '350px'}}
                    />
                </div>

                <div className="StockList-SearchFields">
                    <div className='StockList-Right-Space'/>
                    <SearchFields/>
                </div>

            </div>

            <div className={stocks.length > 0 && filteredAndSortedStocks.length > 0 ? "StockList-Cards" : "StockList-Empty"}>
                {stocks.length > 0 ? (
                    filteredAndSortedStocks.length > 0 ? (
                        generateCards()
                    ) : (
                        <div>
                            <h1> No stocks matches your search conditions. <br/> <em> Try reducing your restrictions. </em> </h1>
                        </div>  // If there are no stocks in the search conditions
                    )
                ) : (
                    <div> <h1> No stocks available</h1> </div>  // If there are no stocks in the database
                )}
            </div>
        </div>
    );
};

export default StockList;
