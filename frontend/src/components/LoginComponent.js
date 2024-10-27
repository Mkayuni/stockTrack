import React from "react";
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {IconButton, InputAdornment, OutlinedInput} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";

export default function LoginComponent({setUser, setUserToken}) {

    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showPassword, setShowPassword] = React.useState(false);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginError, setLoginError] = React.useState(0);

    const onSignIn = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);
    };

    const canBeOpen = open && Boolean(anchorEl);
    const id = canBeOpen ? 'transition-popper' : undefined;
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const closePopper = () => {
        setOpen(false);
        setAnchorEl(null)
    }

    // User attempts to log into our system
    const loginUser = async () => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Email is left empty
        if (email === '') {
            setLoginError(4);
            return;
        }

        // Email in field is not a correct email address
        if (!emailRegex.test(email)) {
            setLoginError(5);
            return;
        }

        // Password is left empty
        if (password === '') {
            setLoginError(3);
            return;
        }

        try {
            // Fetches Login API
            const response = await fetch('/users/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            // Successful login
            if (response.ok) {
                const data = await response.json();

                setUserToken(data.token); // Fetches the user token for auth.
                setUser(getUserInfo(data.token)); // Fetches the user from token

                setLoginError(0);
            }
            // Fail to login
            else {

                // Email is not registered in system
                if (response.status === 404) {
                    setLoginError(1);
                }
                // Password is incorrect
                else if (response.status === 401) {
                    setLoginError(2);
                }
                // Other Errors
                else {
                    setLoginError(3);
                }
            }
        } catch (e) {
            setLoginError(-1);
        }

    };

    // Fetches user data from login generated token
    async function getUserInfo(token) {

        // Get user ID from token
        const userID = 5;

        // Fetch data
        try {
            const response = await fetch(`/user/${userID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Error fetching data
            if (!response.ok) {
                alert('Failed to fetch user info');
                return null;
            }

            return await response.json ();
        }
        catch (e) {
            alert('Failed to fetch user info');
            return null;
        }

    }

    function getLoginErrorMessage(type) {

        let message = "";
        let errorType = "";

        switch (loginError) {
            case 0: // No Error
                return ('');

            case 1: // Email Error
                errorType = 'email';
                message = "There are no accounts with that email";
                break;

            case 2: // Password Error
                errorType = 'password';
                message = "Incorrect Password";
                break;

            case 3: // Empty Password
                errorType = 'password';
                message = "You can not leave the password field empty";
                break;

            case 4: // Empty Email
                errorType = 'email';
                message = "You can not leave the email field empty!";
                break;

            case 5:
                errorType = 'email';
                message = "Please enter a valid email"
                break;

            default: // Unknown Error
                return ('Unknown Error')
        }

        if (errorType === type) return (message);
        else return ('');
    }

    return (
        <>
            <div className="App-Right-SignIn" onClick={onSignIn} id={id}>Sign In</div>

            <Popper id={id} open={open} anchorEl={anchorEl} transition modifiers={[{name: 'offset', options: {offset: [-155, 10]}}]}>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Box sx={{ position: 'relative', border: 0, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', p: 2, bgcolor: 'background.paper', borderRadius: 5 }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '8px solid transparent',
                                    borderRight: '8px solid transparent',
                                    borderBottom: '8px solid white', // Same color as the Popper background
                                    top: -8, // Position the arrow right above the popper box
                                    right: '6%',
                                }}
                            />

                            <div className='App-Right-SignIn-Container'>
                                <div className="App-Right-SignIn-UsernamePassword">
                                    <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
                                        <TextField
                                            required
                                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                            id="email-box"
                                            type="email"
                                            label="Email"
                                        />
                                    </FormControl>
                                </div>

                                {/* Display Email Errors */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                                    <div className="App-Right-SignIn-Error">{getLoginErrorMessage("email")}</div>
                                </div>

                                <div className="App-Right-SignIn-UsernamePassword">
                                    <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password" required>Password</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label={
                                                            showPassword ? 'hide the password' : 'display the password'
                                                        }
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        onMouseUp={handleMouseUpPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        />
                                    </FormControl>
                                </div>

                                {/* Display Password Errors */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                                    <div className="App-Right-SignIn-Error">{getLoginErrorMessage("password")}</div>
                                </div>

                                {/* Recovery & Sign Up Links */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                                    <Link to='/' onClick={closePopper} className="App-Right-SignIn-UsernamePassword-Links"> Forgot Password? </Link>
                                    <Link to='/signup' onClick={closePopper} className="App-Right-SignIn-UsernamePassword-Links"> Sign Up </Link>
                                </div>

                                <Button variant="contained" sx={{backgroundColor: '#42A5F5'}} onClick={() => loginUser()} style={{marginTop: '8px'}}>Log in</Button>

                            </div>
                        </Box>
                    </Fade>
                )}
            </Popper>
        </>
    );
}