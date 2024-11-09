import Avatar from "@mui/material/Avatar";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";

export default function ProfileIcon({user, setUser, setUserToken}) {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'profile-popover' : undefined;

    // Logs the user out
    function logout () {
        setUser(null);
        setUserToken(null);
    }

    return (
        <>
            <div className="App-Right-Profile" onClick={handleClick}>
                <Avatar>{user.firstName.charAt (0) + user.lastName.charAt (0)}</Avatar>
            </div>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical : 'bottom',
                    horizontal : 'right',
                }}
                transformOrigin={{
                    vertical : 'top',
                    horizontal : 'right',
                }}
            >
                <Typography sx={{p : 2}}>Hello {user.firstName}!</Typography>
                {user.role === "admin" ? <Button>Admin Panel</Button> : ""}
                <Button onClick={logout}>Logout</Button>
            </Popover>
        </>
    );
}