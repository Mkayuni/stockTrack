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
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginError, setLoginError] = React.useState([]);

    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);

    const onSignIn = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((previousOpen) => !previousOpen);

        if (!open) setLoginError([]);

        setEmail('');
        setUsername('');
        setPassword('');

        setEmailError(false);
        setPasswordError(false);
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
        setAnchorEl(null);
    }

    // User attempts to log into our system
    const loginUser = async () => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let isValid = true;
        setLoginError([]);

        // Email/Username is left empty
        if (email === '' && username === '') {
            setLoginError(prev => [...prev, 4]);
            isValid = false;
        }

        // Email in field is not a correct email address
        if (email !== '' && !emailRegex.test(email)) {
            setLoginError(prev => [...prev, 5]);
            isValid = false;
        }

        // Password is left empty
        if (password === '') {
            setLoginError(prev => [...prev, 3]);
            isValid = false;
        }

        // Don't fetch if there are errors
        if (!isValid) {
            return;
        }

        if (username !== '') {
            await loginUsername();
        } else {
            await loginEmail();
        }

    };

    async function loginEmail() {
        try {
            // Fetches Login API
            const response = await fetch('http://localhost:3001/api/users/login', {
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
                setUser(await getUserInfo(data.token)); // Fetches the user from token

                setLoginError([]);
            }
            // Fail to login
            else {

                // Email is not registered in system
                if (response.status === 404) {
                    setLoginError(prev => [...prev, 1]);
                }
                // Password is incorrect
                else if (response.status === 401) {
                    setLoginError(prev => [...prev, 2]);
                }
                // Other Errors
                else {
                    setLoginError(prev => [...prev, -1]);
                }
            }
        } catch (e) {
            setLoginError(prev => [...prev, -1]);
        }
    }

    async function loginUsername() {
        try {
            // Fetches Login API
            const response = await fetch('http://localhost:3001/api/users/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            // Successful login
            if (response.ok) {
                const data = await response.json();

                setUserToken(data.token); // Fetches the user token for auth.
                setUser(await getUserInfo(data.token)); // Fetches the user from token

                setLoginError([]);
            }
            // Fail to login
            else {

                // Username is not registered in system
                if (response.status === 404) {
                    setLoginError(prev => [...prev, 6]);
                }
                // Password is incorrect
                else if (response.status === 401) {
                    setLoginError(prev => [...prev, 2]);
                }
                // Other Errors
                else {
                    setLoginError(prev => [...prev, -1]);
                }
            }
        } catch (e) {
            setLoginError(prev => [...prev, -1]);
        }
    }

    // Fetches user data from login generated token
    async function getUserInfo(token) {

        // Fetch data
        try {
            const response = await fetch(`http://localhost:3001/api/users/self`, {
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

    function setUsernameOrEmail(input) {
        
        // Determine if it is an email or username
        if (input.includes('@')) {
            setEmail(input);
            setUsername('');
        }
        else {
            setUsername(input);
            setEmail('');
        }

    }

    function getLoginErrorMessage(type) {

        if (loginError.length === 0) {return '';}

        let message = "";

        // Loops through to check all errors in array and returns the first error that matches the type
        for (const err of loginError){
            switch (err) {
                case 1: // Email Error
                    if (type === 'email') {
                        message = "No account found for this email";
                        setEmailError(true);
                        return message;
                    }

                    break;

                case 2: // Password Error
                    if (type === 'password') {
                        message = "Incorrect Password";
                        setPasswordError(true);
                        return message;
                    }

                    break;

                case 3: // Empty Password
                    if (type === 'password') {
                        message = "A password is required";
                        setPasswordError(true);
                        return message;
                    }

                    break;

                case 4: // Empty Email or Username
                    if (type === 'email') {
                        message = "A email or username is required";
                        setEmailError(true);
                        return message;
                    }

                    break;

                case 5: // Email not formatted correctly
                    if (type === 'email') {
                        message = "Please enter a valid email"
                        setEmailError(true);
                        return message;
                    }

                    break;

                case 6: // No username found
                    if (type === 'email') {
                        message = "No account found for this username"
                        setEmailError(true);
                        return message;
                    }

                    break;

                default: // Unknown Error
                    setEmailError(true);
                    setPasswordError(true);
                    return ('Unknown Error')
            }
        }

        if (type === 'password') setPasswordError(false);
        else setEmailError(false);

        return message;
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
                                            onChange={(e) => setUsernameOrEmail(e.target.value.toLowerCase())}
                                            id="email-box"
                                            type="email"
                                            label="Email/Username"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': {
                                                        borderColor: emailError ? 'red' : 'grey',
                                                    },
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                {/* Display Email/Username Errors */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                                    <div className="App-Right-SignIn-Error">{getLoginErrorMessage("email")}</div>
                                </div>

                                {/* Recovery & Sign Up Links
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                                    <Link to='/forgot-username-or-email' onClick={closePopper} className="App-Right-SignIn-UsernamePassword-Links"> Forgot Email or Username? </Link>
                                </div> */}

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
                                            sx={{
                                                '& fieldset': {
                                                    borderColor: passwordError ? 'red' : 'grey',
                                                },
                                            }}
                                        />
                                    </FormControl>
                                </div>

                                {/* Display Password Errors */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                                    <div className="App-Right-SignIn-Error">{getLoginErrorMessage("password")}</div>
                                </div>

                                {/* Recovery & Sign Up Links */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                                    <Link to='/forgot-password' onClick={closePopper} className="App-Right-SignIn-UsernamePassword-Links"> Forgot Password? </Link>
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