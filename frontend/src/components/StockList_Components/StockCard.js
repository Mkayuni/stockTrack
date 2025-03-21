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
import CircularProgress from "@mui/material/CircularProgress";

/** Definition for a card which holds stock information **/
export const StockCard = ({ stock, isSelected, onToggle, user, token, onUnfavorite = null}) => {
    const [height, setHeight] = useState('250px');
    const [stockPrices, setStockPrices] = useState([]);
    const [fetchError, setFetchError] = useState(null); // State for fetch error
    const [timeFrame, setTimeFrame] = useState("max");
    const [filteredStockPrices, setFilteredStockPrices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isStarred, setIsStarred] = useState(false);
    const [currentSector, setCurrentSector] = useState("Open");

    const [openPrice, setOpenPrice] = useState(0);
    const [closePrice, setClosePrice] = useState(0);
    const [highPrice, setHighPrice] = useState(0);
    const [lowPrice, setLowPrice] = useState(0);

    const [openPricePrev, setOpenPricePrev] = useState(0);
    const [closePricePrev, setClosePricePrev] = useState(0);
    const [highPricePrev, setHighPricePrev] = useState(0);
    const [lowPricePrev, setLowPricePrev] = useState(0);

    const [priceChanged, setPriceChanged] = useState("");
    const [isPricePos, setIsPricePos] = useState(false);
    const [isDayTrue, setIsDayTrue] = useState(false);

    // Check if Card is in favorites
    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            if (!user || !token) return;

            try {
                const res = await fetch(`http://localhost:3001/api/user-stocks/favorites/${stock.symbol}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const msg = await res.json();

                if (!res.ok) {
                    alert("Error: " + (msg.error || "Unknown error"));
                    return;
                }

                setIsStarred(msg.isFavorite);

            } catch (err) {
                alert("Network error: " + err.message);
            }
        };

        fetchFavoriteStatus();
    }, [user, token, stock.symbol]);

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
            setHeight('550px'); // Set height when expanded
            fetchData(); // Call fetchData only when expanded
        } else {
            setHeight('250px'); // Reset height when collapsed
        }
    }, [isSelected, stock.id]);

    // Get Latest stock prices
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const today = new Date();

                const res = await api.get(`http://localhost:3001/api/stocks/${stock.id}/prices/`, {});

                // Sort prices in descending order by date
                const sortedPrices = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));

                // Get distinct previous days
                const prevDays = [];
                const pricesByDay = {};

                // Iterate through sorted prices to group entries by distinct dates
                for (const price of sortedPrices) {
                    const priceDate = new Date(price.date).toISOString().split("T")[0]; // Format as YYYY-MM-DD
                    const todayDate = today.toISOString().split("T")[0];

                    if (priceDate === todayDate) {
                        // Skip today's date
                        continue;
                    }

                    if (!pricesByDay[priceDate]) {
                        pricesByDay[priceDate] = [];
                        prevDays.push(priceDate); // Track the order of unique previous days
                    }

                    pricesByDay[priceDate].push(price);

                    // Stop once we have the two previous days
                    if (prevDays.length === 2) {
                        break;
                    }
                }

                // Get the newest entries for the two previous days
                const result = prevDays.map((day) => {
                    const entries = pricesByDay[day];
                    // Assume the newest entry is the first one (sorted order)
                    return entries[0];
                });

                setOpenPrice(result[0].open);
                setClosePrice(result[0].close);
                setHighPrice(result[0].high);
                setLowPrice(result[0].low);

                setOpenPricePrev(result[1].open);
                setClosePricePrev(result[1].close);
                setHighPricePrev(result[1].high);
                setLowPricePrev(result[1].low);



            } catch (e) {
                alert("Failed to fetch stock prices: " + e);
                setFetchError('Failed to fetch stock prices');
            } finally {
                setLoading(false);
            }
        }

        fetchData().then(() => {
            update_price_change({
                open: openPricePrev,
                close: closePricePrev,
                high: highPricePrev,
                low: lowPricePrev,
            });
        });
    }, [stock.id, currentSector])

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
                setIsDayTrue(true);
                break;
            case '1W':
                past.setDate(latest.getDate() - 7);
                setIsDayTrue(false);
                break;
            case '1M':
                past.setDate(latest.getDate() - 30);
                setIsDayTrue(false);
                break;
            case '6M':
                past.setDate(latest.getDate() - (30 * 6));
                setIsDayTrue(false);
                break;
            case 'YTD':
                past.setFullYear(latest.getFullYear(), 0, 1);
                setIsDayTrue(false);
                break;
            case '1Y':
                past.setFullYear(latest.getFullYear() - 1);
                setIsDayTrue(false);
                break;
            case '5Y':
                past.setFullYear(latest.getFullYear() - 5);
                setIsDayTrue(false);
                break;
            default:
                setFilteredStockPrices(prices);
                setIsDayTrue(false);
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

    function update_price_change(prices) {

        let dif = 0;
        let sym = "";
        let arrow = "";
        let percent = 0;

        switch (currentSector) {
            case 'Open':
                dif = openPrice - openPricePrev;
                percent = (dif / openPrice) * 100;
                break;
            case 'Close':
                dif = closePrice - closePricePrev;
                percent = (dif / closePrice) * 100;
                break;
            case 'High':
                dif = highPrice - highPricePrev;
                percent = (dif / highPrice) * 100;
                break;
            case 'Low':
                dif = lowPrice - lowPricePrev;
                percent = (dif / lowPrice) * 100;
                break;
        }

        dif = parseFloat(dif.toFixed(2));
        percent = parseFloat(percent.toFixed(2));

        if (dif > 0) {
            sym = "+";
            arrow = "↑";
            setIsPricePos(true);
        }
        else if (dif < 0) {
            sym = "";
            arrow = "↓";
            setIsPricePos(false);
        } else {
            arrow = "-";
            setIsPricePos(null);
        }


        setPriceChanged(`${sym}${dif} (${percent}%) ${arrow}`)
    }

    return (

        <div
            className={isSelected ? `StockList-Card Expand` : `StockList-Card`}
            style={{height, transition : 'height 0.5s ease, box-shadow 0.3s ease'}}
            onClick={onToggle}
        >

            {loading ?
                <div style={{display : 'flex', justifyContent : 'center', alignItems : 'center', height : '100vh'}}>
                    <CircularProgress/>
                </div> : <>
                    <div className="StockList-Card-Title">
                        {stock.symbol}
                        {user === null ? "" : (isStarred ? (
                            <Star
                            style={{cursor : 'pointer', marginLeft : '8px'}}
                            onClick={async (event) => {
                                event.stopPropagation (); // Prevent card toggle
                                setIsStarred (false); // Set star to unfilled

                                // Removes a stock from favorite
                                try {

                                    const postData = {
                                        "stockSymbol" : stock.symbol,
                                    };

                                    if (onUnfavorite) onUnfavorite (stock.id);

                                    const res = await fetch (`http://localhost:3001/api/user-stocks/favorite`, {
                                        method : "DELETE",
                                        headers : {
                                            "Content-Type" : "application/json",
                                            "Authorization" : `Bearer ${token}`,

                                        },
                                        body : JSON.stringify (postData),
                                    });

                                    if (!res.ok) {
                                        const data = await res.json ();
                                        alert ("Error: " + data.error);
                                    }

                                } catch (e) {
                                    alert (e);
                                }

                            }}
                        />
                    ) : (
                        <StarBorder
                            style={{cursor : 'pointer', marginLeft : '8px'}}
                            onClick={async (event) => {
                                event.stopPropagation (); // Prevent card toggle
                                setIsStarred (true); // Set star to filled

                                // Add stock to favorite
                                try {

                                    const postData = {
                                        "stockSymbol" : stock.symbol,
                                    };

                                    const res = await fetch (`http://localhost:3001/api/user-stocks/favorite`, {
                                        method : "POST",
                                        headers : {
                                            "Content-Type" : "application/json",
                                            "Authorization" : `Bearer ${token}`,

                                        },
                                        body : JSON.stringify (postData),
                                    });

                                    if (!res.ok) {
                                        const data = await res.json ();
                                        alert ("Error: " + data.error);
                                    }

                                } catch (e) {
                                    alert (e);
                                }


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
                                <FormControl className="StockList-Card-Prices-Dropdown" sx={{m : 0, minWidth : 140}}
                                             fullWidth>
                                    <InputLabel id="StockList-Card-Prices-Dropdown-Label">Price Type</InputLabel>
                                    <Select
                                        labelId="StockList-Card-Prices-Dropdown-Label"
                                        id="StockList-Card-Prices-Dropdown"
                                        label="Price Type"
                                        value={currentSector}
                                        onChange={(event) => {
                                            setCurrentSector (event.target.value);
                                            //setLoading(true);
                                        }}
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

                            <StockGraph prices={filteredStockPrices} loading={loading} priceType={currentSector} isDay={isDayTrue} stock={stock}/>

                        </div>
                    ))}
                </div>

                <br/>

                <div className="StockList-Card-Bottom">
                    <div className="StockList-Card-Price">
                        <div>Open: ${openPrice}</div>
                        <div>Close: ${closePrice}</div>
                    </div>

                    <div className="StockList-Card-Price">
                        <div>High: ${highPrice}</div>
                        <div>Low: ${lowPrice}</div>
                    </div>

                    <div className="StockList-Card-Price">
                        <div>Mkt: ${numberToMoney (stock.marketCap)}</div>
                        <div
                            style={{color : isPricePos === true ? 'green' : isPricePos === false ? 'red' : 'black'}}>{priceChanged}</div>
                    </div>
                    <div className="StockList-Card-Icon"> {isSelected ? <ExpandLessIcon/> : <ExpandMoreIcon/>} </div>
                </div>
            </>}
        </div>
    );
};