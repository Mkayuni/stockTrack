import React, {useEffect, useState} from "react";
import api from "../../services/api";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarBorder from '@mui/icons-material/StarBorder';

import StockGraph from './StockGraph';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {Star} from "@mui/icons-material";

/** Definition for a card which holds stock information **/
export const StockCard = ({ stock, isSelected, onToggle, user }) => {
    const [height, setHeight] = useState('160px');
    const [stockPrices, setStockPrices] = useState([]);
    const [fetchError, setFetchError] = useState(null); // State for fetch error
    const [timeFrame, setTimeFrame] = useState("max");
    const [filteredStockPrices, setFilteredStockPrices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isStarred, setIsStarred] = useState(false);
    const [currentSector, setCurrentSector] = useState("Open");


    // Retrieves the stock prices for the stock associated with this card
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/stocks/${stock.id}/order/prices`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
                });
                setStockPrices(response.data);
                //prompt(stockPrices[1].date);
            } catch (err) {
                console.error("Failed to fetch stock prices:", err);
                setFetchError('Failed to fetch stock prices'); // Set error state
            } finally {
                setLoading(false);
            }
        };

        if (isSelected) {
            setHeight('450px'); // Set height when expanded
            fetchData(); // Call fetchData only when expanded
        } else {
            setHeight('160px'); // Reset height when collapsed
        }
    }, [isSelected, stock.id]);

    // Handles filtering and sorting of prices
    useEffect(() => {

        setLoading(true);
        let prices = [...stockPrices];

        prices = prices.filter(price => !isNaN(new Date(price.date).getTime()));

        if (prices[0] == null) return;

        // Get latest date
        const latest = new Date(prices[prices.length - 1].date);

        //alert(latest)

        // Get the min based on time frame
        const past = new Date(latest);

        /** NEED TO UPDATE IF SAT and SUN don't have stocks!!! **/
        switch (timeFrame) {
            case '1D':
                past.setDate(latest.getDate() - 1);
                break;
            case '1W':
                past.setDate(latest.getDate() - 7);
                break;
            case '1M':
                past.setDate(latest.getDate() - 30);
                break;
            case '6M':
                past.setDate(latest.getDate() - (30 * 6));
                break;
            case 'YTD':
                past.setFullYear(latest.getFullYear(), 0, 1);
                break;
            case '1Y':
                past.setFullYear(latest.getFullYear() - 1);
                break;
            case '5Y':
                past.setFullYear(latest.getFullYear() - 5);
                break;
            default:
                setFilteredStockPrices(prices);
                setLoading(false);
                return;
        }


        // Filter based on time frame
        prices = prices.filter(price => {
            const date = new Date(price.date);
            return date >= past && date <= latest;
        });

        setFilteredStockPrices(prices);
        setLoading(false);

    }, [timeFrame, stockPrices]);

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

    return (

        <div
            className={isSelected ? `StockList-Card Expand` : `StockList-Card`}
            style={{height, transition : 'height 0.5s ease, box-shadow 0.3s ease'}}
            onClick={onToggle}
        >
            <div className="StockList-Card-Title">
                {stock.symbol}
                {user === null ? "" : (isStarred ? (
                        <Star
                            style={{cursor : 'pointer', marginLeft : '8px'}}
                            onClick={(event) => {
                                event.stopPropagation (); // Prevent card toggle
                                setIsStarred (false); // Set star to unfilled
                            }}
                        />
                    ) : (
                        <StarBorder
                            style={{cursor : 'pointer', marginLeft : '8px'}}
                            onClick={(event) => {
                                event.stopPropagation (); // Prevent card toggle
                                setIsStarred (true); // Set star to filled
                            }}
                        />
                    ))}
            </div>
            <div className="StockList-Card-Company">{stock.companyName}</div>
            <div className="StockList-Card-Sector">{stock.sector}</div>
            <br/>

            {/** Graph **/}
            <div className={`StockList-Card-Graph ${isSelected ? 'Expanded' : ''}`}>
                {isSelected && (fetchError ? (
                    <div>{fetchError}</div> // Display error if fetching fails
                ) : (
                    <div onClick={(event) => {
                        event.stopPropagation ();
                    }} style={{cursor : 'default'}}>

                        <div className="StockList-Card-Prices">
                            <FormControl className="StockList-Card-Prices-Dropdown" sx={{m : 0, minWidth : 140}} fullWidth>
                                <InputLabel id="StockList-Card-Prices-Dropdown-Label">Price Type</InputLabel>
                                <Select
                                    labelId="StockList-Card-Prices-Dropdown-Label"
                                    id="StockList-Card-Prices-Dropdown"
                                    label="Price Type"
                                    value={currentSector}
                                    onChange={(event) => setCurrentSector(event.target.value)}
                                >
                                    <MenuItem value="Closed">Closed Price</MenuItem>
                                    <MenuItem value="Open">Open Price</MenuItem>
                                    <MenuItem value="High">High Price</MenuItem>
                                    <MenuItem value="Low">Low Price</MenuItem>

                                </Select>
                            </FormControl>
                        </div>

                        <div className="StockList-Card-Graph-Buttons">
                            {['1D', '1W', '1M', '6M', 'YTD', '1Y', '5Y', 'Max'].map ((label) => (
                                <button
                                    key={label}
                                    onClick={(event) => {
                                        event.stopPropagation (); // Prevent card toggle on button click
                                        setTimeFrame (label);
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <StockGraph prices={filteredStockPrices} loading={loading} priceType={currentSector} />

                    </div>
                ))}
            </div>

            <br/>

            <div className="StockList-Card-Bottom">
                <div className="StockList-Card-MarketCap">${numberToMoney (stock.marketCap)}</div>
                <div className="StockList-Card-Icon"> {isSelected ? <ExpandLessIcon/> : <ExpandMoreIcon/>} </div>
            </div>
        </div>
    );
};