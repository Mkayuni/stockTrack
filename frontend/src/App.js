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

    return (
        <div className="App">
            <header className={location.pathname === "/stocks" ? "App-Header Small" : "App-Header"}>
                <div className={location.pathname === "/stocks" ? "App-Title Small" : "App-Title"}>
                    <h1>Real-Time Stock Tracker</h1>
                </div>

                <div className="App-Right">
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
