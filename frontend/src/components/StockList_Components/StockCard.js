import {useEffect, useState} from "react";
import api from "../../services/api";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import StockGraph from './StockGraph';

/** Definition for a card which holds stock information **/
export const StockCard = ({ stock, isSelected, onToggle }) => {
    const [height, setHeight] = useState('160px');
    const [stockPrices, setStockPrices] = useState([]);
    const [fetchError, setFetchError] = useState(null); // State for fetch error

    // Retrieves the stock prices for the stock associated with this card
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/stocks/${stock.id}/prices`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
                });
                setStockPrices(response.data);
                //prompt(stockPrices[1].date);
            } catch (err) {
                console.error("Failed to fetch stock prices:", err);
                setFetchError('Failed to fetch stock prices'); // Set error state
            }
        };

        if (isSelected) {
            setHeight('400px'); // Set height when expanded
            fetchData(); // Call fetchData only when expanded
        } else {
            setHeight('160px'); // Reset height when collapsed
        }
    }, [isSelected, stock.id]);

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
            style={{ height, transition: 'height 0.5s ease, box-shadow 0.3s ease' }}
            onClick={onToggle}
        >
            <div className="StockList-Card-Title">{stock.symbol}</div>
            <div className="StockList-Card-Company">{stock.companyName}</div>
            <div className="StockList-Card-Sector">{stock.sector}</div>
            <br />

            {/** Graph **/}
            <div className={`StockList-Card-Graph ${isSelected ? 'Expanded' : ''}`}>
                {isSelected && (fetchError ? (
                    <div>{fetchError}</div> // Display error if fetching fails
                ) : (
                    <div>
                        <div className="StockList-Card-Graph-Buttons">
                            {['1D', '1W', '1M', '6M', 'YTD', '1Y', '5Y', 'Max'].map((label) => (
                                <button
                                    key={label}
                                    onClick={(event) => {
                                        event.stopPropagation(); // Prevent card toggle on button click
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <StockGraph prices={stockPrices}/>
                    </div>
            ))}
        </div>

    <br/>

    <div className="StockList-Card-Bottom">
        <div className="StockList-Card-MarketCap">${numberToMoney(stock.marketCap)}</div>
        <div className="StockList-Card-Icon"> {isSelected ? <ExpandLessIcon/> : <ExpandMoreIcon/>} </div>
            </div>
        </div>
    );
};