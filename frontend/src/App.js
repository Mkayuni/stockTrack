import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import './App.css';

import LoginComponent from './components/LoginComponent';
import StockList from './components/StockList';
import Home from './components/Home';
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import ProfileIcon from "./components/ProfileIcon";
import AdminPanel from "./components/adminPanel";
import Settings from "./components/Settings";
import { useUser } from "./globals/globalUser"; // Correct import of useUser
import Portfolio from "./components/Portfolio";

// Separated into MainApp because location needed to be within Router
function App() {
    return (
        <Router>
            <MainApp />
        </Router>
    );
}

function MainApp() {
    const { user, setUser } = useUser(); // Correct usage of useUser hook
    const [userToken, setUserToken] = useState(null);

    // Grab the current page and check if it is the home page
    const location = useLocation();
    const useFullHeader = location.pathname === '/';

    // Handles displaying profile picture
    function displayProfilePicture(user) {
        // If no user, show sign in
        if (user === null || user === undefined || user.length === 0) {
            return (<LoginComponent setUser={setUser} setUserToken={setUserToken} />);
        }

        // Otherwise, show profile
        return (<ProfileIcon user={user} setUser={setUser} setUserToken={setUserToken} />);
    }

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

                    {displayProfilePicture(user)} {/* Show either profile picture or login */}
                </div>
            </header>

            <main>
                <Routes>
                    <Route path="/stocks" element={<StockList user={user} token={userToken}/>} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/admin-panel" element={<AdminPanel token={userToken} user={user} />} />
                    <Route path="/settings" element={<Settings token={userToken} />} />
                    <Route path="/portfolio" element={<Portfolio token={userToken} user = {user} />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
