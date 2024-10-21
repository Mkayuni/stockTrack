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

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);  // State for loading
    const [error, setError] = useState(null);  // State for error handling
    const [orderBy, setOrderBy] = useState("Newest"); // When orderBy updates
    const [currentSector, setSectors] = useState(""); // For filtering sectors from stocks
    const [searchBarInput, setSearchBar] = useState(""); // For filtering using the search bar
    const [selectedCards, setSelectedCards] = useState(new Set()); // Array of selected or clicked cards

    // Login
    const handleLogin = async (username, password) => {
        try {
            const response = await api.post('/api/users/login', {
                email: username,
                password: password
            });
            localStorage.setItem('authToken', response.data.token); // Save token in localStorage
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    // Automatically log in as an admin
    useEffect(() => {
        handleLogin('admin@example.com', 'adminpassword123');
    }, []);

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
            return (<StockCard stock={stock} isSelected={selectedCards.has(stock.id)} onToggle={() => toggleCardExpansion(stock.id)}/>)
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
