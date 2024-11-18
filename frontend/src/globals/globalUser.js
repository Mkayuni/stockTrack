import React, { createContext, useContext, useState } from "react";

// Create context
const UserContext = createContext();

// Provider component to wrap the app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Set initial user state

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);