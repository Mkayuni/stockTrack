import React from 'react';
import './App.css';
import StockList from './components/StockList';  // Import the StockList component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-Time Stock Tracker</h1>
      </header>
      <main>
        <StockList />  {/* Display the StockList component */}
      </main>
    </div>
  );
}

export default App;
