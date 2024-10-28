import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import React from "react";
import InputLabel from "@mui/material/InputLabel";
import {FormHelperText, IconButton, InputAdornment, OutlinedInput} from "@mui/material";
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
    const [errors, setSignupError] = React.useState([]);

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
        setSignupError([]);

        // Are any fields blank?
        if (blankFieldsCheck()) {
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
        if (!validatePassword()) {
            isValid = false;
        }

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

        // Empty field
        if (username === "") {
            setSignupError(prev => [...prev, 7]);
            return false;
        }

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
                setSignupError(prev => [...prev, 1]); // Username was taken
                return false;
            }

        } catch (e) {
            setSignupError(prev => [...prev, -1]); // Unknown Error
            return false;
        }

        return true;
    }

    async function validateEmail () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Is empty?
        if (email === "") {
            setSignupError(prev => [...prev, 9]);
            return false;
        }

        // Is email an email?
        if (!emailRegex.test (email)) {
            setSignupError(prev => [...prev, 2]); // Email not formatted correctly
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
                setSignupError(prev => [...prev, 3]); // Email already used
                return false;
            }

        } catch (e) {
            setSignupError(prev => [...prev, -2]); // Unknown Error
            return false;
        }

        return true;
    }

    // Ensures the password matches requirements
    function validatePassword() {

        // Empty field
        if (password === "") {
            setSignupError(prev => [...prev, 8]);
            return false;
        }

        let isValid = true;
        const min_pass_length = 8;

        // Is characters 8 or more?
        if (password.length < min_pass_length) {
            isValid = false;
            setSignupError(prev => [...prev, 4]); // Password not correct length
        }

        // Is there a number?
        if (!/\d/.test(password)) {
            setSignupError(prev => [...prev, 5]); // Password missing a number
            isValid = false;
        }

        // Is there a cap?
        if (!/[A-Z]/.test(password)) {
            setSignupError(prev => [...prev, 6]); // Password missing a cap
            isValid = false;
        }

        return isValid;
    }

    function blankFieldsCheck() {

        let empty = false;

        // First Name
        if (firstName === "") {
            empty = true;
            setSignupError(prev => [...prev, 10]);
        }

        // Last Name
        if (lastName === "") {
            empty = true;
            setSignupError(prev => [...prev, 11]);
        }

        return empty;
    }

    function getLoginErrorMessage(type) {

        if (errors.length === 0) {return '';}

        let message = "";

        // Loops through to check all errors in array and returns the first error that matches the type
        for (const err of errors){
            switch (err) {

                case -2: // Email Error
                    if (type === 'email') {
                        message = "Unknown Email Error";
                        return message;
                    }

                    break;

                case -1: // Username Error
                    if (type === 'username') {
                        message = "Unknown Username Error";
                        return message;
                    }

                    break;

                case 1: // Username was taken
                    if (type === 'username') {
                        message = "This username is already taken";
                        return message;
                    }

                    break;

                case 2: // Email not formatted correctly
                    if (type === 'email') {
                        message = "Please enter a valid email";
                        return message;
                    }

                    break;

                case 3: // Email taken
                    if (type === 'email') {
                        message = "This email is already taken";
                        return message;
                    }

                    break;

                case 4: // Password does not meet length condition
                    if (type === 'password') {
                        message = "Password does not meet the requirement: 8 characters minimum";
                        return message;
                    }

                    break;

                case 5: // Password missing number
                    if (type === 'password') {
                        message = "Password does not meet the requirement: at least 1 number";
                        return message;
                    }

                    break;

                case 6: // Password missing cap
                    if (type === 'password') {
                        message = "Password does not meet the requirement: at least 1 capital letter";
                        return message;
                    }

                    break;

                case 7: // Empty Username
                    if (type === 'username') {
                        message = "A username is required";
                        return message;
                    }

                    break;

                case 8: // Empty Password
                    if (type === 'password') {
                        message = "A password is required";
                        return message;
                    }

                    break;

                case 9: // Empty Email
                    if (type === 'email') {
                        message = "A email is required";
                        return message;
                    }

                    break;

                case 10: // fname empty
                    if (type === 'fname') {
                        message = "Your first name is required";
                        return message;
                    }

                    break;

                case 11: // lname empty
                    if (type === 'lname') {
                        message = "Your last name is required";
                        return message;
                    }

                    break;

                default: // Unknown Error
                    return ('Unknown Error code: ' + err)
            }
        }

        return message;
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
                                onChange={(e) => setFirstName (e.target.value)}
                            />
                        </FormControl>

                        {/* Last Name */}
                        <FormControl sx={{m : 1, width : '30ch'}} variant="outlined">
                            <TextField
                                required
                                id="lname"
                                type="text"
                                label="Last Name"
                                onChange={(e) => setLastName (e.target.value)}
                            />
                        </FormControl>
                    </div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getLoginErrorMessage ("fname")}</div>
                        <div className="App-Right-SignIn-Error">{getLoginErrorMessage ("lname")}</div>
                    </div>

                    <div>
                        {/* Username */}
                        <FormControl sx={{m : 1, width : '62ch'}} variant="outlined">
                            <TextField
                                required
                                id="signup-username"
                                type="text"
                                label="Username"
                                onChange={(e) => setUsername (e.target.value)}
                            />
                        </FormControl>
                    </div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getLoginErrorMessage ("username")}</div>
                    </div>

                    <div>
                        {/* Email */}
                        <FormControl sx={{m : 1, width : '62ch'}} variant="outlined">
                            <TextField
                                required
                                id="signup-email"
                                type="email"
                                label="Email"
                                onChange={(e) => setEmail (e.target.value)}
                            />
                        </FormControl>
                    </div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getLoginErrorMessage ("email")}</div>
                    </div>

                    <div>
                        {/* Password */}
                        <FormControl sx={{m : 1, width : '62ch'}} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password" required>Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setPassword (e.target.value)}
                                required
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide password' : 'show password'
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

                            <FormHelperText style={{textAlign : 'center'}}>
                                Your password should be at least 8 characters long and include at least one uppercase
                                letter and one number. Adding special characters is recommended for extra security.
                            </FormHelperText>
                        </FormControl>
                    </div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getLoginErrorMessage ("password")}</div>
                    </div>

                </div>

                <div className="Signup-Form-Footer">
                    <Button variant="contained" onClick={() => registerUser ()}
                            sx={{backgroundColor : '#42A5F5', m : 1, width : '62ch'}}>Create
                        Account</Button>
                </div>

            </div>
        </div>
    );
}