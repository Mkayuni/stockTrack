import React, { useEffect, useState } from 'react';
import api from '../services/api';

// Simplifies number to smaller format (1B or 2.03M)
function numberToMoney(num) {

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

  if (loading) {
    return <div>Loading...</div>;  // Display a loading message while fetching data
  }

  if (error) {
    return <div>{error}</div>;  // Display an error message if there's an issue
  }

  // Creates a list of cards from stock database
  function generateCards(){
    return stocks.map(stock => {
      return (<StockCard stock={stock}/>)
    });
  }

  return (
    <div>

      <div className="StockList-Header">

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
