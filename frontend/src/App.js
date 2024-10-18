import React from 'react';
import {Route, Routes, BrowserRouter as Router, Link, useLocation} from "react-router-dom";
import './App.css';

import StockList from './components/StockList';
import Home from './components/Home';

// Seperated into MainApp b.c location needed to be within Router
function App() {
    return (
        <Router>
            <MainApp/>
        </Router>
    );
}

function MainApp() {
    const location = useLocation(); // Grabs current location (Home, StockList, etc)
    const useFullHeader = location.pathname === '/';

    return (
        <div className="App">
            <header className={useFullHeader ? "App-Header" : "App-Header Small"}>
                <div className={useFullHeader ? "App-Title" : "App-Title Small"}>
                    <h1>Real-Time Stock Tracker</h1>
                </div>

                <div className={useFullHeader ? "App-Right" : "App-Right Small"}>
                    <nav className="App-Routes">
                        <Link to="/">Home</Link>
                        <Link to="/stocks">Stocks</Link>
                    </nav>
                </div>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/stocks" element={<StockList/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;
