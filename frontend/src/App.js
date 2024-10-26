import React, {useState} from 'react';
import {Route, Routes, BrowserRouter as Router, Link, useLocation} from "react-router-dom";
import './App.css';

import LoginComponent from './components/LoginComponent';
import StockList from './components/StockList';
import Home from './components/Home';
import Avatar from '@mui/material/Avatar';
import SignUp from "./components/SignUp";



// Seperated into MainApp b.c location needed to be within Router
function App() {
    return (
        <Router>
            <MainApp/>
        </Router>
    );
}

function displayProfilePicture(user) {

    if (user === null || user === undefined || user.length === 0) {
        return;
    }

    return (<div className="App-Right-Profile"><Avatar>?</Avatar></div>);
        }

        function MainApp() {

            const [user, setUser] = useState([]); // Empty or null if user is not logged in

    // Grab the current page and check if it is the home page
    const location = useLocation();
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

                    {user.length === 0 ? <LoginComponent/> : ""}

                    {displayProfilePicture(user)}

                </div>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/stocks" element={<StockList/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;
