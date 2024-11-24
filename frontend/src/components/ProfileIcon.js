import React, { useState } from "react";
import { Avatar, Typography, Button, Popover, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../globals/globalUser";  // Import the custom hook

export default function ProfileIcon() {
    const { user, setUser } = useUser();  // Use the global user state
    const [anchorEl, setAnchorEl] = useState(null);
    const nav = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "profile-popover" : undefined;

    function logout() {
        setUser(null);
        nav("/");
    }

    function to_portfolio() {
        nav("/portfolio");
    }

    function to_settings() {
        nav("/settings");
    }

    function to_admin_panel() {
        nav("/admin-panel");
    }

    function get_greeting() {
        const hours = new Date(Date.now()).getHours();

        if (hours >= 5 && hours < 12) return "Good Morning";
        if (hours >= 12 && hours < 17) return "Good Afternoon";
        if (hours >= 17 && hours < 21) return "Good Evening";

        return "Good Night";
    }

    return (
        <>
            <div className="App-Right-Profile" onClick={handleClick}>
                <Avatar>{user.firstName.charAt(0) + user.lastName.charAt(0)}</Avatar>
            </div>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Typography sx={{ p: 1, textAlign: "center", borderBottom: "2px solid #ccc" }}>
                    {get_greeting() + ", " + user.firstName}!
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {user.role === "admin" ? (
                        <Button style={{ width: "100%" }} onClick={to_admin_panel}>
                            Admin Panel
                        </Button>
                    ) : null}
                    <Button onClick={to_portfolio} style={{ width: "100%" }}>Portfolio</Button>
                    <Button onClick={to_settings} style={{ width: "100%" }}>
                        Settings
                    </Button>
                    <Button style={{ color: "red", width: "100%" }} onClick={logout}>
                        Logout
                    </Button>
                </Box>
            </Popover>
        </>
    );
}
