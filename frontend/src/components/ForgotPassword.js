import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import React from "react";
import Button from "@mui/material/Button";
import {FormHelperText, IconButton, InputAdornment, OutlinedInput} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export default function ForgotPassword() {

    const [email, setEmail] = React.useState("");
    const [emailError, setEmailError] = React.useState(0);
    const [code, setCode] = React.useState("");
    const [lockEmail, setLockEmail] = React.useState(false);
    const [codeError, setCodeError] = React.useState(0);
    const [lockCode, setLockCode] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showVerifiedPassword, setShowVerifiedPassword] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [passwordError, setPasswordError] = React.useState(0);
    const [verifiedPassword, setVerifiedPassword] = React.useState("");
    const [verifiedPasswordError, setVerifiedPasswordError] = React.useState(0);
    const [verificationCode, setVerificationCode] = React.useState("");

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowVerifiedPassword = () => setShowVerifiedPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const resetPassword = async () => {

        // Need to know which step we are on :: Either 1 (Email) - 2 (Verification Code) - or 3 (Password)
        if (!lockEmail) await step_one_email()
        else if (!lockCode) await step_two_code ()
        else await step_three_code()

    }

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
                    label={verified ? "Verify Password" : "New Password"}
                    sx={{
                        '& fieldset' : {
                            borderColor : (verified ? verifiedPasswordError : passwordError) !== 0 ? 'red' : 'grey',
                        },
                    }}
                />

                <FormHelperText style={{textAlign : 'center'}}>
                    {verified ? "Enter your new password again and then press the button one last time." : "Your password should be at least 8 characters long, and include at least one uppercase letter and one number. Adding special characters is recommended for extra security."}
                </FormHelperText>
            </FormControl>
        );
    }

    const code_field = () => {
        return (
            <FormControl sx={{m : 1, width : '62ch'}} variant="outlined">
                <TextField
                    required
                    id="code-field"
                    type="text"
                    label="Vertification Code"
                    disabled={lockCode}
                    sx={{
                        '& .MuiOutlinedInput-root' : {
                            '& fieldset' : {
                                borderColor : codeError !== 0 ? 'red' : 'grey',
                            },
                        },
                    }}
                    onChange={(e) => setCode (e.target.value)}
                />

                <FormHelperText style={{textAlign : 'center'}}>
                    {lockCode ? "" : "A code has been generated and sent to this email if it exist within our system. Please check your inbox and enter the code you received. Press the button again to continue."}
                </FormHelperText>

            </FormControl>
        );
    }

    // Does step 3 - Verify Passwords and reset the users password
    async function step_three_code() {

        // Check if password fields are empty
        password === "" ? setPasswordError(1) : setPasswordError(0);
        verifiedPassword === "" ? setVerifiedPasswordError(1) : setVerifiedPasswordError(0);

        // Check if password meets the conditions
        if (password !== "" && !validatePassword()) return;

        if (password === "" || verifiedPassword === "") return;

        // Check if password matches
        if (password !== verifiedPassword) {
            setVerifiedPasswordError(2);
            return;
        }

        // Reset the password
        try {

            const response = await fetch ("http://localhost:3001/api/users/verify-email-code/", {
                method : 'PUT',
                headers : {
                    'content-type' : 'application/json',
                },
                body: JSON.stringify({
                    email: email.toLowerCase(),
                    code: code,
                    hashed: verificationCode,
                    password: password,
                })
            });

            // Success
            if (response.ok) {
                alert("Password has been updated.")
            } else {
                const errorText = await response.text();
                alert(errorText);
                setPasswordError(-1);
                setVerifiedPasswordError(-1);
            }

        }
        catch (e) {
            setPasswordError(-1);
            setVerifiedPasswordError(-1);

            console.error(e);
        }

    }

    // Does Step 2 - Verify code is correct
    async function step_two_code() {

        setCodeError(0);

        // Check if empty
        if (code === "") {
            setCodeError(1);
            return;
        }



        // Check if code is correct
        try {

            const response = await fetch ("http://localhost:3001/api/users/verify-email-code/", {
                method : 'PUT',
                headers : {
                    'content-type' : 'application/json',
                },
                body: JSON.stringify({
                    email: email.toLowerCase(),
                    hashed: verificationCode,
                    code: code,
                    password: "",
                })
            });



            const data = await response.json();

            if (!data.matched) {
                setCodeError(2);
                return;
            }

        } catch (e) {
            console.error(e);
            setCodeError(-1);
            alert(e)
            return;
        }

        // Lock Code
        setLockCode(true);

    }

    // Does Step 1 - Verify email and send code to email
    async function step_one_email() {
        setEmailError(0);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Check if email is blank
        if (email === "") {
            setEmailError(1);
            return;
        }

        // Is the email valid?
        if (!emailRegex.test(email)) {
            setEmailError(2);
            return;
        }

        // Lock Email Address
        setLockEmail(true);

        // Does email exist in system? (if not then do nothing)
        try {
            const response = await fetch ("http://localhost:3001/api/users/has-email/" + email.toLowerCase (), {
                method : 'GET',
                headers : {
                    'content-type' : 'application/json',
                }
            });

            const data = await response.json ();
            const emailFounded = data.found;

            // Email is not in the system
            if (!emailFounded) {
                return;
            }


            // Send code to email
            const res = await fetch('http://localhost:3001/api/email/send-code/' + email.toLowerCase(), {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                },
            });



            const dat = await res.json();
            setVerificationCode(dat["code"])

        }
        catch (e) {
            console.log("Error has occurred: " + e)
            alert(e)
        }
    }

    function validatePassword() {

        let isValid = true;
        const min_pass_length = 8;

        // Is characters 8 or more?
        if (password.length < min_pass_length) {
            isValid = false;
            setPasswordError(2); // Password not correct length
        }

        // Is there a number?
        if (!/\d/.test(password)) {
            setPasswordError(3); // Password missing a number
            isValid = false;
        }

        // Is there a cap?
        if (!/[A-Z]/.test(password)) {
            setPasswordError(4); // Password missing a cap
            isValid = false;
        }

        return isValid;
    }

    function getCodeError() {

        switch (codeError) {
            case 0: // No Error
                return "";
            case 1: // Blank
                return "A code is required";
            case 2: // Incorrect code
                return "Incorrect Code";
            default: // Unknown Error
                return "An unknown error has occurred";
        }

    }

    function getEmailError() {

        switch (emailError) {
            case 0: // No Error
                return "";
            case 1: // Blank
                return "A email is required";
            case 2: // Incorrect Email Format
                return "Please enter a valid email address";
            default: // Unknown Error
                return "An unknown error has occurred";
        }

    }

    function getPasswordError() {
        switch (passwordError) {
            case 0: // No Error
                return "";
            case 1: // Blank
                return "A Password is required";
            case 2: // Password not correct length
                return "Password does not meet the requirement: 8 characters minimum";
            case 3: // Password missing a number
                return "Password does not meet the requirement: at least 1 number";
            case 4: // Password missing a cap
                return "Password does not meet the requirement: at least 1 capital letter";
            default: // Unknown Error
                return "An unknown error has occurred";
        }
    }

    function getVPasswordError() {
        switch (verifiedPasswordError) {
            case 0: // No error
                return "";
            case 1: // Blank
                return "A Password is required";
            case 2: // Password does not match
                return "Passwords do not match";
            default: // Unknown Error
                return "An unknown error has occurred";
        }
    }

    return (
        <div className="Forget-Password">
            <div className="Forget-Password-Form">
                <div className="Forget-Password-Title">
                    Forgot Your Password?
                    <p>That's okay! We all make mistakes. Enter your email below to begin resetting your password.</p>

                    <hr/>
                </div>

                <div className="Forget-Password-Input">


                    {/* Email */}
                    <div>
                        <FormControl sx={{m : 1, width : '62ch'}} variant="outlined">
                            <TextField
                                required
                                id="signup-email"
                                type="email"
                                label="Email"
                                disabled={lockEmail}
                                sx={{
                                    '& .MuiOutlinedInput-root' : {
                                        '& fieldset' : {
                                            borderColor : emailError !== 0 ? 'red' : 'grey',
                                        },
                                    },
                                }}
                                onChange={(e) => setEmail (e.target.value)}
                            />
                        </FormControl>
                    </div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getEmailError ()}</div>
                    </div>

                    {/* Code */}
                    <div>
                        {lockEmail ? code_field () : ""}
                    </div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getCodeError ()}</div>
                    </div>

                    {/* Password */}
                    <div>
                        {lockCode ? password_field (false) : ""}
                    </div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getPasswordError ()}</div>
                    </div>

                    <div>
                        {lockCode ? password_field (true) : ""}
                    </div>

                    <div style={{display : 'flex', justifyContent : 'space-between', flexDirection : 'row'}}>
                        <div className="App-Right-SignIn-Error">{getVPasswordError ()}</div>
                    </div>

                </div>

                <div className="Forget-Password-Footer">
                    <Button variant="contained" onClick={() => resetPassword ()}
                            sx={{backgroundColor : '#42A5F5', m : 1, width : '62ch'}}>Reset Password</Button>
                </div>

            </div>
        </div>
    );
}