import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import React from "react";
import InputLabel from "@mui/material/InputLabel";
import {FormHelperText, IconButton, InputAdornment, OutlinedInput} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

import {validateUsername, validatePassword, validateVerifyPassword, validateEmail, blankFieldsCheck, getLoginErrorMessage} from "../globals/validationFunctions";

export default function SignUp() {

    const [showPassword, setShowPassword] = React.useState(false);
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [errors, setSignupError] = React.useState([]);

    const [lnameError, setLnameError] = React.useState(false);
    const [fnameError, setFNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [usernameError, setUsernameError] = React.useState(false);
    const [verifiedPassword, setVerifiedPassword] = React.useState("");
    const [verifiedPasswordError, setVerifiedPasswordError] = React.useState(false);
    const [showVerifiedPassword, setShowVerifiedPassword] = React.useState(false);

    const nav = useNavigate();


    const handleClickShowVerifiedPassword = () => setShowVerifiedPassword((show) => !show);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const password_field = (verified) => {
        return (
            <FormControl sx={{m : 1, width : '62ch'}} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password" required>{verified ? "Verify Password" : "New Password"}</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={verified ? (showVerifiedPassword ? 'text' : 'password') : (showPassword ? 'text' : 'password')}
                    onChange={(e) => verified ? setVerifiedPassword(e.target.value) : setPassword (e.target.value)}
                    required
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label={
                                    verified ? (showVerifiedPassword ? 'hide password' : 'show password') : (showPassword ? 'hide password' : 'show password')
                                }
                                onClick={verified ? handleClickShowVerifiedPassword : handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    }
                    label={verified ? "Verify Password" : "Password"}
                    sx={{
                        '& fieldset' : {
                            borderColor : (verified ? verifiedPasswordError : passwordError) ? 'red' : 'grey',
                        },
                    }}
                />

                <FormHelperText style={{textAlign : 'center'}}>
                    {verified ? "Reenter your password for verification." : "Your password should be at least 8 characters long, and include at least one uppercase letter and one number. Adding special characters is recommended for extra security."}
                </FormHelperText>
            </FormControl>
        );
    }

    const registerUser = async () => {
        let isValid = true;
        setSignupError([]);

        // Are any fields blank?
        if (blankFieldsCheck(firstName, lastName, setFNameError, setLnameError, setSignupError)) {
            isValid = false;
        }

        // Is email matching conditions
        if (!await validateEmail (email, setSignupError)) {
            isValid = false;
            setEmailError(true);
        } else setEmailError(false);

        // Is username matching conditions?
        if (!await validateUsername(username, setSignupError)) {
            isValid = false;
            setUsernameError(true);
        } else setUsernameError(false);

        // Is password matching conditions?
        if (!validatePassword(password, setSignupError)) {
            isValid = false;
            setPasswordError(true);
        } else setPasswordError(false);

        // Is validate password matching conditions?
        if (!validateVerifyPassword(verifiedPassword, password, setSignupError)) {
            isValid = false;
            setVerifiedPasswordError(true);
        } else setVerifiedPasswordError(false);

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

            //alert(await response.json());


        } catch (e) {
            alert("failed: " + e);
        }

        // Leave register page when finished
        nav("/");

    };

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
                                sx={{
                                    '& .MuiOutlinedInput-root' : {
                                        '& fieldset' : {
                                            borderColor : fnameError ? 'red' : 'grey',
                                        },
                                    },
                                }}
                            />
                        </FormControl>

                        {/* Last Name */}
                        <FormControl sx={{m : 1, width : '30ch'}} variant="outlined">
                            <TextField
                                required
                                id="lname"
                                type="text"
                                label="Last Name"
                                sx={{
                                    '& .MuiOutlinedInput-root' : {
                                        '& fieldset' : {
                                            borderColor : lnameError ? 'red' : 'grey',
                                        },
                                    },
                                }}
                                onChange={(e) => setLastName (e.target.value)}
                            />
                        </FormControl>
                    </div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getLoginErrorMessage ("fname", errors)}</div>
                        <div className="App-Right-SignIn-Error">{getLoginErrorMessage ("lname", errors)}</div>
                    </div>

                    <div>
                        {/* Email */}
                        <FormControl sx={{m : 1, width : '62ch'}} variant="outlined">
                            <TextField
                                required
                                id="signup-email"
                                type="email"
                                label="Email"
                                sx={{
                                    '& .MuiOutlinedInput-root' : {
                                        '& fieldset' : {
                                            borderColor : emailError ? 'red' : 'grey',
                                        },
                                    },
                                }}
                                onChange={(e) => setEmail (e.target.value)}
                            />
                        </FormControl>
                    </div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getLoginErrorMessage ("email", errors)}</div>
                    </div>

                    <div>
                        {/* Username */}
                        <FormControl sx={{m : 1, width : '62ch'}} variant="outlined">
                            <TextField
                                required
                                id="signup-username"
                                type="text"
                                label="Username"
                                sx={{
                                    '& .MuiOutlinedInput-root' : {
                                        '& fieldset' : {
                                            borderColor : usernameError ? 'red' : 'grey',
                                        },
                                    },
                                }}
                                onChange={(e) => setUsername (e.target.value)}
                            />

                            <FormHelperText style={{textAlign : 'center'}}>
                                Usernames may include letters, numbers, and any special character except for the '@'
                                symbol.
                                Additionally, the username must have at least three characters.
                            </FormHelperText>

                        </FormControl>
                    </div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getLoginErrorMessage ("username", errors)}</div>
                    </div>

                    <div>{password_field (false)}</div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getLoginErrorMessage ("password", errors)}</div>
                    </div>

                    <div>{password_field (true)}</div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getLoginErrorMessage ("verify-password", errors)}</div>
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