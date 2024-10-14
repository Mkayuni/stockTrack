import React, { useEffect, useState } from 'react';
import api from '../services/api';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);  // State for loading
  const [error, setError] = useState(null);  // State for error handling

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/stocks');  // Make sure your backend route is '/api/stocks'
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

  return (
    <div>
      <h1>Stock List</h1>
      <ul>
        {stocks.length > 0 ? (
          stocks.map(stock => (
            <li key={stock.id}>{stock.companyName} - {stock.symbol}</li>
          ))
        ) : (
          <li>No stocks available</li>  // If there are no stocks in the database
        )}
      </ul>
    </div>
  );
};

export default StockList;
