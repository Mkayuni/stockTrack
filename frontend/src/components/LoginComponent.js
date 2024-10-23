import React from "react";
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {FilledInput, IconButton, Input, InputAdornment, OutlinedInput} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";

export default function LoginComponent() {

    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showPassword, setShowPassword] = React.useState(false);

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
                                            id="email-box"
                                            type="email"
                                            label="Email"
                                        />
                                    </FormControl>
                                </div>

                                <div className="App-Right-SignIn-UsernamePassword">
                                    <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password" required>Password</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
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

                                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                                    <Link to='/' className="App-Right-SignIn-UsernamePassword-Links"> Forgot Password? </Link>
                                    <Link to='/' className="App-Right-SignIn-UsernamePassword-Links"> Sign Up </Link>
                                </div>

                                <Button variant="contained" sx={{backgroundColor: '#42A5F5'}} style={{marginTop: '8px'}}>Log in</Button>

                            </div>
                        </Box>
                    </Fade>
                )}
            </Popper>
        </>
    );
}