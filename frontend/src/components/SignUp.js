import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import React from "react";
import InputLabel from "@mui/material/InputLabel";
import {IconButton, InputAdornment, OutlinedInput} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

export default function SignUp() {

    const [showPassword, setShowPassword] = React.useState(false);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState("");

    const nav = useNavigate();


    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const registerUser = async () => {
        let isValid = true;

        // Are any fields blank?
        if (blankFieldsCheck()) {
            alert("You left some fields empty!");
            isValid = false;
        }

        // Is email matching conditions
        if (!await validateEmail ()) {
            isValid = false;
        }

        // Is username matching conditions?
        if (!await validateUsername()) {
            isValid = false;
        }

        // Is password matching conditions?


        // If an error occur, return early
        if (!isValid) {
            return;
        }

        // Send a POST to URL to create an account
        try {
            const response = await fetch('http://localhost:3001/api/users/register', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email.toLowerCase(),
                    password: password,
                    firstName: firstName.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()),
                    lastName: lastName.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()),
                    role: "user"
                }),
            });

            alert(await response.json());


        } catch (e) {
            alert("failed: " + e);
        }

        // Leave register page when finished
        nav("/");

    };

    async function validateUsername () {

        // Is this username taken
        try {
            const response = await fetch ("http://localhost:3001/api/users/has-username/" + username, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                }});

            const data = await response.json();
            const usernameFounded = data.found;

            // Username is in the system
            if (usernameFounded) {
                alert("Username has been taken!");
                return false;
            }

        } catch (e) {
            alert("failed: " + e);
            return false;
        }

        return true;
    }

    async function validateEmail () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Is email an email?
        if (!emailRegex.test (email)) {
            alert("Email is not formatted correctly!")
            return false;
        }

        // Does this email already have an account?
        try {
            const response = await fetch ("http://localhost:3001/api/users/has-email/" + email.toLowerCase(), {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                }});

            const data = await response.json();
            const emailFounded = data.found;

            // Email is in the system
            if (emailFounded) {
                alert("Email already exists!");
                return false;
            }

        } catch (e) {
            alert("failed: " + e);
            return false;
        }

        return true;
    }

    function blankFieldsCheck() {

        let empty = false;

        // Username
        if (username === "") {
            empty = true;
        }

        // Password
        if (password === "") {
            empty = true;
        }

        // Email
        if (email === "") {
            empty = true;
        }

        // First Name
        if (firstName === "") {
            empty = true;
        }

        // Last Name
        if (lastName === "") {
            empty = true;
        }

        return empty;
    }

    return (
        <div className="Signup">
            <div className="Signup-Form">

                <div className="Signup-Form-Title">
                    Create an account

                    <p>
                        Unlock personalize stock tracking fitted towards your portfolio
                    </p>

                    <hr  />
                </div>

                <div className="Signup-Form-Input">

                    <div className="Signup-Form-Input-Names">
                        {/* First Name */}
                        <FormControl sx={{m : 1, width : '30ch'}} variant="outlined">
                            <TextField
                                required
                                id="fname"
                                type="text"
                                label="First Name"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </FormControl>

                        {/* Last Name */}
                        <FormControl sx={{m : 1, width : '30ch'}} variant="outlined">
                            <TextField
                                required
                                id="lname"
                                type="text"
                                label="Last Name"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </FormControl>
                    </div>

                    <div>
                        {/* Username */}
                        <FormControl sx={{m : 1, width : '62ch'}} variant="outlined">
                            <TextField
                                required
                                id="signup-username"
                                type="text"
                                label="Username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </FormControl>
                    </div>

                    <div>
                        {/* Email */}
                        <FormControl sx={{m : 1, width : '62ch'}} variant="outlined">
                            <TextField
                                required
                                id="signup-email"
                                type="email"
                                label="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                    </div>

                    <div>
                        {/* Password */}
                        <FormControl sx={{m : 1, width : '62ch'}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password" required>Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setPassword(e.target.value)}
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
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                    </div>


                </div>

                <div className="Signup-Form-Footer">
                    <Button variant="contained" onClick={() => registerUser()} sx={{backgroundColor : '#42A5F5', m : 1, width : '62ch'}}>Create
                        Account</Button>
                </div>

            </div>
        </div>
    );
}